import ArticleIndex from "@/components/ArticleIndex";
import Reveal from "@/components/Reveal";
import { KEISLAMAN } from "@/lib/islam";

export const metadata = { title: "Keislaman" };

export default function KeislamanPage() {
  return (
    <div className="container fade-page">
      <Reveal>
        <div className="eyebrow">Keislaman</div>
        <h1 className="h1 gradient-text" style={{ marginTop: 14, fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>Bahtsul Masail & Tanya Jawab</h1>
        <p className="muted" style={{ marginTop: 12, marginBottom: 36, maxWidth: 600 }}>Jawaban atas pertanyaan keislaman, dari redaksi keislaman NU Online.</p>
      </Reveal>
      <ArticleIndex items={KEISLAMAN} basePath="/keislaman" placeholder="Cari, misalnya: nifas, shalat, warisan…" />
    </div>
  );
}
