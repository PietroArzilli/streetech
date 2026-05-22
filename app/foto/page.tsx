"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, ImageIcon, Clock, CheckCircle2 } from "lucide-react";

interface FotoCaricata {
  id: string;
  src: string;
  nome: string;
  stato: "attesa" | "approvata";
}

export default function FotoPage() {
  const [fotoList, setFotoList] = useState<FotoCaricata[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [nomeFile, setNomeFile] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setNomeFile(file.name);
  };

  const handleUpload = () => {
    if (!preview) return;
    setFotoList((prev) => [
      {
        id: Date.now().toString(),
        src: preview,
        nome: nomeFile,
        stato: "attesa",
      },
      ...prev,
    ]);
    setPreview(null);
    setNomeFile("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAnnulla = () => {
    setPreview(null);
    setNomeFile("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h2
        className="text-2xl text-red-500 tracking-widest"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        CARICA FOTO
      </h2>

      {/* Area upload */}
      <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl p-6 text-center hover:border-red-500/30 transition-colors">
        {preview ? (
          /* Anteprima prima dell'invio */
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={preview}
                alt="Anteprima"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-400 truncate">{nomeFile}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleAnnulla}
                className="px-5 py-2.5 rounded-xl border border-gray-700 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleUpload}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
              >
                Invia per approvazione
              </button>
            </div>
          </div>
        ) : (
          /* Stato vuoto */
          <div className="space-y-4 py-4">
            <ImageIcon size={44} className="text-gray-700 mx-auto" />
            <p className="text-gray-400 text-sm">
              Condividi un momento della tua sessione
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
            >
              <Upload size={16} />
              Scegli foto
            </button>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Lista foto caricate */}
      {fotoList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs text-gray-500 uppercase tracking-widest font-medium">
            Le tue foto ({fotoList.length})
          </h3>
          {fotoList.map((foto) => (
            <div
              key={foto.id}
              className="flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-800"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={foto.src}
                  alt={foto.nome}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-medium">
                  {foto.nome}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  {foto.stato === "attesa" ? (
                    <>
                      <Clock size={12} className="text-yellow-500" />
                      <span className="text-xs text-yellow-500">
                        In attesa di approvazione
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-xs text-green-500">Approvata</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
