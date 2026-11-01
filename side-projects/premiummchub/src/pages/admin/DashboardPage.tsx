import { Link } from "react-router-dom";
import {
  Boxes,
  Database,
  Download,
  FilePlus2,
  Gamepad2,
  Image as ImageIcon,
  Layers,
  Wrench,
  Zap,
} from "lucide-react";

import { useData } from "@/lib/DataContext";
import { StatCard } from "@/components/UI";
import { formatDateTime, formatNumber } from "@/lib/utils";

export function DashboardPage() {
  const { items, media, downloads, analytics, publishedItems } = useData();
  const today = new Date().toISOString().slice(0, 10);
  const todayDownloads =
    downloads.filter((d) => d.timestamp.startsWith(today)).length ||
    analytics.find((a) => a.date === today)?.downloads ||
    0;

  // Defensive: filter clients in the admin sense (all client-type items,
  // regardless of published/archived status) so admins always see them.
  const clients = items
    .filter((i) => i && i.type === "client")
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime(),
    );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Live overview of the catalog. All data syncs across browsers in
          real-time.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Items"
          value={items.length}
          hint={`${publishedItems.length} published`}
          icon={<Boxes size={18} />}
          accent="violet"
        />
        <StatCard
          label="Downloads Today"
          value={formatNumber(todayDownloads)}
          hint={`${downloads.length} events logged`}
          icon={<Download size={18} />}
          accent="emerald"
        />
        <StatCard
          label="Published"
          value={publishedItems.length}
          hint={`${items.length - publishedItems.length} drafts / archived`}
          icon={<Layers size={18} />}
          accent="amber"
        />
        <StatCard
          label="Media"
          value={media.length}
          hint="Images & assets"
          icon={<ImageIcon size={18} />}
          accent="rose"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Quick Add</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <QuickAddCard
            to="/admin/edit/client"
            icon={<Gamepad2 size={18} />}
            title="New Client"
            desc="Add a new PvP or all-in-one client."
            accent="violet"
          />
          <QuickAddCard
            to="/admin/edit/mod"
            icon={<Layers size={18} />}
            title="New Mod"
            desc="Publish a performance / utility mod."
            accent="emerald"
          />
          <QuickAddCard
            to="/admin/edit/macro"
            icon={<Zap size={18} />}
            title="New Macro"
            desc="List an auto-clicker or PvP script."
            accent="amber"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white inline-flex items-center gap-2">
            <Gamepad2 size={16} className="text-violet-300" /> Clients
          </h2>
          <Link
            to="/admin/clients"
            className="text-sm text-violet-300 hover:text-violet-200"
          >
            Manage all →
          </Link>
        </div>
        {clients.length === 0 ? (
          <div className="card text-sm text-slate-500">
            No clients yet. Use Quick add below to create your first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {clients.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                to={`/admin/edit/${c.type}/${c.id}`}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-ink-800/60 p-3 hover:border-violet-500/40 transition-colors"
              >
                {c.thumbnail ? (
                  <img
                    src={c.thumbnail}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-ink-700 border border-white/10 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    v{c.version} · {formatNumber(c.downloads?.total || 0)} downloads
                  </p>
                </div>
                <span
                  className={
                    "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border " +
                    (c.published
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/30")
                  }
                >
                  {c.archived ? "archived" : c.published ? "live" : "draft"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Download size={15} /> Recent Downloads
          </h3>
          {downloads.length === 0 ? (
            <p className="text-sm text-slate-500">No downloads yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {downloads.slice(0, 8).map((d) => (
                <li
                  key={d.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {d.itemName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {d.buttonText} · v{d.version}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {formatDateTime(d.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Database size={15} /> Backend Status
          </h3>
          <div className="space-y-2.5 text-sm">
            <Row label="Storage" value="Upstash Redis (REST)" />
            <Row
              label="API Endpoint"
              value="POST /api/data · GET /api/data?action=all"
            />
            <Row label="Auth" value="Server-verified session token" />
            <Row label="Session" value="sessionStorage (per-tab)" />
            <Row
              label="Items synced"
              value={`${items.length} item${items.length === 1 ? "" : "s"}`}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/admin/clients" className="btn-ghost">
              <Wrench size={13} /> Manage items
            </Link>
            <Link to="/admin/media" className="btn-ghost">
              <ImageIcon size={13} /> Media library
            </Link>
            <Link to="/admin/analytics" className="btn-primary">
              <Download size={13} /> View analytics
            </Link>
            <Link to="/admin/edit/client" className="btn-emerald">
              <FilePlus2 size={13} /> Quick add
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickAddCard({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: "violet" | "emerald" | "amber";
}) {
  const accents = {
    violet: "from-violet-500/15 to-violet-500/0 text-violet-300",
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-300",
    amber: "from-amber-500/15 to-amber-500/0 text-amber-300",
  } as const;
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl glass p-5 hover:-translate-y-0.5 transition-transform"
    >
      <div
        className={`absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br blur-2xl ${accents[accent]}`}
      />
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${accents[accent].split(" ").pop()}`}
      >
        {icon}
      </div>
      <h4 className="mt-3 text-base font-semibold text-white">{title}</h4>
      <p className="text-xs text-slate-400">{desc}</p>
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-mono text-xs truncate max-w-[60%] text-right">
        {value}
      </span>
    </div>
  );
}
