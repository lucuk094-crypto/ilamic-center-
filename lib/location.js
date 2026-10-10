// Pencocokan hasil reverse geocoding (OpenStreetMap) ke daftar resmi equran.id
const norm = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/\b(kabupaten|kota|kab|kab\.|provinsi|daerah istimewa|daerah khusus ibukota|dki)\b/g, " ")
    .replace(/[^a-z]/g, "");

// Cocokkan nama provinsi (mis. "Jawa Timur") ke daftar equran
export function matchProvinsi(state, list) {
  if (/yogyakarta/i.test(state || "")) return list.find((p) => /yogyakarta/i.test(p)) || null;
  const s = norm(state);
  if (!s) return null;
  return list.find((p) => norm(p) === s) || list.find((p) => norm(p).includes(s) || s.includes(norm(p))) || null;
}

// Cocokkan kabupaten/kota. Nominatim memakai "city" untuk kota dan "county"/"city" untuk kabupaten.
// Daftar equran memakai "Kota X" atau "Kab. X".
export function matchKabkota(address, list) {
  const candidates = [address.city, address.county, address.municipality, address.town, address.regency]
    .filter(Boolean);
  for (const c of candidates) {
    const isKota = /^kota\b/i.test(c) || /\bkota\b/i.test(c);
    const isKab = /kabupaten|kab\./i.test(c);
    const key = norm(c);
    const match =
      list.find((k) => norm(k) === key && (isKota ? /^kota/i.test(k) : isKab ? /^kab/i.test(k) : true)) ||
      list.find((k) => norm(k) === key);
    if (match) return match;
  }
  return null;
}
