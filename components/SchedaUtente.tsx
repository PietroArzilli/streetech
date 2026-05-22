"use client";

import { useState, useRef } from "react";
import { Dumbbell, ChevronRight, X, Upload } from "lucide-react";

const MOCK_SCHEDA = `SCHEDA DI ALLENAMENTO — Marco Rossi
Aggiornata: Maggio 2026

═══════════════════════════════════════
  SETTIMANA A — LUNEDÌ / GIOVEDÌ
═══════════════════════════════════════

RISCALDAMENTO (10 min)
  • Corsa leggera 5 min
  • Mobilità articolare
  • Attivazione scapolare

FORZA UPPER BODY
  A1. Trazioni alla sbarra
      4 × max reps  |  recupero 90"
  A2. Dip alle parallele
      4 × 8–12 reps  |  recupero 90"
  B1. Push-up con elevazione
      3 × 15  |  recupero 60"
  B2. Body row (anelli)
      3 × 12  |  recupero 60"
  C.  Muscle-up progressioni
      3 × 5  |  recupero 2 min

DEFATICAMENTO
  • Stretching spalle e petto 5 min
  • Foam rolling schiena

═══════════════════════════════════════
  SETTIMANA A — MERCOLEDÌ / SABATO
═══════════════════════════════════════

RISCALDAMENTO (10 min)
  • Salto alla corda 5 min
  • Attivazione core e anche

LOWER BODY + CORE
  A1. Pistol squat (assistito)
      4 × 6 per lato  |  recupero 90"
  A2. Nordic curl
      3 × 5  |  recupero 2 min
  B1. Plank dinamico
      3 × 30"  |  recupero 45"
  B2. L-sit su parallele
      3 × 10" hold  |  recupero 60"
  C.  Dragon flag progressione
      3 × 5  |  recupero 90"

DEFATICAMENTO
  • Stretching completo 10 min

═══════════════════════════════════════
  NOTE DEL COACH
═══════════════════════════════════════

Aumenta il carico quando completi tutte
le reps con buona tecnica per 2 sessioni
consecutive.

Priorità assoluta alla qualità del
movimento — mai sacrificare la forma.

Per modifiche alla scheda contattami
prima della sessione.

  — Coach Alex`;

export default function SchedaUtente() {
  const [scheda, setScheda] = useState<string>(MOCK_SCHEDA);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "text/plain") {
      setScheda(await file.text());
    } else if (file.type === "application/pdf") {
      setScheda(`📄 ${file.name}\n\n[Contenuto PDF]\nL'estrazione del testo da PDF richiede un'integrazione server-side.\nPer questa demo carica un file .txt.`);
    } else {
      alert("Formato non supportato. Usa .txt o .pdf");
      return;
    }
    e.target.value = "";
  };

  return (
    <section>
      <h2
        className="text-2xl text-red-500 mb-2 tracking-widest flex items-center gap-2"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        <Dumbbell size={22} />
        LA TUA SCHEDA
      </h2>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Bottone principale — apre il viewer */}
      <button
        onClick={() => setIsViewerOpen(true)}
        className="w-full flex items-center gap-4 bg-gray-900 border border-gray-700/60 rounded-2xl px-5 py-4 hover:border-red-500/40 hover:bg-gray-800/60 active:bg-gray-800 transition-all group"
      >
        <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0">
          <Dumbbell size={20} className="text-red-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">Scheda di allenamento</p>
          <p className="text-xs text-gray-500 mt-0.5">Aggiornata: Maggio 2026</p>
        </div>
        <ChevronRight size={18} className="text-gray-600 group-hover:text-red-400 transition-colors" />
      </button>

      {/* Viewer full-screen */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
          <div className="flex items-center gap-3 px-4 h-14 border-b border-gray-800/80 flex-shrink-0 bg-gray-950">
            <button
              onClick={() => setIsViewerOpen(false)}
              className="p-2 -ml-2 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>
            <h3
              className="text-xl text-red-500 tracking-widest flex-1"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              LA TUA SCHEDA
            </h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              <Upload size={12} />
              Aggiorna
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <pre className="text-[15px] text-gray-100 whitespace-pre-wrap font-mono leading-7 tracking-wide">
              {scheda}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
