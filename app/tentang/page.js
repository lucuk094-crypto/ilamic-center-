export const metadata = { title: "Tentang" };

export default function Tentang() {
  return (
    <div className="container fade-page" style={{ maxWidth: 760 }}>
      <div className="eyebrow">Tentang</div>
      <h1 className="h2" style={{ marginTop: 14 }}>Islamic Center</h1>
      <div className="muted" style={{ marginTop: 18, display: "grid", gap: 14, fontSize: 16 }}>
        <p>Islamic Center menghadirkan bacaan Al-Qur'an dengan teks Arab bertajwid berwarna, terjemahan Bahasa Indonesia, serta audio per ayat dari berbagai qari.</p>
        <p>Di dalamnya juga tersedia kumpulan doa, wirid, shalawat, dan maulid, yang dapat dicari dan dijelajahi dengan mudah.</p>
        <p className="muted" style={{ fontSize: 14 }}>Sumber data: teks Arab bertajwid dari quran.nu.or.id; terjemahan dan audio dari equran.id (Kementerian Agama RI).</p>
      </div>
    </div>
  );
}
