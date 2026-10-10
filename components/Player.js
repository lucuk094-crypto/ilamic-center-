"use client";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "./PlayerContext";

const fmt = (s) => {
  if (!s || Number.isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function Player() {
  const { track, playing, cur, dur, qori, qoriOptions, toggle, next, prev, seek, setQori, close } = usePlayer();
  const barRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(!!track), [track]);

  if (!track) return <div className={`player glass ${open ? "open" : ""}`} aria-hidden />;

  const ayah = track.ayat[track.index];
  const pct = dur ? (cur / dur) * 100 : 0;

  const onBar = (e) => {
    const r = barRef.current.getBoundingClientRect();
    seek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  return (
    <div className={`player glass ${open ? "open" : ""}`} role="region" aria-label="Pemutar audio">
      <div ref={barRef} className="progress" onClick={onBar} style={{ borderRadius: "22px 22px 0 0" }}>
        <div style={{ width: `${pct}%` }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", flexWrap: "wrap" }}>
        <div style={{ minWidth: 0, flex: "1 1 200px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
            <span className={`eq ${playing ? "playing" : ""}`}><i /><i /><i /><i /></span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {track.surah.name} · Ayat {ayah.n}
            </span>
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
            {fmt(cur)} / {fmt(dur)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <IconBtn label="Ayat sebelumnya" onClick={prev}>
            <path d="M6 5v14M19 6l-9 6 9 6z" />
          </IconBtn>
          <button onClick={toggle} aria-label={playing ? "Jeda" : "Putar"} className="pulse"
            style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--neon)", color: "#03130c", display: "grid", placeItems: "center", boxShadow: "0 0 30px -4px var(--neon)", transition: "transform .4s var(--ease)" }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.92)")} onMouseUp={(e) => (e.currentTarget.style.transform = "")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {playing ? <path d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
            </svg>
          </button>
          <IconBtn label="Ayat berikutnya" onClick={() => next(false)}>
            <path d="M18 5v14M5 6l9 6-9 6z" />
          </IconBtn>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={qori || ""}
            onChange={(e) => setQori(e.target.value)}
            aria-label="Pilih qari"
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--line-hi)", borderRadius: 999, padding: "8px 12px", fontSize: 13, maxWidth: 200, outline: "none" }}
          >
            {qoriOptions.map((q) => (
              <option key={q.key} value={q.key} style={{ background: "#0a0e16" }}>{q.name}</option>
            ))}
          </select>
          <IconBtn label="Tutup pemutar" onClick={close}>
            <path d="M6 6l12 12M18 6 6 18" />
          </IconBtn>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, label, onClick }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="card"
      style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", padding: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
        {children}
      </svg>
    </button>
  );
}
