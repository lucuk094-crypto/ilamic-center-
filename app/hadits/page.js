import HaditsSearch from "@/components/HaditsSearch";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Hadits" };

export default function HaditsPage() {
  return (
    <div className="container fade-page">
      <Reveal>
        <div className="eyebrow">Hadits</div>
        <h1 className="h1 gradient-text" style={{ marginTop: 14, fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>Cari Hadits</h1>
        <p className="muted" style={{ marginTop: 12, marginBottom: 36, maxWidth: 580 }}>
          Ketik kata kunci untuk mencari hadits. Pencarian dilakukan di Hadits NU Online.
        </p>
      </Reveal>
      <HaditsSearch />
    </div>
  );
}
