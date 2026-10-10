"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const go = (e) => {
    e.preventDefault();
    if (q.trim()) router.push(`/cari?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <form onSubmit={go} style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="search" style={{ height: 64, padding: "0 10px 0 24px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
        </svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nama surah, doa, atau 2:255" aria-label="Cari" />
        <button type="submit" className="btn btn-primary" style={{ height: 46, padding: "0 22px" }}>Cari</button>
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>Contoh: Yasin · 36 · 2:255 · Ayat Kursi · Doa Rezeki</p>
    </form>
  );
}
