"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

interface Photo {
  id: number;
  src: string;
  alt: string;
}

const FOTO_GALLERY: Photo[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=75", alt: "Trazioni alla sbarra" },
  { id: 2, src: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=600&q=75", alt: "Allenamento funzionale" },
  { id: 3, src: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600&q=75", alt: "Calisthenics outdoor" },
  { id: 4, src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=75", alt: "Palestra street" },
  { id: 5, src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=75", alt: "Core workout" },
  { id: 6, src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=75", alt: "Sollevamento pesi" },
];

export default function PhotoGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Aggiorna lo stato dei tasti freccia in base alla posizione dello scroll
  const updateArrows = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 4);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    // ResizeObserver per ricalcolare se la finestra cambia
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    // Scorre di ~80% della larghezza visibile
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const goPrev = useCallback(() =>
    setLightboxIdx((i) => (i !== null ? (i - 1 + FOTO_GALLERY.length) % FOTO_GALLERY.length : null)), []);
  const goNext = useCallback(() =>
    setLightboxIdx((i) => (i !== null ? (i + 1) % FOTO_GALLERY.length : null)), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "Escape") setLightboxIdx(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [lightboxIdx, goPrev, goNext]);

  const currentPhoto = lightboxIdx !== null ? FOTO_GALLERY[lightboxIdx] : null;

  return (
    <section>
      {/* Header sezione con frecce scorrimento */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl text-red-500 tracking-widest flex items-center gap-2"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          <ImageIcon size={20} />
          GALLERY
        </h2>

        {/* Tasti scorrimento */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-25 text-gray-300 hover:text-white transition-all"
            aria-label="Scorri a sinistra"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-25 text-gray-300 hover:text-white transition-all"
            aria-label="Scorri a destra"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel orizzontale */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {FOTO_GALLERY.map((foto, idx) => (
          <button
            key={foto.id}
            onClick={() => setLightboxIdx(idx)}
            aria-label={`Apri foto: ${foto.alt}`}
            className="relative flex-shrink-0 rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-950"
            style={{ width: 160, height: 210 }}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes="160px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            {/* Numero foto */}
            <span className="absolute bottom-2 right-2 text-[10px] text-white/60 font-medium bg-black/40 rounded px-1.5 py-0.5">
              {idx + 1}/{FOTO_GALLERY.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {currentPhoto && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/96"
          onClick={(e) => e.target === e.currentTarget && setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Chiudi"
          >
            <X size={22} />
          </button>

          <button
            onClick={goPrev}
            className="absolute left-3 sm:left-6 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Foto precedente"
          >
            <ChevronLeft size={26} />
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[85vh] px-16 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <button
            onClick={goNext}
            className="absolute right-3 sm:right-6 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Foto successiva"
          >
            <ChevronRight size={26} />
          </button>

          <p className="absolute bottom-5 text-white/50 text-xs tracking-widest">
            {lightboxIdx + 1} / {FOTO_GALLERY.length}
          </p>
        </div>
      )}
    </section>
  );
}
