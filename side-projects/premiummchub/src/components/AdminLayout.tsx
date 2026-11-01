import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  BarChart3,
  FolderOpen,
  Home,
  Image as ImageIcon,
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/utils/cn";
import { isAuthenticated, logout } from "@/lib/auth";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: Home, end: true },
  { to: "/admin/clients", label: "Clients", icon: ShieldCheck },
  { to: "/admin/tools", label: "Mods & Macros", icon: Wrench },
  { to: "/admin/media", label: "Media", icon: ImageIcon },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminLayout() {
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      nav("/admin/login", { replace: true });
    }
  }, [nav]);

  function handleLogout() {
    logout();
    nav("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="md:w-64 md:shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-ink-950/60">
        <div className="p-4 border-b border-white/5">
          <Logo size="sm" />
        </div>
        <nav className="p-3 space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end as any}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-500/15 text-violet-200 border border-violet-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent",
                )
              }
            >
              <l.icon size={15} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent transition-colors"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  useEffect(() => {
    if (!isAuthenticated()) {
      nav("/admin/login", { replace: true });
    }
  }, [nav]);
  if (!isAuthenticated()) return null;
  return <>{children}</>;
}

// Touch unused icon import warning
void FolderOpen;
