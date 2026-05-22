"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/foto", label: "Foto", Icon: Camera },
  { href: "/profilo", label: "Profilo", Icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 safe-area-inset-bottom">
      <div className="max-w-2xl mx-auto flex items-stretch h-16">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                active
                  ? "text-red-500"
                  : "text-gray-500 hover:text-gray-300 active:text-gray-200"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium tracking-wide">
                {label}
              </span>
              {/* Dot indicatore tab attiva */}
              {active && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
