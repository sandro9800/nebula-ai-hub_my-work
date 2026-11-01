import { Link } from "react-router-dom";
import { Github, MessageCircle, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";
import { useData } from "@/lib/DataContext";

export function Footer() {
  const { settings } = useData();
  return (
    <footer className="mt-24 border-t border-white/5 bg-ink-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-3">
            <Logo />
            <p className="text-sm text-slate-400 max-w-sm">
              {settings.footerText ||
                "Your premium source for Minecraft clients, mods & macros."}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={settings.discordUrl || "#"}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost h-9 w-9 p-0"
                aria-label="Discord"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="#"
                className="btn-ghost h-9 w-9 p-0"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Browse
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white" to="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" to="/clients">
                  Clients
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" to="/mods-and-macros">
                  Mods & Macros
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" to="/search">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              About
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck size={12} /> Synced via secure Redis backend
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {settings.siteName || "Premium MC Hub"}.
            All trademarks property of their respective owners.
          </p>
          <p className="text-xs text-slate-500">
            Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
