"use client";

import { useRef, useEffect, useCallback, useState } from "react";

const ITEM_H = 54; // altezza px di ogni slot
const VISIBLE = 5; // slot visibili contemporaneamente
const HALF = Math.floor(VISIBLE / 2); // slot sopra/sotto il centro

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function generateSlots(startH = 8, endH = 21): string[] {
  const slots: string[] = [];
  for (let h = startH; h <= endH; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === endH && m > 0) break;
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

export const TIME_SLOTS = generateSlots();

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function TimeWheelPicker({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserScrolling = useRef(false);

  // Indice locale per il feedback visivo immediato durante lo scroll
  const [displayIdx, setDisplayIdx] = useState(() => {
    const i = TIME_SLOTS.indexOf(value);
    return i >= 0 ? i : 0;
  });

  const scrollToIdx = useCallback(
    (idx: number, behavior: ScrollBehavior = "smooth") => {
      containerRef.current?.scrollTo({ top: idx * ITEM_H, behavior });
    },
    []
  );

  // Scroll iniziale senza animazione
  useEffect(() => {
    const i = TIME_SLOTS.indexOf(value);
    const target = i >= 0 ? i : 0;
    setDisplayIdx(target);
    scrollToIdx(target, "instant");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = () => {
    if (!containerRef.current) return;
    isUserScrolling.current = true;

    // Aggiorna subito l'indice visivo per l'highlight
    const rawIdx = containerRef.current.scrollTop / ITEM_H;
    setDisplayIdx(Math.round(rawIdx));

    // Debounce: quando smette di scorrere, scatta il snap e chiama onChange
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      isUserScrolling.current = false;
      if (!containerRef.current) return;
      const finalRaw = containerRef.current.scrollTop / ITEM_H;
      const finalIdx = Math.max(
        0,
        Math.min(Math.round(finalRaw), TIME_SLOTS.length - 1)
      );
      setDisplayIdx(finalIdx);
      scrollToIdx(finalIdx, "smooth");
      onChange(TIME_SLOTS[finalIdx]);
    }, 120);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{ height: ITEM_H * VISIBLE, background: "rgba(17,24,39,0.8)" }}
    >
      {/* Gradiente superiore */}
      <div
        className="absolute inset-x-0 top-0 z-20 pointer-events-none"
        style={{
          height: ITEM_H * HALF,
          background:
            "linear-gradient(to bottom, rgba(3,7,18,0.96), rgba(3,7,18,0))",
        }}
      />
      {/* Gradiente inferiore */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
        style={{
          height: ITEM_H * HALF,
          background:
            "linear-gradient(to top, rgba(3,7,18,0.96), rgba(3,7,18,0))",
        }}
      />
      {/* Banda di selezione centrale */}
      <div
        className="absolute inset-x-6 z-10 pointer-events-none border-y-2 border-red-500/50 rounded-sm"
        style={{ top: ITEM_H * HALF, height: ITEM_H }}
      />

      {/* Lista scorrevole */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Padding top: permette al primo slot di arrivare al centro */}
        <div style={{ height: ITEM_H * HALF }} aria-hidden="true" />

        {TIME_SLOTS.map((slot, i) => {
          const dist = Math.abs(i - displayIdx);
          return (
            <div
              key={slot}
              style={{ height: ITEM_H, scrollSnapAlign: "center" }}
              className={`flex items-center justify-center font-mono tracking-widest transition-all duration-100 ${
                dist === 0
                  ? "text-white text-[26px] font-bold"
                  : dist === 1
                  ? "text-gray-400 text-xl"
                  : "text-gray-600 text-base"
              }`}
            >
              {slot}
            </div>
          );
        })}

        {/* Padding bottom */}
        <div style={{ height: ITEM_H * HALF }} aria-hidden="true" />
      </div>
    </div>
  );
}
