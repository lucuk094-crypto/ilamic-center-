import ArticleIndex from "@/components/ArticleIndex";
import Reveal from "@/components/Reveal";
import { KHUTBAH } from "@/lib/islam";

export const metadata = { title: "Khutbah Jumat" };

export default function KhutbahPage() {
  return (
    <div className="container fade-page">
      <Reveal>
        <div className="eyebrow">Khutbah</div>
        <h1 className="h1 gradient-text" style={{ marginTop: 14, fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>Khutbah Jumat</h1>
        <p className="muted" style={{ marginTop: 12, marginBottom: 36, maxWidth: 580 }}>Naskah khutbah Jumat dan khutbah khusus, lengkap dan siap dibaca.</p>
      </Reveal>
      <ArticleIndex items={KHUTBAH} basePath="/khutbah" placeholder="Cari judul atau isi khutbah…" />
    </div>
  );
}
