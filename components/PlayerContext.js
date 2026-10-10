"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const PlayerCtx = createContext(null);

// Nama qari dari nama folder di URL audio, mis. "Abdullah-Al-Juhany" -> "Abdullah Al Juhany"
export function qoriName(key, url) {
  const folder = url?.split("/").slice(-2, -1)[0] || key;
  return folder.replace(/-/g, " ");
}

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const wantPlay = useRef(false);
  const [track, setTrack] = useState(null); // { surah:{id,name,arti}, ayat:[...], index }
  const [qori, setQoriState] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  // Inisialisasi audio sekali di client
  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    const saved = typeof localStorage !== "undefined" && localStorage.getItem("qori");
    if (saved) setQoriState(saved);
    const onTime = () => setCur(a.currentTime || 0);
    const onMeta = () => setDur(a.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => nextRef.current?.(true);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const srcOf = (t, q) => (t && q ? t.ayat[t.index]?.audio?.[q] || null : null);

  const loadAndPlay = useCallback((src, autoplay) => {
    const a = audioRef.current;
    if (!a || !src) return;
    if (a.src !== src) {
      a.src = src;
      a.load();
    }
    if (autoplay) a.play().catch(() => setPlaying(false));
  }, []);

  const playAt = useCallback(
    (surah, ayat, index, q = qori) => {
      const key = q || Object.keys(ayat[index]?.audio || {}).find((k) => /alafasy/i.test(ayat[index].audio[k])) || Object.keys(ayat[index]?.audio || {})[0];
      const useQori = q || key;
      if (!q && key) {
        setQoriState(key);
        localStorage.setItem("qori", key);
      }
      const next = { surah, ayat, index };
      setTrack(next);
      wantPlay.current = true;
      loadAndPlay(ayat[index]?.audio?.[useQori], true);
    },
    [qori, loadAndPlay]
  );

  const setQori = useCallback(
    (q) => {
      setQoriState(q);
      localStorage.setItem("qori", q);
      if (track) {
        const src = track.ayat[track.index]?.audio?.[q];
        const a = audioRef.current;
        const resume = a && !a.paused;
        const t = a ? a.currentTime : 0;
        loadAndPlay(src, resume);
        if (a && t) a.currentTime = t;
      }
    },
    [track, loadAndPlay]
  );

  const goTo = useCallback(
    (index) => {
      if (!track) return;
      if (index < 0 || index >= track.ayat.length) {
        setPlaying(false);
        return;
      }
      setTrack({ ...track, index });
      wantPlay.current = true;
      loadAndPlay(track.ayat[index].audio?.[qori], true);
    },
    [track, qori, loadAndPlay]
  );

  const nextRef = useRef(null);
  const next = useCallback((fromEnd) => {
    if (!track) return;
    if (track.index + 1 < track.ayat.length) goTo(track.index + 1);
    else if (fromEnd) setPlaying(false);
  }, [track, goTo]);
  nextRef.current = next;

  const prev = useCallback(() => goTo(Math.max(0, (track?.index || 0) - 1)), [track, goTo]);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.src && track) return playAt(track.surah, track.ayat, track.index);
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }, [track, playAt]);

  const seek = useCallback((ratio) => {
    const a = audioRef.current;
    if (a && a.duration) a.currentTime = ratio * a.duration;
  }, []);

  const close = useCallback(() => {
    const a = audioRef.current;
    if (a) { a.pause(); a.removeAttribute("src"); a.load(); }
    setTrack(null);
    setPlaying(false);
  }, []);

  const qoriOptions = useMemo(() => {
    const first = track?.ayat?.[0]?.audio || {};
    return Object.entries(first).map(([key, url]) => ({ key, name: qoriName(key, url) }));
  }, [track]);

  const value = useMemo(
    () => ({ track, playing, cur, dur, qori, qoriOptions, playAt, toggle, next, prev, seek, setQori, close }),
    [track, playing, cur, dur, qori, qoriOptions, playAt, toggle, next, prev, seek, setQori, close]
  );

  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error("usePlayer harus dipakai di dalam PlayerProvider");
  return ctx;
}
