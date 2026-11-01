import { useMemo, useState } from "react";
import { useData } from "@/lib/DataContext";
import { ItemCard } from "@/components/ItemCard";
import { EmptyState, Spinner } from "@/components/UI";
import { Filter, Gamepad2, Search, X } from "lucide-react";
import type { Item } from "@/types";

type Sort = "popular" | "recent" | "name";

export function ClientsPage() {
  const { publishedItems, loading } = useData();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("popular");

  const clients = useMemo(() => {
    let list = publishedItems.filter((i) => i.type === "client");
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(t) ||
          i.description.toLowerCase().includes(t) ||
          i.tags.some((tag) => tag.toLowerCase().includes(t)),
      );
    }
    list = sortList(list, sort);
    return list;
  }, [publishedItems, q, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
          <Gamepad2 size={12} /> {clients.length} client
          {clients.length === 1 ? "" : "s"} available
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Minecraft <span className="gradient-text">Clients</span>
        </h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          All-in-one PvP, free and premium clients. Each one is reviewed and
          tested by our community.
        </p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            className="input pl-9 pr-9"
            placeholder="Search clients by name, description, or tag…"
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

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Gamepad2 size={20} />}
          title={q ? "No clients match your search" : "No clients published yet"}
          description={
            q
              ? "Try a different keyword or clear the search."
              : "Head to the admin panel to publish your first client."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function sortList(list: Item[], sort: Sort): Item[] {
  const arr = [...list];
  if (sort === "popular") {
    arr.sort((a, b) => (b.downloads?.total || 0) - (a.downloads?.total || 0));
  } else if (sort === "recent") {
    arr.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  } else {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }
  return arr;
}
