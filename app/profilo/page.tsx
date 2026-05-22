import { Bell, Settings, ChevronRight, LogOut, Shield } from "lucide-react";

// Dati mock — verranno sostituiti con Supabase Auth in futuro
const UTENTE_MOCK = {
  nome: "Marco Rossi",
  email: "marco@streetech.com",
  abbonamento: "Piano mensile",
  prenotazioni: 3,
  schedeAttive: 1,
};

const MENU_VOCI = [
  { icon: Bell, label: "Notifiche" },
  { icon: Settings, label: "Impostazioni" },
  { icon: Shield, label: "Privacy" },
];

export default function ProfiloPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-3 space-y-4">
      <h2
        className="text-2xl text-red-500 tracking-widest"
        style={{ fontFamily: "var(--font-bebas)" }}
      >
        PROFILO
      </h2>

      {/* Avatar e dati */}
      <div className="flex flex-col items-center py-3 space-y-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-red-500/30">
          {UTENTE_MOCK.nome.charAt(0)}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">{UTENTE_MOCK.nome}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{UTENTE_MOCK.email}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-medium">
          {UTENTE_MOCK.abbonamento}
        </span>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-3xl font-bold text-red-400">
            {UTENTE_MOCK.prenotazioni}
          </p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Prenotazioni
          </p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
          <p className="text-3xl font-bold text-red-400">
            {UTENTE_MOCK.schedeAttive}
          </p>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Schede attive
          </p>
        </div>
      </div>

      {/* Menu impostazioni */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800/80">
        {MENU_VOCI.map(({ icon: Icon, label }, i) => (
          <button
            key={label}
            className={`w-full flex items-center justify-between px-4 py-4 hover:bg-gray-800/50 active:bg-gray-800 transition-colors ${
              i === 0 ? "rounded-t-2xl" : ""
            } ${i === MENU_VOCI.length - 1 ? "rounded-b-2xl" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-red-400" />
              <span className="text-sm font-medium text-gray-200">{label}</span>
            </div>
            <ChevronRight size={15} className="text-gray-600" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-500/25 text-red-400 hover:bg-red-500/10 active:bg-red-500/15 transition-colors text-sm font-medium">
        <LogOut size={17} />
        Logout
      </button>

      <p className="text-center text-xs text-gray-700 pb-2">
        Streetech v1.0 · Demo (auth non attiva)
      </p>
    </div>
  );
}
