import Link from "next/link";
import { notFound } from "next/navigation";
import { GROUPS } from "@/lib/content";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return Object.keys(GROUPS).map((group) => ({ group }));
}

export function generateMetadata({ params }) {
  return { title: GROUPS[params.group]?.name };
}

export default function GroupPage({ params }) {
  const g = GROUPS[params.group];
  if (!g) notFound();
  return (
    <div className="container fade-page">
      <section style={{ padding: "24px 0 40px" }}>
        <div className="eyebrow">Kumpulan</div>
        <h1 className="h1 gradient-text" style={{ marginTop: 14 }}>{g.name}</h1>
        <p className="muted" style={{ marginTop: 14, maxWidth: 620 }}>{g.description}</p>
      </section>
      <div className="stagger" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
        {g.items.map((it) => (
          <Link key={it.slug} href={`/kategori/${params.group}/${it.slug}`} className="card" style={{ padding: 22, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{it.title}</div>
              <div className="muted" style={{ fontSize: 13 }}>{it.sections.length} bagian</div>
            </div>
            <span style={{ color: "var(--neon)" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
