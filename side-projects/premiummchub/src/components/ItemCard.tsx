import { Link } from "react-router-dom";
import { ArrowRight, Download, Star } from "lucide-react";
import type { Item } from "@/types";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/utils/cn";

interface Props {
  item: Item;
  featured?: boolean;
}

const typeColors: Record<string, string> = {
  client: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  mod: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  macro: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export function ItemCard({ item, featured }: Props) {
  return (
    <Link
      to={`/${item.type}/${item.id}`}
      className={cn(
        "group relative block rounded-2xl glass overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/10",
        featured && "ring-1 ring-violet-500/20",
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
              typeColors[item.type],
            )}
          >
            {item.type}
          </span>
          {item.featured && (
            <span className="badge-amber">
              <Star size={10} className="fill-current" /> Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-ink-900/80 px-2 py-1 text-xs font-medium text-slate-200 backdrop-blur">
          <Download size={11} /> {formatNumber(item.downloads?.total || 0)}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
            {item.name}
          </h3>
          <span className="text-[11px] font-mono text-slate-500 shrink-0">
            v{item.version}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400 line-clamp-2 min-h-[2.4em]">
          {item.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>by {item.author}</span>
          <span className="inline-flex items-center gap-1 text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
