import { useEffect, useMemo, useState } from "react";
import { useData } from "@/lib/DataContext";
import { ItemCard } from "@/components/ItemCard";
import { EmptyState, Spinner } from "@/components/UI";
import { Filter, Layers, Search, X, Zap } from "lucide-react";
import type { ReactNode } from "react";
import type { ItemType } from "@/types";

type Sort = "popular" | "recent" | "name";
type FilterType = "all" | ItemType;

export function ModsAndMacrosPage() {
  const { publishedItems, loading } = useData();
  const [q, setQ] = useState("");
  const [type, setType] = useState<FilterType>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [page, setPage] = useState(1);
  const perPage = 9;

  useEffect(() => {
    setPage(1);
  }, [q, type, sort]);

  const list = useMemo(() => {
    let out = publishedItems.filter(
      (i) => i.type === "mod" || i.type === "macro",
    );
    if (type !== "all") out = out.filter((i) => i.type === type);
    if (q.trim()) {
      const t = q.toLowerCase();
      out = out.filter(
        (i) =>
          i.name.toLowerCase().includes(t) ||
          i.description.toLowerCase().includes(t) ||
          i.tags.some((tag) => tag.toLowerCase().includes(t)),
      );
    }
    if (sort === "popular") {
      out.sort((a, b) => (b.downloads?.total || 0) - (a.downloads?.total || 0));
    } else if (sort === "recent") {
      out.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    } else {
      out.sort((a, b) => a.name.localeCompare(b.name));
    }
    return out;
  }, [publishedItems, type, q, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const paged = list.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
          <Layers size={12} /> {list.length} item
          {list.length === 1 ? "" : "s"} available
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Mods & <span className="gradient-text">Macros</span>
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Performance mods, utilities, and PvP macros. Filter by category and
          sort by what matters to you.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { v: "all", label: "All", icon: <Layers size={13} /> },
              { v: "mod", label: "Mods", icon: <Layers size={13} /> },
              { v: "macro", label: "Macros", icon: <Zap size={13} /> },
            ] as Array<{ v: FilterType; label: string; icon: ReactNode }>
          ).map((b) => (
            <button
              key={b.v}
              onClick={() => setType(b.v)}
              className={
                type === b.v
                  ? "inline-flex items-center gap-1.5 rounded-lg bg-violet-500/15 border border-violet-500/40 text-violet-200 px-3 py-1.5 text-sm"
                  : "inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white px-3 py-1.5 text-sm"
              }
            >
              {b.icon} {b.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className="input pl-9 pr-9"
              placeholder="Search mods & macros…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
                onClick={() => setQ("")}
                aria-label="Clear"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500 hidden sm:block" />
            <select
              className="input pr-8 w-full sm:w-44"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Recently Updated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : paged.length === 0 ? (
        <EmptyState
          icon={<Layers size={20} />}
          title="No items found"
          description="Try a different filter or search term."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paged.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost h-9"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={
                    n === page
                      ? "h-9 w-9 rounded-lg bg-violet-500 text-white text-sm font-bold"
                      : "h-9 w-9 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 text-sm"
                  }
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost h-9"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
