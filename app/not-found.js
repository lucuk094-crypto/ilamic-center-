import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
      <div className="gradient-text" style={{ fontSize: 96, fontWeight: 700 }}>404</div>
      <p className="muted" style={{ marginTop: 10 }}>Halaman yang Anda cari tidak ditemukan.</p>
      <Link href="/" className="btn btn-primary" style={{ marginTop: 26 }}>Kembali ke Beranda</Link>
    </div>
  );
}
