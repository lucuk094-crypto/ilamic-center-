"use client";
import { useState } from "react";
import Reveal from "./Reveal";

const TOPICS = ["niat", "shalat", "puasa", "sedekah", "akhlak", "ilmu", "silaturahim", "doa"];

export default function HaditsSearch() {
  const [q, setQ] = useState("");
  const url = (term) => `https://hadits.nu.or.id/search?q=${encodeURIComponent(term)}`;

  return (
    <div>
      <Reveal>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) window.open(url(q.trim()), "_blank", "noopener,noreferrer"); }} style={{ maxWidth: 680 }}>
          <div className="search" style={{ height: 62, padding: "0 10px 0 22px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Contoh: niat, sedekah, menuntut ilmu" aria-label="Kata kunci hadits" style={{ fontSize: 16 }} />
            <button type="submit" className="btn btn-primary" style={{ height: 46, padding: "0 22px" }}>Cari</button>
          </div>
        </form>
      </Reveal>

      <Reveal delay={120}>
        <div className="eyebrow" style={{ marginTop: 40, marginBottom: 14 }}>Topik populer</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {TOPICS.map((t) => (
            <a key={t} href={url(t)} target="_blank" rel="noopener noreferrer" className="chip">{t}</a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="card" style={{ marginTop: 40, padding: 28 }}>
          <div style={{ fontWeight: 600, fontSize: 17 }}>Kenapa membuka situs NU?</div>
          <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
            Hasil hadits berasal dari situs Hadits NU Online, yang memuat teks dan takhrijnya. Data hadits tidak dimuat ulang di aplikasi ini agar sumbernya tetap terjaga dan selalu mutakhir.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
