import khutbah from "@/data/khutbah.json";
import bahtsul from "@/data/bahtsul-masail.json";

export const KHUTBAH = khutbah;
export const KEISLAMAN = bahtsul;

// Pecah teks datar menjadi paragraf (±3 kalimat per paragraf)
export function toParagraphs(text) {
  const sentences = text.split(/(?<=[.!?”])\s+(?=[A-Z“"‘(])/);
  const out = [];
  for (let i = 0; i < sentences.length; i += 3) out.push(sentences.slice(i, i + 3).join(" "));
  return out;
}

export function shortText(text, n = 180) {
  return text.length > n ? text.slice(0, n).replace(/\s+\S*$/, "") + "…" : text;
}
