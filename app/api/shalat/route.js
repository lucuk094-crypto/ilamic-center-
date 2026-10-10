import { NextResponse } from "next/server";

// Proxy ke equran.id (Kemenag RI) untuk jadwal sholat.
// GET /api/shalat?type=provinsi
// GET /api/shalat?type=kabkota&provinsi=Jawa%20Timur
// GET /api/shalat?type=jadwal&provinsi=Jawa%20Timur&kabkota=Kota%20Kediri&bulan=10&tahun=2026
const BASE = "https://equran.id/api/v2/shalat";

export async function GET(req) {
  const sp = req.nextUrl.searchParams;
  const type = sp.get("type");
  try {
    let res;
    if (type === "provinsi") {
      res = await fetch(`${BASE}/provinsi`, { next: { revalidate: 60 * 60 * 24 * 30 } });
    } else if (type === "kabkota") {
      res = await fetch(`${BASE}/kabkota`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provinsi: sp.get("provinsi") }),
        next: { revalidate: 60 * 60 * 24 * 30 },
      });
    } else if (type === "jadwal") {
      const now = new Date();
      res = await fetch(BASE, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provinsi: sp.get("provinsi"),
          kabkota: sp.get("kabkota"),
          bulan: Number(sp.get("bulan")) || now.getMonth() + 1,
          tahun: Number(sp.get("tahun")) || now.getFullYear(),
        }),
        next: { revalidate: 60 * 60 * 6 },
      });
    } else {
      return NextResponse.json({ error: "type tidak valid" }, { status: 400 });
    }
    const json = await res.json();
    return NextResponse.json(json, { status: res.ok ? 200 : res.status });
  } catch (e) {
    return NextResponse.json({ error: "Gagal memuat jadwal sholat" }, { status: 502 });
  }
}
