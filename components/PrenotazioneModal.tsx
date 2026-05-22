"use client";

import { useState } from "react";
import { CalendarDays, Clock, Trash2 } from "lucide-react";
import PrenotazioneView from "./PrenotazioneView";

interface Prenotazione {
  id: string;
  data: string;
  oraInizio: string;
  oraFine: string;
}

function formatData(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function PrenotazioneModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);

  const handleSalva = (
    id: string | null,
    data: string,
    oraInizio: string,
    oraFine: string
  ) => {
    if (id) {
      // Aggiorna prenotazione esistente
      setPrenotazioni((prev) =>
        prev.map((p) => (p.id === id ? { ...p, data, oraInizio, oraFine } : p))
      );
    } else {
      // Nuova prenotazione — rimane nella vista
      setPrenotazioni((prev) => [
        ...prev,
        { id: `${data}-${oraInizio}-${Date.now()}`, data, oraInizio, oraFine },
      ]);
    }
  };

  const handleCancella = (id: string) =>
    setPrenotazioni((prev) => prev.filter((p) => p.id !== id));

  return (
    <section>
      <h2
        className="text-2xl text-red-500 mb-4 tracking-widest"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        PRENOTA IL TUO TURNO
      </h2>

      {/* Pulsante principale */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
      >
        <CalendarDays size={24} />
        Prenotati
      </button>

      {/* Lista prenotazioni correnti */}
      {prenotazioni.length > 0 && (
        <ul className="mt-4 space-y-2">
          {prenotazioni.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3 border border-gray-700"
            >
              <div className="flex items-center gap-3">
                <CalendarDays size={15} className="text-red-400 flex-shrink-0" />
                <span className="text-sm font-medium capitalize">
                  {formatData(p.data)}
                </span>
                <Clock size={13} className="text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  {p.oraInizio}–{p.oraFine}
                </span>
              </div>
              <button
                onClick={() => handleCancella(p.id)}
                aria-label="Cancella prenotazione"
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Schermata full-screen calendario + wheel picker */}
      {isOpen && (
        <PrenotazioneView
          myBookings={prenotazioni}
          onSalva={handleSalva}
          onClose={() => setIsOpen(false)}
        />
      )}
    </section>
  );
}
