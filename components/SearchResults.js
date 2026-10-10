"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState, useEffect } from "react";

const norm = (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9:]+/g, "");

function SearchInner({ index }) {
  const sp = useSearchParams();
  const router = useRouter();
  const initial = sp.get("q") || "";
  const [q, setQ] = useState(initial);

  useEffect(() => setQ(initial), [initial]);

  const results = useMemo(() => {
    const raw = q.trim();
    if (!raw) return [];
    // Format ayat: 2:255
    const m = /^(\d{1,3}):(\d{1,3})$/.exec(raw);
    if (m) return [{ type: "Ayat", title: `Surah ${m[1]} ayat ${m[2]}`, sub: "Buka di pembaca", href: `/surah/${m[1]}#${m[2]}` }];
    const n = norm(raw);
    if (!n) return [];
    return index
      .map((it) => {
        const hay = it.keys.map(norm);
        const exact = hay.some((k) => k === n);
        const starts = hay.some((k) => k.startsWith(n));
        const inc = hay.some((k) => k.includes(n)) || norm(it.title).includes(n);
        const score = exact ? 3 : starts ? 2 : inc ? 1 : 0;
        return { it, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60)
      .map((x) => x.it);
  }, [q, index]);

  const submit = (e) => {
    e.preventDefault();
    router.replace(`/cari?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div>
      <section style={{ padding: "20px 0 30px" }}>
        <div className="eyebrow">Pencarian</div>
        <h1 className="h2" style={{ marginTop: 12, marginBottom: 22 }}>Cari surah, doa, wirid, atau ayat</h1>
        <form onSubmit={submit} style={{ maxWidth: 680 }}>
          <div className="search" style={{ height: 60 }}>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ketik di sini… contoh: Yasin, 2:255, Doa Rezeki" style={{ fontSize: 17 }} />
          </div>
        </form>
      </section>

      {!q.trim() && (
        <p className="muted">Ketik kata kunci untuk mulai mencari.</p>
      )}
      {q.trim() && results.length === 0 && <p className="muted">Tidak ada hasil untuk "{q}".</p>}

      <div className="stagger" style={{ display: "grid", gap: 10 }}>
        {results.map((r, i) => (
          <Link key={r.href + i} href={r.href} className="card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div className="badge" style={{ marginBottom: 6, display: "inline-block" }}>{r.type}</div>
              <div style={{ fontWeight: 600 }}>{r.title}</div>
              <div className="muted" style={{ fontSize: 13 }}>{r.sub}</div>
            </div>
            <span style={{ color: "var(--neon)" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SearchResults({ index }) {
  return (
    <Suspense fallback={<p className="muted">Memuat…</p>}>
      <SearchInner index={index} />
    </Suspense>
  );
}
