import ArticleBody from "@/components/ArticleBody";
import { KEISLAMAN } from "@/lib/islam";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return KEISLAMAN.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }) {
  const item = KEISLAMAN.find((i) => i.slug === params.slug);
  return { title: item ? item.judul : "Keislaman" };
}

export default function KeislamanDetail({ params }) {
  const item = KEISLAMAN.find((i) => i.slug === params.slug);
  if (!item) notFound();
  return (
    <div className="container fade-page" style={{ paddingTop: 48 }}>
      <ArticleBody item={item} backHref="/keislaman" backLabel="Semua tanya jawab"
        sourceNote="Sumber: islam.nu.or.id (NU Online). Hak cipta konten dimiliki NU Online." />
    </div>
  );
}
