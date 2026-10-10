// Struktur konten diambil dari indeks pencarian yang Anda berikan.
// Format: [judul induk, [judul bagian, ...]]
// Slug dibuat otomatis dari judul (slugify).

export function slugify(s) {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&amp;/g, "dan")
    .replace(/&/g, "dan")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DOA = [
  ["Doa Baca Al-Quran", ["Doa Khataman Al-Qur'an", "Doa Usai Baca Ayat Kursi", "Doa Usai Baca Surat al-Kahfi", "Doa Usai Baca Surat al-Mulk", "Doa Usai Baca Surat al-Waqi'ah", "Doa Usai Baca Surat Yasin", "Qasidah Belajar Al-Qur'an"]],
  ["Doa Haji & Umrah", ["Doa Berangkat dari Rumah", "Doa ketika Kendaraan Mulai Bergerak", "Doa ketika Masuk Arafah", "Doa ketika Melihat Ka’bah", "Doa ketika Pulang Haji/Umrah", "Doa ketika Sampai di Mina", "Doa ketika Sampai di Muzdalifah", "Doa ketika Tiba di Tempat Tujuan", "Doa Masuk Kota Madinah", "Doa Masuk Masjid Nabawi", "Doa Masuk Masjidil Haram", "Doa Melontar Jamrah", "Doa Memasuki Kota Makkah", "Doa Menggunting Rambut", "Doa Sa’i", "Doa Selesai Berihram", "Doa Setelah Duduk dalam Kendaraan", "Doa Tawaf", "Doa Wukuf", "Lafal Talbiyah", "Niat Umrah dan Haji"]],
  ["Doa Hamil & Persalinan", ["Doa agar Diberi Anak Laki-laki", "Doa Mohon Keturunan", "Doa saat Bayi Baru Lahir", "Doa saat Proses Persalinan", "Doa Selama Bayi dalam Kandungan", "Doa Usia Kandungan 7 Bulan", "Doa Usia Kandungan 4 Bulan"]],
  ["Doa Ilmu", ["Doa agar Tak Mudah Lupa", "Doa Menjawab Soal Ujian", "Doa Mohon Ilmu Bermanfaat", "Doa Mudah Hafal dan Memahami", "Doa Penutup Majelis", "Doa Sebelum Belajar", "Doa Sesudah Belajar", "Mendoakan Guru", "Niat dan Doa Berangkat Belajar/Mengajar"]],
  ["Doa Kematian", ["Doa saat Takziah", "Doa untuk Orang Mati (Laki-laki)", "Doa untuk Orang Mati (Perempuan)", "Qasidah di Makam Wali", "Salam saat Ziarah Kubur", "Talqin Mayit di Kuburan"]],
  ["Doa Keseharian", ["Doa Bangun Tidur", "Doa Bercermin", "Doa Sebelum Tidur", "Doa Keluar Kamar Mandi", "Doa Keluar Masjid", "Doa Keluar Rumah", "Doa Masuk Kamar Mandi", "Doa Masuk Masjid", "Doa Masuk Pasar atau Mal", "Doa Masuk Rumah", "Doa Melepas Pakaian", "Doa Memakai Pakaian", "Doa Mengenakan Pakaian Baru", "Doa saat Turun Hujan", "Doa Sebelum Makan", "Doa Sesudah Adzan", "Doa Sesudah Makan", "Doa setelah Hujan Reda", "Doa untuk Kedua Orang Tua"]],
  ["Doa Kesehatan", ["Doa Mohon Sehat Senantiasa", "Doa Kesembuhan Diri Sendiri", "Doa Menjenguk Orang Sakit", "Doa Terhindar dari Penyakit Ain", "Doa Terhindar dari Wabah"]],
  ["Doa Kualitas Diri", ["Doa agar Giat Beribadah", "Doa Dijauhkan dari Maksiat", "Doa Husnul Khatimah", "Doa Meredam Rasa Marah", "Doa Mohon Akhlak Mulia", "Doa Mohon Istiqamah", "Doa saat Dihinggapi Rasa Sombong", "Doa Menghilangkan Malas", "Doa Mohon Umur Berkah", "Doa untuk Orang Iri atau Dengki"]],
  ["Doa para Nabi di Al-Quran", ["Doa Nabi Adam", "Doa Nabi Ayub", "Doa Nabi Hud", "Doa Nabi Ibrahim", "Doa Nabi Isa", "Doa Nabi Luth", "Doa Nabi Muhammad", "Doa Nabi Musa", "Doa Nabi Nuh", "Doa Nabi Sulaiman", "Doa Nabi Syu'aib", "Doa Nabi Yunus", "Doa Nabi Yusuf", "Doa Nabi Zakaria"]],
  ["Doa Perjalanan", ["Bacaan Sepanjang Perjalanan", "Doa Mengantar Pergi Seseorang", "Doa Naik Kapal atau Berlayar", "Doa Naik Kendaraan", "Doa saat Berhenti di Sela Perjalanan", "Mendoakan Orang yang Akan Bepergian", "Fawatihus Suwar agar Selamat Perjalanan"]],
  ["Doa Pernikahan & Rumah Tangga", ["Amalan Menempati Rumah Baru", "Contoh Khutbah Lamaran", "Contoh Khutbah Nikah", "Doa Dikaruniai Keturunan Saleh(ah)", "Doa Mendekatkan Jodoh", "Doa Terhindar dari Rumah Tangga Toksik", "Lafal Ijab Qabul Nikah", "Mendoakan Pengantin Baru", "Mohon Rumah Tangga Berkah", "Saat Terjadi Konflik Rumah Tangga"]],
  ["Doa Rezeki", ["Doa agar Bisa Membayar Utang", "Doa Berangkat Kerja", "Doa Berjumpa Pedagang", "Doa Mudah Raih Rezeki", "Doa Mudah Urusan", "Doa Rezeki Jelang Pensiun", "Doa saat Mengalami Kerugian", "Doa Terhindar dari Harta Haram", "Doa Terhindar dari Lilitan Utang"]],
  ["Doa Shalat", ["Doa Duduk di Antara Dua Sujud", "Doa Iftitah", "Doa Qunut", "Doa saat I’tidal", "Doa saat Ruku’", "Doa saat Sujud", "Doa Sujud Sahwi", "Doa Sujud Tilawah", "Doa Tahiyat Akhir", "Doa Tahiyat Awal", "Doa Usai Shalat Dhuha", "Doa Usai Shalat Fardhu", "Doa Usai Shalat Hajat", "Doa Usai Shalat Istikharah", "Doa Usai Shalat Tahajud", "Doa Usai Shalat Tarawih", "Doa Shalat Tasbih", "Doa Usai Shalat Taubat", "Doa Usai Shalat Witir", "Qunut Nazilah untuk Palestina"]],
  ["Doa Tolak Bala", ["Doa Perlindungan dari Berbagai Bencana", "Doa Keselamatan Anak Keturunan", "Doa saat Disergap Galau dan Susah", "Doa saat Gempa Bumi", "Doa saat Hujan yang Dikhawatirkan Banjir", "Doa saat Kehilangan Barang", "Doa saat Melihat Pertanda Buruk", "Doa saat Mendengar Petir", "Doa saat Tertimpa Musibah", "Doa Selamat dan Tolak Bala", "Doa Selamat Dunia Akhirat", "Doa Terhindar dari Kezaliman", "Doa untuk Perampas Hak Publik"]],
  ["Doa Waktu Tertentu", ["Doa 10 Muharram (Asyura)", "Doa Akhir Tahun", "Doa Awal Bulan Ramadhan", "Doa Awal Tahun", "Doa Bulan Rajab", "Doa Bulan Safar", "Doa Jumat Terakhir Rajab", "Doa Malam 1 Rajab Sayyidina Ali", "Doa Malam 1 Rajab Syekh Abdul Qadir", "Doa Malam 27 Rajab", "Doa Malam Idul Fitri atau Idul Adha", "Doa Nisfu Sya'ban"]],
  ["Doa Wudhu", ["Doa Membasuh Kedua Kaki", "Doa Membasuh Kedua Tangan", "Doa Membasuh Telapak Tangan", "Doa Membasuh Wajah", "Doa Membersihkan Lubang Hidung", "Doa Mengusap Kepala", "Doa Mengusap Telinga", "Doa saat Berkumur", "Doa Sebelum Wudhu", "Doa setelah Wudhu", "Lafal Niat Wudhu"]],
];

const WIRID = [
  ["Dalailul Khairat", ["201 Nama Rasulullah ﷺ", "Al-Asma’ul Husna", "Doa Dalailul Khairat", "Muqaddimah", "Tawasul", "Wirid Hari Ahad", "Wirid Hari Senin (1)", "Wirid Hari Senin (2)", "Wirid Hari Selasa", "Wirid Hari Rabu", "Wirid Hari Kamis", "Wirid Hari Jumat", "Wirid Hari Sabtu"]],
  ["Hizib", ["Hizib al-Barr", "Hizib Autad", "Hizib Bahr", "Hizib Ghazali", "Hizib Hirzul Jausyan", "Hizib Nashar (asy-Syadzili)", "Hizib Nashar (al-Haddad)", "Hizib Nawawi", "Hizib Sakran"]],
  ["Istighotsah & Mujahadah", ["Dzikrul Ghafilin", "Istighotsah (KH Romli Tamim)", "Istighotsah (KH M Hasyim Asy’ari)", "Yasin Fadlilah", "I'tiraf (Ilahi lastu lil firdaus)", "Mujahadah (KH Bisri Syansuri)", "Sayyidul Istighfar"]],
  ["Manaqib Syekh Abdul Qadir", ["Bab Pertama", "Bab Kedua", "Bab Ketiga", "Bab Keempat", "Bab Kelima", "Bab Keenam", "Bab Ketujuh", "Doa", "'Ibâdallâh..."]],
  ["Asmaul Husna", ["Asmaul Husna & Dzikrul Jalalah", "Nadham Asmaul Husna (KH Amdjad Al Hafidz)", "Nadham Asmaul Husna (KH Ali Maksum)"]],
  ["Ratib", ["Ratib al-Athas", "Ratib al-Aydrus (Syamsis Syumus)", "Ratib al-Haddad", "Ratib al-Kubra", "Ratib Samman", "Ratib Syaikhona Kholil"]],
  ["Shalawat", ["Shalawat Adhimiyah", "Shalawat Nur Dzati", "Shalawat Asnawiyah", "Shalawat Asyghil", "Shalawat Badar", "Shalawat Bariyyah", "Shalawat Basyairul Khairat", "Shalawat Busyra", "Shalawat Farah", "Shalawat Fatih", "Shalawat Fi Hubbi Sayyidina Muhammad", "Shalawat Haji", "Shalawat Ibrahimiyah", "Shalawat Imam asy-Syafi'i (1)", "Shalawat Imam asy-Syafi'i (2)", "Shalawat Inqadz Imam Nawawi", "Shalawat Jalbir Rizqi", "Shalawat Kamaliyah", "Shalawat Li Khamsatun", "Shalawat Luthf", "Shalawat Masyisyiyah", "Shalawat Munjiyat", "Shalawat Nahdliyah", "Shalawat Nariyah", "Shalawat Nuril Anwar", "Shalawat Rifa'iyah", "Shalawat Sa'adah", "Shalawat Surur", "Shalawat Syaikhona Kholil", "Shalawat Syifa'", "Shalawat Tafrijul Kurub", "Shalawat Tarhim", "Shalawat Thariqiyah", "Shalawat Thibbil Qulub", "Shalawat Uhudiyah"]],
  ["Wirid Harian", ["Wirdul Lathif (Dzikir Pagi)", "Wirdul Lathif (Dzikir Petang)", "Wirid Bakda Shalat Fardhu", "Wirid Menjelang Tidur", "Wirid Sebelum Shalat Subuh", "Wirid Setelah Shalat Jumat"]],
];

const MAULID = [
  ["Adl-Dliyaul Lami'", []],
  ["Maulid 'Azab", []],
  ["Maulid Diba'i", []],
  ["Simthud Durar", []],
  ["Maulid Barzanji", []],
  ["Qasidah Burdah", []],
  ["Maulid Syarafil Anam", []],
];

function build(list) {
  return list.map(([title, sections]) => ({
    title,
    slug: slugify(title),
    sections: sections.map((s) => ({ title: s, slug: slugify(s) })),
  }));
}

export const GROUPS = {
  doa: {
    name: "Doa",
    description: "Kumpulan doa harian, doa ibadah, dan doa untuk berbagai kebutuhan.",
    items: build(DOA),
  },
  wirid: {
    name: "Wirid",
    description: "Wirid, hizib, ratib, shalawat, dan istighotsah.",
    items: build(WIRID),
  },
  maulid: {
    name: "Maulid",
    description: "Bacaan maulid dan qasidah.",
    items: build(MAULID),
  },
};

// Alias pencarian seperti pada data redirect Anda
export const SPECIAL = [
  { slug: "ayat-kursi", name: "Ayat Kursi", href: "/surah/2#255", aliases: ["ayatul-kursi"] },
  { slug: "doa-sapu-jagat", name: "Doa Sapu Jagat", href: "/surah/2#201", aliases: ["rabbana-atina"] },
  { slug: "doa-nabi-yunus", name: "Doa Nabi Yunus", href: "/surah/21#87", aliases: [] },
  { slug: "ayat-nur", name: "Ayat Nur", href: "/surah/24#35", aliases: ["ayat-an-nur"] },
  { slug: "ayat-seribu-dinar", name: "Ayat Seribu Dinar", href: "/surah/65#2", aliases: ["ayat-1000-dinar"] },
  { slug: "amanar-rasul", name: "Amanar Rasul", href: "/surah/2#285", aliases: ["amana-rasul"] },
  { slug: "ayat-tujuh", name: "Ayat Tujuh", href: "/surah/9#51", aliases: ["ayat-7"] },
  { slug: "3-qul", name: "3 Qul", href: "/surah/112", aliases: ["tiga-qul", "surat-3-qul"] },
];
