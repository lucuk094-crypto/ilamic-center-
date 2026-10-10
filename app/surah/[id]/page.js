import surahs from "@/data/surahs.json";
import ReadingView from "@/components/ReadingView";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return surahs.map((s) => ({ id: String(s.id) }));
}

export function generateMetadata({ params }) {
  const s = surahs.find((x) => x.id === Number(params.id));
  return { title: s ? `${s.name} — ${s.translate}` : "Surah" };
}

export default function SurahPage({ params }) {
  const id = Number(params.id);
  const meta = surahs.find((x) => x.id === id);
  if (!meta) notFound();
  return <ReadingView meta={meta} />;
}
