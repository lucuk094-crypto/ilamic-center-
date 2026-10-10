# Islamic Center

Website Al-Qur'an, doa, wirid, dan maulid dengan tampilan modern-minimalis, animasi halus, dan pemutar audio per ayat.

## Jalankan lokal

```bash
npm install
npm run dev        # http://localhost:3000
```

## Struktur penting

| Path | Fungsi |
|---|---|
| `data/surahs.json` | 114 surah (nama, arti, jumlah ayat, juz) dari data Anda |
| `lib/content.js` | Kategori doa, wirid, maulid, dan alias pilihan dari indeks pencarian Anda |
| `app/api/surah/[id]/route.js` | Menggabungkan teks Arab bertajwid (quran.nu.or.id) dengan terjemahan & audio (equran.id) |
| `components/PlayerContext.js`, `Player.js` | Pemutar audio global (putar per ayat, next/prev, pilih qari, lanjut otomatis) |
| `app/globals.css` | Tema gelap, aksen neon, dan animasi |

## Deploy ke Vercel

1. Upload folder ini ke GitHub (buat repo baru, lalu `git init && git add . && git commit -m "init" && git push`).
2. Buka https://vercel.com/new, impor repo tersebut.
3. Framework terdeteksi otomatis sebagai **Next.js**. Klik **Deploy**.

## Catatan

- Endpoint terjemahan `quran.nu.or.id/api/translations/tr/{n}` berbahasa **Turki**, dan parameter angkanya adalah nomor surah. Karena itu terjemahan Indonesia diambil dari equran.id.
- Isi teks doa, wirid, dan maulid tidak ada di data yang dikirim, sehingga halaman bagian menampilkan placeholder. Teksnya bisa ditambahkan di `lib/content.js`.
- Konten NU Online (teks, tajwid, audio) adalah milik penyedianya. Untuk situs publik, pastikan Anda memiliki izin atau menggunakan sumber data sendiri.
