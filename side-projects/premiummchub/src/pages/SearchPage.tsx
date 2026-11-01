import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "@/lib/DataContext";
import { ItemCard } from "@/components/ItemCard";
import { EmptyState, Spinner } from "@/components/UI";
import { Filter, Search, X } from "lucide-react";
import type { Item, ItemType } from "@/types";

type Sort = "popular" | "recent" | "name";
type FilterType = "all" | ItemType;

export function SearchPage() {
  const { publishedItems, loading } = useData();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [type, setType] = useState<FilterType>(
    ((params.get("type") as FilterType) || "all"),
  );
  const [sort, setSort] = useState<Sort>(
    ((params.get("sort") as Sort) || "popular"),
  );
  const featuredOnly = params.get("featured") === "1";

  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (type !== "all") p.set("type", type);
    if (sort !== "popular") p.set("sort", sort);
    if (featuredOnly) p.set("featured", "1");
    setParams(p, { replace: true });
  }, [q, type, sort, featuredOnly, setParams]);

  const list: Item[] = useMemo(() => {
    let out = [...publishedItems];
    if (type !== "all") out = out.filter((i) => i.type === type);
    if (featuredOnly) out = out.filter((i) => i.featured);
    if (q.trim()) {
      const t = q.toLowerCase();
      out = out.filter(
        (i) =>
          i.name.toLowerCase().includes(t) ||
          i.description.toLowerCase().includes(t) ||
          i.content.toLowerCase().includes(t) ||
          i.author.toLowerCase().includes(t) ||
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
  }, [publishedItems, q, type, sort, featuredOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          <span className="gradient-text">Search</span> the catalog
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Find anything in the hub — clients, mods, macros, or authors.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { v: "all", label: "All" },
              { v: "client", label: "Clients" },
              { v: "mod", label: "Mods" },
              { v: "macro", label: "Macros" },
            ] as Array<{ v: FilterType; label: string }>
          ).map((b) => (
            <button
              key={b.v}
              onClick={() => setType(b.v)}
              className={
                type === b.v
                  ? "rounded-lg bg-violet-500/15 border border-violet-500/40 text-violet-200 px-3 py-1.5 text-sm"
                  : "rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white px-3 py-1.5 text-sm"
              }
            >
              {b.label}
            </button>
          ))}
          <button
            onClick={() => setSort((s) => (s === "popular" ? "recent" : "popular"))}
            className={
              featuredOnly
                ? "rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-200 px-3 py-1.5 text-sm"
                : "rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white px-3 py-1.5 text-sm"
            }
            onClickCapture={() => {
              const u = new URLSearchParams(params);
              if (featuredOnly) u.delete("featured");
              else u.set("featured", "1");
              setParams(u, { replace: true });
            }}
          >
            Featured only
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className="input pl-9 pr-9"
              placeholder="Search by name, description, author, tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
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
      ) : list.length === 0 ? (
        <EmptyState
          icon={<Search size={20} />}
          title="No results"
          description="Try a different keyword or remove some filters."
        />
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-3">
            {list.length} result{list.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
