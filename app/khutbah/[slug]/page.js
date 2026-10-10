import ArticleBody from "@/components/ArticleBody";
import { KHUTBAH } from "@/lib/islam";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return KHUTBAH.map((i) => ({ slug: i.slug }));
}

export function generateMetadata({ params }) {
  const item = KHUTBAH.find((i) => i.slug === params.slug);
  return { title: item ? item.judul : "Khutbah" };
}

export default function KhutbahDetail({ params }) {
  const item = KHUTBAH.find((i) => i.slug === params.slug);
  if (!item) notFound();
  return (
    <div className="container fade-page" style={{ paddingTop: 48 }}>
      <ArticleBody item={item} backHref="/khutbah" backLabel="Semua khutbah"
        sourceNote="Sumber: islam.nu.or.id (NU Online). Hak cipta naskah dimiliki NU Online." />
    </div>
  );
}
