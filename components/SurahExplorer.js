"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";

const TABS = [
  { id: "surah", label: "Surah" },
  { id: "juz", label: "Juz" },
];

export default function SurahExplorer({ surahs }) {
  const [tab, setTab] = useState("surah");
  const [q, setQ] = useState("");
  const [desc, setDesc] = useState(false);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let base = surahs;
    if (s) base = base.filter((x) => x.name.toLowerCase().includes(s) || x.translate.toLowerCase().includes(s) || String(x.id) === s);
    return desc ? [...base].reverse() : base;
  }, [surahs, tab, q, desc]);

  const juzGroups = useMemo(() => {
    const map = new Map();
    list.forEach((s) => {
      if (!map.has(s.juz_id)) map.set(s.juz_id, []);
      map.get(s.juz_id).push(s);
    });
    return [...map.entries()].sort((a, b) => (desc ? b[0] - a[0] : a[0] - b[0]));
  }, [list, desc]);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div role="tablist" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className="chip" onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="search" style={{ height: 44, width: 260 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter surah…" style={{ fontSize: 14 }} />
          </div>
          <button className="chip" onClick={() => setDesc(!desc)}>{desc ? "Z–A" : "A–Z"} ↕</button>
        </div>
      </div>

      {tab !== "juz" ? (
        <div className="stagger" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))" }}>
          {list.map((s) => <SurahCard key={s.id} s={s} />)}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 36 }}>
          {juzGroups.map(([juz, arr]) => (
            <Reveal key={juz}>
              <div className="eyebrow" style={{ marginBottom: 14 }}>Juz {juz}</div>
              <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))" }}>
                {arr.map((s) => <SurahCard key={s.id} s={s} />)}
              </div>
            </Reveal>
          ))}
        </div>
      )}
      {list.length === 0 && <p className="muted" style={{ marginTop: 24 }}>Tidak ada surah yang cocok.</p>}
    </div>
  );
}

function SurahCard({ s }) {
  return (
    <Link href={`/surah/${s.id}`} className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 14, fontWeight: 700, color: "var(--neon)", background: "rgba(61,255,181,.08)", border: "1px solid rgba(61,255,181,.25)" }}>
        {s.id}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
        <div className="muted" style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.translate} · {s.verse_count} ayat · {s.type}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
