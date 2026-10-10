"use client";
import { useEffect, useMemo, useState } from "react";
import Reveal from "./Reveal";
import { matchKabkota, matchProvinsi } from "@/lib/location";

const PRAYERS = [
  { key: "imsak", label: "Imsak" },
  { key: "subuh", label: "Subuh" },
  { key: "terbit", label: "Terbit" },
  { key: "dhuha", label: "Dhuha" },
  { key: "dzuhur", label: "Dzuhur" },
  { key: "ashar", label: "Ashar" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isya", label: "Isya" },
];
// Yang dihitung mundur untuk "sholat berikutnya"
const COUNTED = ["subuh", "dzuhur", "ashar", "maghrib", "isya"];

const WIB = { timeZone: "Asia/Jakarta" };

function wibNow() {
  // Waktu WIB sebagai Date lokal (tanpa pengaruh zona perangkat)
  const s = new Date().toLocaleString("en-US", { ...WIB });
  return new Date(s);
}

export default function JadwalSholat() {
  const [provinsi, setProvinsi] = useState("Jawa Timur");
  const [provList, setProvList] = useState([]);
  const [kabList, setKabList] = useState([]);
  const [kabkota, setKabkota] = useState("Kota Kediri");
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [now, setNow] = useState(() => wibNow());
  const [geo, setGeo] = useState({ status: "idle", label: "", msg: "" });

  useEffect(() => {
    const t = setInterval(() => setNow(wibNow()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/shalat?type=provinsi").then((r) => r.json()).then((d) => setProvList(d.data || []));
  }, []);

  useEffect(() => {
    setKabList([]);
    fetch(`/api/shalat?type=kabkota&provinsi=${encodeURIComponent(provinsi)}`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.data || [];
        setKabList(list);
        if (!list.includes(kabkota)) setKabkota(list[0] || "");
      });
  }, [provinsi]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!kabkota) return;
    setData(null); setErr(null);
    const y = now.getFullYear(), m = now.getMonth() + 1;
    fetch(`/api/shalat?type=jadwal&provinsi=${encodeURIComponent(provinsi)}&kabkota=${encodeURIComponent(kabkota)}&bulan=${m}&tahun=${y}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setData(d.data))
      .catch(() => setErr("Jadwal belum bisa dimuat. Coba pilih kota lain atau muat ulang."));
  }, [provinsi, kabkota]); // eslint-disable-line react-hooks/exhaustive-deps

  // Deteksi lokasi lewat GPS browser -> reverse geocoding -> cocokkan ke daftar equran
  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "error", label: "", msg: "Browser tidak mendukung deteksi lokasi." });
      return;
    }
    setGeo({ status: "loading", label: "", msg: "Mendeteksi lokasi…" });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&addressdetails=1&accept-language=id&lat=${lat}&lon=${lon}`
          );
          const j = await r.json();
          const a = j.address || {};
          const prov = matchProvinsi(a.state, provList);
          if (!prov) throw new Error("prov");
          const kabRes = await fetch(`/api/shalat?type=kabkota&provinsi=${encodeURIComponent(prov)}`);
          const kabs = (await kabRes.json()).data || [];
          const kab = matchKabkota(a, kabs);
          if (!kab) throw new Error("kab");
          setProvinsi(prov);
          setKabkota(kab);
          setGeo({ status: "ok", label: `${kab}, ${prov}`, msg: "" });
        } catch (e) {
          setGeo({
            status: "error",
            label: "",
            msg: e.message === "prov" || e.message === "kab"
              ? "Lokasi terdeteksi, tetapi belum cocok dengan daftar kota kami. Silakan pilih manual."
              : "Gagal membaca nama lokasi. Silakan pilih manual.",
          });
        }
      },
      (err) => {
        const msg = err.code === 1
          ? "Izin lokasi ditolak. Aktifkan izin lokasi di browser, atau pilih manual."
          : "Lokasi tidak tersedia saat ini. Silakan pilih manual.";
        setGeo({ status: "error", label: "", msg });
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 }
    );
  };

  const todayStr = useMemo(() => {
    const y = now.getFullYear(), m = String(now.getMonth() + 1).padStart(2, "0"), d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [now]);

  const today = data?.jadwal?.find((j) => j.tanggal_lengkap === todayStr);

  const next = useMemo(() => {
    if (!today) return null;
    const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
    for (const k of COUNTED) {
      const tm = toMin(today[k]);
      if (tm > minutes) return { key: k, label: PRAYERS.find((p) => p.key === k).label, diff: (tm - minutes) * 60 };
    }
    // Setelah Isya: Subuh besok (pakai jadwal hari ini sebagai perkiraan)
    return { key: "subuh", label: "Subuh (besok)", diff: (24 * 60 - minutes + toMin(today.subuh)) * 60 };
  }, [today, now]);

  const fmtDiff = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const select = {
    background: "rgba(255,255,255,.04)", border: "1px solid var(--line-hi)", borderRadius: 999,
    padding: "12px 18px", fontSize: 14, outline: "none", minWidth: 220,
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32, alignItems: "center" }}>
        <button type="button" onClick={detectLocation} disabled={geo.status === "loading"} className="btn btn-primary" style={{ height: 50, padding: "0 22px" }}>
          {geo.status === "loading" ? "Mendeteksi…" : "📍 Gunakan lokasi saya"}
        </button>
        <select aria-label="Provinsi" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} style={select}>
          {provList.map((p) => <option key={p} value={p} style={{ background: "#0a0e16" }}>{p}</option>)}
        </select>
        <select aria-label="Kabupaten/Kota" value={kabkota} onChange={(e) => setKabkota(e.target.value)} style={select}>
          {kabList.map((k) => <option key={k} value={k} style={{ background: "#0a0e16" }}>{k}</option>)}
        </select>
      </div>

      {(geo.status === "ok" || geo.status === "error") && (
        <p role="status" style={{ fontSize: 14, marginTop: -16, marginBottom: 28, color: geo.status === "ok" ? "var(--neon)" : "#ff8a9a" }}>
          {geo.status === "ok" ? `Lokasi terdeteksi: ${geo.label}` : geo.msg}
        </p>
      )}

      {/* Kartu hari ini */}
      <Reveal>
        <div className="card" style={{ padding: 32, overflow: "hidden" }}>
          <div className="orb" style={{ width: 240, height: 240, background: "var(--neon)", right: -60, top: -60, opacity: 0.2 }} />
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div className="eyebrow">Hari ini · {data?.kabkota || kabkota}</div>
              <div style={{ fontSize: 15, marginTop: 10 }} className="muted">
                {now.toLocaleDateString("id-ID", { ...WIB, weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
                {now.toLocaleTimeString("id-ID", { ...WIB, hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ":")}
                <span className="muted" style={{ fontSize: 14, marginLeft: 10 }}>WIB</span>
              </div>
            </div>
            {next && (
              <div style={{ textAlign: "right" }}>
                <div className="muted" style={{ fontSize: 13 }}>Menuju {next.label}</div>
                <div className="gradient-text" style={{ fontSize: 44, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.03em" }}>
                  −{fmtDiff(next.diff)}
                </div>
              </div>
            )}
          </div>

          {today && (
            <div style={{ position: "relative", display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", marginTop: 28 }}>
              {PRAYERS.map((p) => {
                const isNext = next?.key === p.key && COUNTED.includes(p.key);
                return (
                  <div key={p.key} className="card" style={{ padding: "16px 14px", textAlign: "center", borderColor: isNext ? "rgba(61,255,181,.5)" : undefined, background: isNext ? "rgba(61,255,181,.08)" : undefined }}>
                    <div className="muted" style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase" }}>{p.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 650, marginTop: 6, fontVariantNumeric: "tabular-nums", color: isNext ? "var(--neon)" : undefined }}>{today[p.key]}</div>
                  </div>
                );
              })}
            </div>
          )}
          {!data && !err && <p className="muted" style={{ marginTop: 20 }}>Memuat jadwal…</p>}
          {err && <p style={{ color: "#ff8a9a", marginTop: 20 }}>{err}</p>}
        </div>
      </Reveal>

      {/* Tabel bulan */}
      {data?.jadwal && (
        <Reveal delay={100}>
          <div className="card" style={{ marginTop: 22, padding: 8, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 720 }}>
              <thead>
                <tr style={{ color: "var(--muted)", textAlign: "center" }}>
                  {["Tanggal", "Imsak", "Subuh", "Terbit", "Dhuha", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((h) => (
                    <th key={h} style={{ padding: "12px 10px", fontWeight: 500, fontSize: 12, letterSpacing: ".06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.jadwal.map((j) => {
                  const isToday = j.tanggal_lengkap === todayStr;
                  return (
                    <tr key={j.tanggal} style={{ textAlign: "center", borderTop: "1px solid var(--line)", background: isToday ? "rgba(61,255,181,.08)" : "transparent", color: isToday ? "var(--neon)" : undefined }}>
                      <td style={{ padding: "10px", textAlign: "left", fontWeight: isToday ? 700 : 400 }}>{j.hari}, {j.tanggal}</td>
                      {["imsak", "subuh", "terbit", "dhuha", "dzuhur", "ashar", "maghrib", "isya"].map((k) => (
                        <td key={k} style={{ padding: "10px", fontVariantNumeric: "tabular-nums" }}>{j[k]}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      )}
      <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>Sumber: equran.id (Kementerian Agama RI). Waktu dapat berbeda sedikit tergantung metode perhitungan dan lokasi.</p>
    </div>
  );
}
