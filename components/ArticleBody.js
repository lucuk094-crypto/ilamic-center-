import Link from "next/link";
import Reveal from "./Reveal";
import { toParagraphs } from "@/lib/islam";

export default function ArticleBody({ item, backHref, backLabel, sourceNote }) {
  const paras = toParagraphs(item.isi);
  return (
    <article style={{ maxWidth: 760, margin: "0 auto" }}>
      <Reveal>
        <Link href={backHref} className="muted" style={{ fontSize: 14 }}>← {backLabel}</Link>
        <div className="eyebrow" style={{ marginTop: 26 }}>{item.tanggal.replace("NU Online · ", "")}</div>
        <h1 className="h1" style={{ marginTop: 14, fontSize: "clamp(1.9rem,4vw,2.7rem)", lineHeight: 1.2 }}>{item.judul}</h1>
        {item.penulis && <div className="muted" style={{ marginTop: 14, fontSize: 14 }}>Oleh {item.penulis}</div>}
      </Reveal>
      <Reveal delay={100}>
        <div className="card" style={{ marginTop: 34, padding: "clamp(22px,4vw,44px)", lineHeight: 1.85, fontSize: 16.5 }}>
          {paras.map((p, i) => <p key={i} style={{ marginBottom: 18 }}>{p}</p>)}
        </div>
      </Reveal>
      <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>{sourceNote}</p>
    </article>
  );
}
