"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Al-Qur'an" },
  { href: "/kategori/doa", label: "Doa" },
  { href: "/kategori/wirid", label: "Wirid" },
  { href: "/kategori/maulid", label: "Maulid" },
  { href: "/hadits", label: "Hadits" },
  { href: "/khutbah", label: "Khutbah" },
  { href: "/keislaman", label: "Keislaman" },
  { href: "/jadwal-sholat", label: "Jadwal Sholat" },
  { href: "/tentang", label: "Tentang" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) router.push(`/cari?q=${encodeURIComponent(q.trim())}`);
  };

  const isActive = (href) => (href === "/" ? pathname === "/" || pathname.startsWith("/surah") : pathname.startsWith(href));

  return (
    <header className={`header glass ${scrolled ? "scrolled" : ""}`} style={{ padding: "10px 12px 10px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="logo-mark"><span /></span>
          <span style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
            Islamic <span className="gradient-text">Center</span>
          </span>
        </Link>

        <nav className="nav-desktop" style={{ display: "flex", gap: 2 }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`nav-link ${isActive(n.href) ? "active" : ""}`}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <form onSubmit={submit} className="nav-desktop" style={{ width: 220 }}>
            <div className="search" style={{ height: 40, padding: "0 14px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--muted)" }}>
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari surah, doa…" style={{ fontSize: 14 }} />
            </div>
          </form>
          <button className="btn btn-ghost" style={{ padding: 0, width: 42, height: 42, justifyContent: "center" }} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows .6s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "14px 4px 6px" }}>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="nav-link" style={{ fontSize: 17, padding: "12px 14px" }}>
                {n.label}
              </Link>
            ))}
            <form onSubmit={submit} style={{ marginTop: 8 }}>
              <div className="search" style={{ height: 46 }}>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari surah, doa…" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
