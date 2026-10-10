import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "56px 0 120px", position: "relative", overflow: "hidden" }}>
      <div className="orb" style={{ width: 360, height: 360, background: "var(--neon)", right: -120, bottom: -180, opacity: 0.12 }} />
      <div className="container" style={{ display: "grid", gap: 36, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", position: "relative" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Islamic <span className="gradient-text">Center</span></div>
          <p className="muted" style={{ marginTop: 10, fontSize: 14, maxWidth: 320 }}>
            Bacaan Al-Qur'an dengan tajwid, terjemahan, dan audio, serta kumpulan doa, wirid, dan maulid.
          </p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Menu</div>
          <div style={{ display: "grid", gap: 8, fontSize: 14 }} className="muted">
            <Link href="/">Al-Qur'an</Link>
            <Link href="/kategori/doa">Doa</Link>
            <Link href="/kategori/wirid">Wirid</Link>
            <Link href="/kategori/maulid">Maulid</Link>
            <Link href="/hadits">Hadits</Link>
            <Link href="/khutbah">Khutbah</Link>
            <Link href="/keislaman">Keislaman</Link>
            <Link href="/jadwal-sholat">Jadwal Sholat</Link>
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Sumber Data</div>
          <div style={{ display: "grid", gap: 8, fontSize: 13 }} className="muted">
            <span>Teks Arab bertajwid: quran.nu.or.id</span>
            <span>Terjemahan & audio: equran.id (Kemenag RI)</span>
            <span>Jadwal sholat: equran.id (Kemenag RI)</span>
            <span>Hadits: hadits.nu.or.id</span>
            <span>Khutbah & Keislaman: islam.nu.or.id</span>
          </div>
        </div>
      </div>
      <div className="container muted" style={{ marginTop: 48, fontSize: 12, textAlign: "center" }}>
        © {new Date().getFullYear()} Islamic Center
      </div>
    </footer>
  );
}
