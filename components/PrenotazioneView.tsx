"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Users, CalendarDays, CheckCircle2, Pencil, X } from "lucide-react";
import TimeWheelPicker from "./TimeWheelPicker";

// ── Mock prenotazioni degli altri utenti ──────────────────────────────────────
function relDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

const MOCK_BOOKINGS: MockBooking[] = [
  { id: "m1",  name: "Luca M.",   color: "#3b82f6", date: relDate(0), time: "10:00" },
  { id: "m2",  name: "Sara P.",   color: "#a855f7", date: relDate(0), time: "10:15" },
  { id: "m3",  name: "Marco R.",  color: "#22c55e", date: relDate(0), time: "11:30" },
  { id: "m4",  name: "Giulia T.", color: "#ec4899", date: relDate(1), time: "09:00" },
  { id: "m5",  name: "Ahmed K.",  color: "#eab308", date: relDate(1), time: "11:00" },
  { id: "m6",  name: "Chiara F.", color: "#ef4444", date: relDate(2), time: "09:15" },
  { id: "m7",  name: "Luca M.",   color: "#3b82f6", date: relDate(3), time: "18:00" },
  { id: "m8",  name: "Davide B.", color: "#06b6d4", date: relDate(3), time: "17:45" },
  { id: "m9",  name: "Sara P.",   color: "#a855f7", date: relDate(5), time: "09:00" },
  { id: "m10", name: "Marco R.",  color: "#22c55e", date: relDate(7), time: "17:00" },
];

// ── Helpers calendario ────────────────────────────────────────────────────────
const MESI = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre",
];
const GIORNI_SETTIMANA = ["L","M","M","G","V","S","D"];

function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate();
}
function firstWeekday(y: number, m: number): number {
  return (new Date(y, m, 1).getDay() + 6) % 7;
}
function padDate(n: number): string {
  return String(n).padStart(2, "0");
}

// ── Tipi ─────────────────────────────────────────────────────────────────────
interface MockBooking {
  id: string;
  name: string;
  color: string;
  date: string;
  time: string;
}
interface MyBooking {
  id: string;
  data: string;
  oraInizio: string;
  oraFine: string;
}
interface Props {
  myBookings: MyBooking[];
  onSalva: (id: string | null, data: string, oraInizio: string, oraFine: string) => void;
  onClose: () => void;
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function PrenotazioneView({ myBookings, onSalva, onClose }: Props) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [viewYear, setViewYear]           = useState(today.getFullYear());
  const [viewMonth, setViewMonth]         = useState(today.getMonth());
  const [selectedDate, setSelectedDate]   = useState(todayStr);
  const [selectedStartTime, setSelectedStartTime] = useState("10:00");
  const [selectedEndTime, setSelectedEndTime]     = useState("11:00");
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [successMsg, setSuccessMsg]       = useState<string | null>(null);

  const isTimeError = selectedEndTime <= selectedStartTime;

  // Auto-clear success toast
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(null), 2500);
    return () => clearTimeout(t);
  }, [successMsg]);

  // Unisci prenotazioni mock + mie
  const allBookings: (MockBooking & { isMe?: boolean })[] = useMemo(() => {
    const mine = myBookings.map((b) => ({
      id: b.id,
      name: "Tu",
      color: "#ef4444",
      date: b.data,
      time: b.oraInizio,
      isMe: true,
    }));
    return [...MOCK_BOOKINGS, ...mine];
  }, [myBookings]);

  const byDate = useMemo(() => {
    const map: Record<string, typeof allBookings> = {};
    allBookings.forEach((b) => { (map[b.date] ??= []).push(b); });
    return map;
  }, [allBookings]);

  // Prenotazione dell'utente nel giorno selezionato
  const myDayBooking = myBookings.find((b) => b.data === selectedDate) ?? null;

  const selectedDayBookings = byDate[selectedDate] ?? [];

  // Navigazione mese
  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const numDays   = daysInMonth(viewYear, viewMonth);
  const startDow  = firstWeekday(viewYear, viewMonth);

  // Avvia modifica di una prenotazione esistente
  const startEdit = (booking: MyBooking) => {
    setEditingId(booking.id);
    setSelectedStartTime(booking.oraInizio);
    setSelectedEndTime(booking.oraFine);
  };

  // Annulla modifica
  const cancelEdit = () => {
    setEditingId(null);
    setSelectedStartTime("10:00");
    setSelectedEndTime("11:00");
  };

  // Salva (nuova o modifica)
  const handleSalva = () => {
    onSalva(editingId, selectedDate, selectedStartTime, selectedEndTime);
    setSuccessMsg(editingId ? "Prenotazione aggiornata!" : "Prenotazione confermata!");
    setEditingId(null);
    setSelectedStartTime("10:00");
    setSelectedEndTime("11:00");
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-800/80 flex-shrink-0 bg-gray-950">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          aria-label="Torna indietro"
        >
          <ArrowLeft size={20} />
        </button>
        <h2
          className="text-xl text-red-500 tracking-widest"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          PRENOTA TURNO
        </h2>
      </div>

      {/* Contenuto scrollabile */}
      <div className="flex-1 overflow-y-auto">

        {/* Toast successo */}
        {successMsg && (
          <div className="mx-4 mt-4 flex items-center gap-2 py-3 px-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-medium">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Navigazione mese */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors text-xl"
          >
            ‹
          </button>
          <span className="font-semibold text-white">
            {MESI[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors text-xl"
          >
            ›
          </button>
        </div>

        {/* Intestazioni giorni settimana */}
        <div className="grid grid-cols-7 px-3 mb-1">
          {GIORNI_SETTIMANA.map((g, i) => (
            <div key={i} className="text-center text-[11px] text-gray-500 font-medium py-1">
              {g}
            </div>
          ))}
        </div>

        {/* Griglia giorni */}
        <div className="grid grid-cols-7 px-3 gap-y-1">
          {Array.from({ length: startDow }).map((_, i) => <div key={`pad-${i}`} />)}

          {Array.from({ length: numDays }).map((_, i) => {
            const day     = i + 1;
            const dateStr = `${viewYear}-${padDate(viewMonth + 1)}-${padDate(day)}`;
            const isPast  = dateStr < todayStr;
            const isToday    = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const isMyDay    = !isPast && myBookings.some((b) => b.data === dateStr);
            const dots       = (byDate[dateStr] ?? []).slice(0, 3);

            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => setSelectedDate(dateStr)}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all select-none ${
                  isSelected
                    ? "bg-red-500 text-white"
                    : isMyDay
                    ? "bg-red-500/15 border border-red-500/50 text-red-300"
                    : isToday
                    ? "border border-red-500/60 text-white"
                    : isPast
                    ? "text-gray-700 cursor-not-allowed"
                    : "text-gray-300 hover:bg-gray-800 active:bg-gray-700"
                }`}
              >
                <span className="text-[13px] font-medium leading-none">{day}</span>
                {dots.length > 0 && (
                  <div className="flex gap-[3px] mt-[3px]">
                    {dots.map((b, di) => (
                      <span
                        key={di}
                        className="w-[5px] h-[5px] rounded-full"
                        style={{ background: isSelected ? "rgba(255,255,255,0.7)" : b.color }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Chi si allena nel giorno selezionato */}
        <div className="px-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={13} className="text-red-400 flex-shrink-0" />
            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
              {selectedDayBookings.length > 0
                ? `${selectedDayBookings.length} prenotazion${selectedDayBookings.length === 1 ? "e" : "i"} in questa giornata`
                : "Nessuna prenotazione — sii il primo!"}
            </span>
          </div>
          {selectedDayBookings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedDayBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-1.5 bg-gray-800/70 rounded-full px-2.5 py-1.5"
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ background: b.color }}
                  >
                    {b.name.charAt(0)}
                  </span>
                  <span className="text-xs text-gray-200 font-medium">{b.name}</span>
                  <span className="text-[11px] text-gray-500">{b.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card "Il tuo turno" — solo se c'è mia prenotazione in questo giorno e non sono in edit */}
        {myDayBooking && !editingId && (
          <div className="px-4 mt-4">
            <div className="flex items-center justify-between bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3">
              <div>
                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-widest">
                  Il tuo turno
                </p>
                <p className="text-sm text-white font-semibold mt-0.5">
                  {myDayBooking.oraInizio} – {myDayBooking.oraFine}
                </p>
              </div>
              <button
                onClick={() => startEdit(myDayBooking)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold hover:bg-red-500/30 active:bg-red-500/40 transition-colors"
              >
                <Pencil size={12} />
                Modifica
              </button>
            </div>
          </div>
        )}

        {/* Selettore orario — due colonne */}
        <div className="px-4 mt-6">
          {/* Banner edit mode */}
          {editingId ? (
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Pencil size={12} className="text-amber-400" />
                <span className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold">
                  Stai modificando la prenotazione
                </span>
              </div>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X size={12} />
                Annulla
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays size={13} className="text-red-400" />
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                Scegli l'orario — ruota per selezionare
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
                Inizio
              </p>
              <TimeWheelPicker value={selectedStartTime} onChange={setSelectedStartTime} />
            </div>
            <div>
              <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
                Fine
              </p>
              <TimeWheelPicker value={selectedEndTime} onChange={setSelectedEndTime} />
            </div>
          </div>

          {isTimeError && (
            <p className="mt-3 text-center text-xs text-red-400 font-medium">
              L'orario di fine deve essere dopo quello di inizio
            </p>
          )}
        </div>

        {/* Pulsante salva */}
        <div className="px-4 py-6">
          <button
            disabled={isTimeError}
            onClick={handleSalva}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-base shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isTimeError
              ? "Orario non valido"
              : editingId
              ? `Aggiorna — ${new Date(selectedDate + "T00:00:00").toLocaleDateString("it-IT", { day: "2-digit", month: "short" })} · ${selectedStartTime}–${selectedEndTime}`
              : `Conferma — ${new Date(selectedDate + "T00:00:00").toLocaleDateString("it-IT", { day: "2-digit", month: "short" })} · ${selectedStartTime}–${selectedEndTime}`}
          </button>
        </div>
      </div>
    </div>
  );
}
