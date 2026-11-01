import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  Cpu,
  Download,
  Gamepad2,
  Layers,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useData } from "@/lib/DataContext";
import { ItemCard } from "@/components/ItemCard";
import { StatCard } from "@/components/UI";
import { formatNumber } from "@/lib/utils";

export function HomePage() {
  const { items, publishedItems } = useData();
  const totalDownloads = publishedItems.reduce(
    (sum, i) => sum + (i.downloads?.total || 0),
    0,
  );
  const featured = publishedItems.filter((i) => i.featured).slice(0, 6);
  const popular = [...publishedItems]
    .sort((a, b) => (b.downloads?.total || 0) - (a.downloads?.total || 0))
    .slice(0, 6);
  const recent = [...publishedItems]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 6);

  const clientsCount = publishedItems.filter((i) => i.type === "client").length;
  const modsCount = publishedItems.filter((i) => i.type === "mod").length;
  const macrosCount = publishedItems.filter((i) => i.type === "macro").length;

  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
              <Sparkles size={12} /> Live, synced across all devices
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-balance">
              <span className="text-white">The premium vault for</span>{" "}
              <span className="gradient-text">Minecraft power-users</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-400 max-w-2xl text-balance">
              Discover curated clients, mods, and macros — handpicked,
              beautifully documented, and instantly downloadable.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/clients" className="btn-primary h-11 px-5">
                Browse Clients <ArrowRight size={15} />
              </Link>
              <Link to="/mods-and-macros" className="btn-ghost h-11 px-5">
                Mods & Macros
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Total Items"
              value={publishedItems.length}
              hint={`${items.length} in catalog`}
              icon={<Boxes size={18} />}
              accent="violet"
            />
            <StatCard
              label="Downloads"
              value={formatNumber(totalDownloads)}
              hint={`across ${publishedItems.length} items`}
              icon={<Download size={18} />}
              accent="emerald"
            />
            <StatCard
              label="Clients"
              value={clientsCount}
              hint="PvP & utility"
              icon={<Gamepad2 size={18} />}
              accent="amber"
            />
            <StatCard
              label="Mods + Macros"
              value={modsCount + macrosCount}
              hint={`${modsCount} mods · ${macrosCount} macros`}
              icon={<Wrench size={18} />}
              accent="violet"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CategoryCard
            to="/clients"
            icon={<Gamepad2 size={20} />}
            title="Minecraft Clients"
            desc="Full PvP, all-in-one, and free clients — ready to install."
            accent="violet"
            count={clientsCount}
          />
          <CategoryCard
            to="/mods-and-macros?type=mod"
            icon={<Layers size={20} />}
            title="Performance Mods"
            desc="OptiFine, Sodium, FPS boosts and visual upgrades."
            accent="emerald"
            count={modsCount}
          />
          <CategoryCard
            to="/mods-and-macros?type=macro"
            icon={<Zap size={20} />}
            title="Macros & Scripts"
            desc="Auto-clickers, bedwars helpers, and PvP scripts."
            accent="amber"
            count={macrosCount}
          />
        </div>
      </section>

      {featured.length > 0 && (
        <Section
          title="Featured"
          subtitle="The cream of the crop, curated weekly."
          icon={<Sparkles size={16} />}
          linkTo="/search?featured=1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((i) => (
              <ItemCard key={i.id} item={i} featured />
            ))}
          </div>
        </Section>
      )}

      {popular.length > 0 && (
        <Section
          title="Most Popular"
          subtitle="What the community downloads the most."
          icon={<Download size={16} />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popular.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        </Section>
      )}

      {recent.length > 0 && (
        <Section
          title="Recently Updated"
          subtitle="Fresh releases and version bumps."
          icon={<Cpu size={16} />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        </Section>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-ink-900 to-emerald-500/5 p-8 md:p-12">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Want your client on the hub?
            </h3>
            <p className="mt-3 text-slate-300/80">
              Apply through the admin panel to publish your client, mod, or
              macro. Everything is reviewed and stored securely in the cloud.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/search" className="btn-primary">
                Explore the catalog <ArrowRight size={14} />
              </Link>
              <Link to="/clients" className="btn-ghost">
                See clients
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  linkTo,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  linkTo?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-violet-300">
            {icon}
            <h2 className="section-title">{title}</h2>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
        {linkTo && (
          <Link
            to={linkTo}
            className="text-sm text-violet-300 hover:text-violet-200 inline-flex items-center gap-1"
          >
            View all <ArrowRight size={13} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function CategoryCard({
  to,
  icon,
  title,
  desc,
  count,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  count: number;
  accent: "violet" | "emerald" | "amber";
}) {
  const accents = {
    violet: "from-violet-500/15 to-violet-500/0 text-violet-300 border-violet-500/20",
    emerald: "from-emerald-500/15 to-emerald-500/0 text-emerald-300 border-emerald-500/20",
    amber: "from-amber-500/15 to-amber-500/0 text-amber-300 border-amber-500/20",
  } as const;
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-2xl border bg-ink-800/60 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 ${accents[accent]}`}
    >
      <div
        className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl ${accents[accent]}`}
      />
      <div className="relative">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${accents[accent].split(" ").pop()}`}
        >
          {icon}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">{count} items</span>
          <span className="inline-flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity text-white">
            Browse <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
