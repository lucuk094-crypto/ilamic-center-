import JadwalSholat from "@/components/JadwalSholat";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Jadwal Sholat" };

export default function JadwalPage() {
  return (
    <div className="container fade-page">
      <Reveal>
        <div className="eyebrow">Waktu Sholat</div>
        <h1 className="h1 gradient-text" style={{ marginTop: 14, fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>Jadwal Sholat</h1>
        <p className="muted" style={{ marginTop: 12, marginBottom: 36, maxWidth: 560 }}>Jadwal harian dan bulanan untuk seluruh Indonesia, dengan hitung mundur ke waktu sholat berikutnya.</p>
      </Reveal>
      <JadwalSholat />
    </div>
  );
}
