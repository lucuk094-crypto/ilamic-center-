"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import { usePlayer } from "./PlayerContext";

// Urutan penting: ikhfa dicek sebelum ghunnah (ikhfa-syafawi juga mengandung "ikhfa")
const RULE_CLASS = (r) => {
  if (!r) return "";
  if (r === "tidak-dilafalkan") return "tj-silent";
  if (/^ikhfa/.test(r)) return "tj-ikhfa";
  if (/madd/.test(r)) return "tj-madd";
  if (/ghunnah|idgham|iqlab/.test(r)) return "tj-ghunnah";
  if (/qalqalah/.test(r)) return "tj-qalqalah";
  return "";
};

export default function ReadingView({ meta }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showLatin, setShowLatin] = useState(false);
  const [showTrans, setShowTrans] = useState(true);
  const [tajwid, setTajwid] = useState(true);
  const [arabicSize, setArabicSize] = useState(30);
  const { track, playing, playAt, toggle } = usePlayer();
  const rowRefs = useRef({});

  useEffect(() => {
    let alive = true;
    fetch(`/api/surah/${meta.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("gagal"))))
      .then((d) => alive && setData(d))
      .catch(() => alive && setError("Gagal memuat ayat. Periksa koneksi Anda dan coba lagi."));
    return () => { alive = false; };
  }, [meta.id]);

  const isThisSurah = track?.surah?.id === meta.id;
  const activeN = isThisSurah ? track.ayat[track.index]?.n : null;

  // Scroll ayat yang sedang diputar ke tengah layar
  useEffect(() => {
    if (activeN && rowRefs.current[activeN]) {
      rowRefs.current[activeN].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeN]);

  const playAll = () => {
    if (!data) return;
    if (isThisSurah) return toggle();
    playAt({ id: meta.id, name: meta.name, arti: meta.translate }, data.ayat, 0);
  };

  const playFrom = (i) => {
    if (isThisSurah && track.index === i) return toggle();
    playAt({ id: meta.id, name: meta.name, arti: meta.translate }, data.ayat, i);
  };

  const desc = useMemo(() => (data?.deskripsi || "").replace(/<[^>]+>/g, "").trim(), [data]);

  return (
    <div className="container fade-page">
      {/* Header surah */}
      <section style={{ position: "relative", textAlign: "center", padding: "24px 0 48px" }}>
        <div className="orb" style={{ width: 300, height: 300, background: "var(--neon)", left: "10%", top: -60, opacity: 0.25 }} />
        <div className="orb" style={{ width: 260, height: 260, background: "var(--gold)", right: "8%", top: 0, opacity: 0.15, animationDelay: "-5s" }} />
        <div className="stagger" style={{ position: "relative" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>Surah {meta.id} · {meta.type}</div>
          <h1 className="h1 gradient-text" style={{ marginTop: 16, fontSize: "clamp(2.4rem,6vw,4rem)" }}>{meta.name}</h1>
          <p className="muted" style={{ marginTop: 10 }}>
            {meta.translate} · {meta.verse_count} ayat · Juz {meta.juz_id}
          </p>
          {data?.nameArabic && (
            <div className="arabic" style={{ fontSize: 44, textAlign: "center", marginTop: 14, color: "var(--gold)", direction: "rtl" }}>
              {data.nameArabic}
            </div>
          )}
          {desc && <p className="muted" style={{ maxWidth: 680, margin: "18px auto 0", fontSize: 14 }}>{desc.slice(0, 340)}{desc.length > 340 ? "…" : ""}</p>}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={playAll} disabled={!data}>
              {isThisSurah && playing ? "❚❚ Jeda" : "▶ Putar Surah"}
            </button>
            <button className="chip" aria-pressed={showTrans} onClick={() => setShowTrans(!showTrans)}>Terjemahan</button>
            <button className="chip" aria-pressed={showLatin} onClick={() => setShowLatin(!showLatin)}>Latin</button>
            <button className="chip" aria-pressed={tajwid} onClick={() => setTajwid(!tajwid)}>Tajwid</button>
            <button className="chip" onClick={() => setArabicSize((s) => (s >= 44 ? 26 : s + 4))}>Aa</button>
          </div>
        </div>
      </section>

      {/* Ayat */}
      {error && <p style={{ color: "#ff8a9a", textAlign: "center" }}>{error}</p>}
      {!data && !error && <Skeleton />}

      {data && (
        <div style={{ display: "grid", gap: 14 }}>
          {data.ayat.map((a, i) => {
            const active = activeN === a.n;
            return (
              <Reveal key={a.n} delay={Math.min(i, 8) * 40}>
                <article
                  ref={(el) => (rowRefs.current[a.n] = el)}
                  className={`card ayat-row ${active ? "active" : ""}`}
                  style={{ padding: "26px 26px 22px", borderRadius: 26 }}
                  onClick={() => playFrom(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && playFrom(i)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <span className="ayat-no">{a.n}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {active && playing && <span className="eq playing"><i /><i /><i /><i /></span>}
                      <span className="muted" style={{ fontSize: 12 }}>{active ? (playing ? "Sedang diputar" : "Dijeda") : "Klik untuk putar"}</span>
                    </div>
                  </div>

                  <div className="arabic" style={{ fontSize: arabicSize, marginTop: 14, color: "var(--text)" }}>
                    {tajwid && a.arabic?.length
                      ? a.arabic.map((seg, k) => (
                          <span key={k} className={RULE_CLASS(seg.r)} title={seg.r || ""}>{seg.t}</span>
                        ))
                      : a.arabicPlain}
                  </div>

                  {showLatin && <p style={{ marginTop: 14, fontStyle: "italic", color: "var(--muted)", fontSize: 15 }}>{a.latin}</p>}
                  {showTrans && <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.75, color: "#d9e0ea" }}>{a.indonesia}</p>}
                </article>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Navigasi surah */}
      {data && (
        <nav style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr 1fr", marginTop: 48 }}>
          {data.suratSebelumnya ? (
            <NavCard href={`/surah/${data.suratSebelumnya.nomor}`} label="← Sebelumnya" name={data.suratSebelumnya.namaLatin} />
          ) : <span />}
          {data.suratSelanjutnya ? (
            <NavCard href={`/surah/${data.suratSelanjutnya.nomor}`} label="Berikutnya →" name={data.suratSelanjutnya.namaLatin} right />
          ) : <span />}
        </nav>
      )}

      {data && (
        <p className="muted" style={{ fontSize: 11, marginTop: 36, textAlign: "center" }}>
          Sumber: teks Arab bertajwid — quran.nu.or.id · terjemahan & audio — equran.id (Kemenag RI)
        </p>
      )}
    </div>
  );
}

function NavCard({ href, label, name, right }) {
  return (
    <Link href={href} className="card" style={{ padding: 22, textAlign: right ? "right" : "left" }}>
      <div className="muted" style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 600, marginTop: 4 }}>{name}</div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="card" style={{ height: 160, borderRadius: 26, background: "linear-gradient(90deg, rgba(255,255,255,.03), rgba(255,255,255,.08), rgba(255,255,255,.03))", backgroundSize: "200% 100%", animation: "shine 1.6s linear infinite" }} />
      ))}
    </div>
  );
}
