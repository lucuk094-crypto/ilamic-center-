import Link from "next/link";
import surahs from "@/data/surahs.json";
import { GROUPS } from "@/lib/content";
import SurahExplorer from "@/components/SurahExplorer";
import Reveal from "@/components/Reveal";
import HeroSearch from "@/components/HeroSearch";

const PHRASES = ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "ٱللَّهُ أَكْبَرُ", "لَا إِلَٰهَ إِلَّا اللَّهُ", "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", "حَسْبُنَا اللَّهُ وَنِعْمَ ٱلْوَكِيلُ"];

export default function Home() {
  const totalDoa = GROUPS.doa.items.length;
  const totalWirid = GROUPS.wirid.items.length;
  const totalMaulid = GROUPS.maulid.items.length;

  return (
    <div className="fade-page">
      {/* HERO */}
      <section className="container" style={{ position: "relative", padding: "40px 0 80px", textAlign: "center", overflow: "visible" }}>
        <div className="orb" style={{ width: 380, height: 380, background: "var(--neon)", left: "-6%", top: -40 }} />
        <div className="orb" style={{ width: 320, height: 320, background: "var(--neon-2)", right: "-4%", top: 60, animationDelay: "-6s" }} />
        <div className="hero-ring" style={{ width: 560, height: 560, left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: -1 }} />
        <div className="hero-ring" style={{ width: 760, height: 760, left: "50%", top: "50%", transform: "translate(-50%,-50%)", animationDirection: "reverse", zIndex: -1, borderColor: "rgba(94,242,255,.08)" }} />

        <div className="stagger" style={{ position: "relative" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>Al-Qur'an · Doa · Wirid · Maulid</div>
          <h1 className="h1 gradient-text" style={{ marginTop: 20 }}>
            Cahaya Al-Qur'an<br />dalam Genggaman
          </h1>
          <p className="muted" style={{ maxWidth: 560, margin: "22px auto 0", fontSize: 17 }}>
            Baca dengan teks Arab bertajwid berwarna, terjemahan Indonesia, dan dengarkan audio qari pilihan Anda di setiap ayat.
          </p>
          <div style={{ marginTop: 36 }}>
            <HeroSearch />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
            <Link href="/surah/1" className="btn btn-primary pulse">Mulai dari Al-Fatihah →</Link>
            <Link href="/kategori/doa" className="btn btn-ghost">Jelajah Doa</Link>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" style={{ padding: "18px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="marquee-track">
          {[...PHRASES, ...PHRASES].map((p, i) => <span key={i}>{p}</span>)}
        </div>
      </div>

      {/* STATS */}
      <section className="container" style={{ padding: "70px 0 20px" }}>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          {[
            { n: 114, l: "Surah" },
            { n: 6236, l: "Ayat" },
            { n: totalDoa, l: "Kelompok Doa" },
            { n: totalWirid + totalMaulid, l: "Wirid & Maulid" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 80}>
              <div className="card" style={{ padding: 26 }}>
                <div className="gradient-text" style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.n.toLocaleString("id-ID")}</div>
                <div className="muted" style={{ fontSize: 14 }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MENU */}
      <section className="container" style={{ padding: "80px 0 20px" }}>
        <Reveal>
          <div className="eyebrow">Jelajahi</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Semua bacaan dalam satu tempat</h2>
        </Reveal>
        <div style={{ display: "grid", gap: 16, marginTop: 36, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
          {Object.entries(GROUPS).map(([key, g], i) => (
            <Reveal key={key} delay={i * 90}>
              <Link href={`/kategori/${key}`} className="card" style={{ padding: 28, display: "block", minHeight: 210, overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(61,255,181,.25), transparent 70%)", transition: "transform .8s var(--ease)" }} className="card-glow" />
                <div className="badge">{g.items.length} kelompok</div>
                <div style={{ fontSize: 26, fontWeight: 650, marginTop: 40, letterSpacing: "-0.02em" }}>{g.name}</div>
                <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>{g.description}</p>
                <div style={{ marginTop: 22, color: "var(--neon)", fontSize: 14 }}>Buka →</div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SURAH */}
      <section className="container" style={{ padding: "90px 0 40px" }}>
        <Reveal>
          <div className="eyebrow">Al-Qur'an</div>
          <h2 className="h2" style={{ marginTop: 12 }}>Daftar Surah</h2>
          <p className="muted" style={{ marginTop: 8, marginBottom: 32 }}>Pilih surah, lalu putar audio per ayat.</p>
        </Reveal>
        <SurahExplorer surahs={surahs} />
      </section>
    </div>
  );
}
