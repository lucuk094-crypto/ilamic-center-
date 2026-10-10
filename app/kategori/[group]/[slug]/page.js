import Link from "next/link";
import { notFound } from "next/navigation";
import { GROUPS } from "@/lib/content";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return Object.entries(GROUPS).flatMap(([group, g]) => g.items.map((it) => ({ group, slug: it.slug })));
}

function find(group, slug) {
  const g = GROUPS[group];
  if (!g) return null;
  return { g, item: g.items.find((i) => i.slug === slug) };
}

export function generateMetadata({ params }) {
  const f = find(params.group, params.slug);
  return { title: f?.item?.title };
}

export default function ItemPage({ params }) {
  const f = find(params.group, params.slug);
  if (!f?.item) notFound();
  const { g, item } = f;

  return (
    <div className="container fade-page">
      <nav className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
        <Link href={`/kategori/${params.group}`}>{g.name}</Link> <span>/</span> <span>{item.title}</span>
      </nav>
      <section style={{ padding: "8px 0 40px" }}>
        <div className="eyebrow">{g.name}</div>
        <h1 className="h1 gradient-text" style={{ marginTop: 14, fontSize: "clamp(2rem,5vw,3.2rem)" }}>{item.title}</h1>
        <p className="muted" style={{ marginTop: 12 }}>{item.sections.length} bagian</p>
      </section>

      <div style={{ display: "grid", gap: 14 }}>
        {item.sections.map((s, i) => (
          <Reveal key={s.slug} delay={Math.min(i, 8) * 40}>
            <section id={s.slug} className="card" style={{ padding: 26, scrollMarginTop: 120 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span className="ayat-no" style={{ width: 34, height: 34, fontSize: 12 }}>{i + 1}</span>
                <h2 style={{ fontSize: 19, fontWeight: 600 }}>{s.title}</h2>
              </div>
              <p className="muted" style={{ marginTop: 14, fontSize: 14 }}>
                Teks bagian ini belum tersedia di data yang dimasukkan.
              </p>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
