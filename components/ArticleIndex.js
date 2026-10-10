"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import { shortText } from "@/lib/islam";

export default function ArticleIndex({ items, basePath, placeholder }) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => (i.judul + " " + i.isi).toLowerCase().includes(s));
  }, [q, items]);

  return (
    <div>
      <Reveal>
        <div className="search" style={{ height: 58, padding: "0 10px 0 22px", maxWidth: 620 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Cari artikel" style={{ fontSize: 15 }} />
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 14 }}>{list.length} dari {items.length} artikel</p>
      </Reveal>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", marginTop: 28 }}>
        {list.map((i, idx) => (
          <Reveal key={i.slug} delay={Math.min(idx, 8) * 40}>
            <Link href={`${basePath}/${i.slug}`} className="card" style={{ display: "block", padding: 24, height: "100%" }}>
              <div className="muted" style={{ fontSize: 12, letterSpacing: ".06em" }}>{i.tanggal.split("|")[0].replace("NU Online · ", "")}</div>
              <div style={{ fontWeight: 650, fontSize: 17, lineHeight: 1.35, marginTop: 10 }}>{i.judul}</div>
              <p className="muted" style={{ fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>{shortText(i.isi)}</p>
              {i.penulis && <div className="muted" style={{ fontSize: 12, marginTop: 14 }}>{i.penulis}</div>}
            </Link>
          </Reveal>
        ))}
      </div>
      {list.length === 0 && <p className="muted" style={{ marginTop: 28 }}>Tidak ada artikel yang cocok.</p>}
    </div>
  );
}
