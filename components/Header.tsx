// Server Component — nessuno stato necessario
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-center">
        {/* Logo STREETECH con Bebas Neue via CSS variable */}
        <span
          className="text-[28px] tracking-[0.15em] text-white select-none"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          STREE
          <span className="text-red-500">TECH</span>
        </span>
      </div>
    </header>
  );
}
