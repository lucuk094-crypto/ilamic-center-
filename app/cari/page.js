import SearchResults from "@/components/SearchResults";
import surahs from "@/data/surahs.json";
import { GROUPS, SPECIAL } from "@/lib/content";

export const metadata = { title: "Cari" };

export default function CariPage() {
  // Semua item yang bisa dicari, dikirim ke client
  const index = [];
  surahs.forEach((s) => index.push({ type: "Surah", title: s.name, sub: `${s.translate} · ${s.verse_count} ayat`, href: `/surah/${s.id}`, keys: [s.slug, s.translate, String(s.id)] }));
  Object.entries(GROUPS).forEach(([group, g]) => {
    g.items.forEach((it) => {
      index.push({ type: g.name, title: it.title, sub: `${it.sections.length} bagian`, href: `/kategori/${group}/${it.slug}`, keys: [it.title] });
      it.sections.forEach((s) => index.push({ type: g.name, title: s.title, sub: it.title, href: `/kategori/${group}/${it.slug}#${s.slug}`, keys: [s.title, it.title] }));
    });
  });
  SPECIAL.forEach((s) => index.push({ type: "Pilihan", title: s.name, sub: "Ayat/surah pilihan", href: s.href, keys: [s.slug, ...s.aliases] }));

  return (
    <div className="container fade-page">
      <SearchResults index={index} />
    </div>
  );
}
