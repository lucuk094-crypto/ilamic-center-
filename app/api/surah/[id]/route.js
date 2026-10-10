import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; // cache 24 jam

const NU_TAJWEED = "https://quran.nu.or.id/data/tajweed/97bc3ca5";
const EQURAN = "https://equran.id/api/v2/surat";

export async function GET(_req, { params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1 || id > 114) {
    return NextResponse.json({ error: "Surah tidak ditemukan" }, { status: 404 });
  }

  try {
    const [taj, eq] = await Promise.all([
      fetch(`${NU_TAJWEED}/${id}.json`, { next: { revalidate: 86400 } }).then((r) => r.json()),
      fetch(`${EQURAN}/${id}`, { next: { revalidate: 86400 } }).then((r) => r.json()),
    ]);

    const eqAyat = eq?.data?.ayat ?? [];

    // Susun ayat: teks Arab bertajwid dari NU + terjemahan & audio dari equran.id
    const ayat = eqAyat.map((a) => {
      const segs = taj[String(a.nomorAyat)] ?? [];
      return {
        n: a.nomorAyat,
        arabic: segs.map(([t, rule]) => ({ t, r: rule || null })),
        arabicPlain: a.teksArab,
        latin: a.teksLatin,
        indonesia: a.teksIndonesia,
        audio: a.audio ?? {},
      };
    });

    return NextResponse.json({
      id,
      name: eq?.data?.namaLatin,
      nameArabic: eq?.data?.nama,
      arti: eq?.data?.arti,
      tempatTurun: eq?.data?.tempatTurun,
      jumlahAyat: eq?.data?.jumlahAyat,
      deskripsi: eq?.data?.deskripsi,
      audioFull: eq?.data?.audioFull ?? {},
      suratSebelumnya: eq?.data?.suratSebelumnya ?? null,
      suratSelanjutnya: eq?.data?.suratSelanjutnya ?? null,
      ayat,
      source: { arabic: "quran.nu.or.id (tajwid)", translation: "equran.id (Kemenag RI)" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat data surah" }, { status: 502 });
  }
}
