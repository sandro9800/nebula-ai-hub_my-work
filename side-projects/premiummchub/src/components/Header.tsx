import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/utils/cn";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/clients", label: "Clients" },
  { to: "/mods-and-macros", label: "Mods & Macros" },
  { to: "/search", label: "Search" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/search" className="btn-ghost h-9 w-9 p-0" aria-label="Search">
            <Search size={16} />
          </Link>
        </div>
        <button
          className="md:hidden btn-ghost h-9 w-9 p-0"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 space-y-2">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                location.pathname === n.to
                  ? "bg-white/5 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {n.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link
              to="/search"
              onClick={() => setOpen(false)}
              className="btn-ghost flex-1"
            >
              <Search size={14} /> Search
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
