import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Filter,
  Loader as LoaderIcon,
  MousePointerClick,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useData } from "@/lib/DataContext";
import { useToast } from "@/components/Toast";
import { EmptyState, Spinner } from "@/components/UI";
import { cn } from "@/utils/cn";
import { formatNumber, newId } from "@/lib/utils";
import type { DownloadButton, Item, ItemType } from "@/types";

/** Defensive normalizer so old / partial items don't crash the table. */
function normalizeItem(it: Item): Item {
  return {
    ...it,
    type: (it.type as ItemType) || "client",
    name: it.name || "Untitled",
    version: it.version || "1.0.0",
    author: it.author || "",
    description: it.description || "",
    content: it.content || "",
    thumbnail: it.thumbnail || "",
    gallery: Array.isArray(it.gallery) ? it.gallery : [],
    tags: Array.isArray(it.tags) ? it.tags : [],
    changelog: it.changelog || "",
    downloadButtons: Array.isArray(it.downloadButtons)
      ? it.downloadButtons
      : [],
    downloads: it.downloads || { total: 0, daily: 0, weekly: 0, monthly: 0 },
    createdAt: it.createdAt || new Date(0).toISOString(),
    updatedAt: it.updatedAt || new Date(0).toISOString(),
    published: !!it.published,
    featured: !!it.featured,
    archived: !!it.archived,
  };
}

/** Pick the first enabled button that has a loaderUrl set. */
function firstLoader(buttons: DownloadButton[] = []): DownloadButton | null {
  return (
    buttons
      .filter((b) => b.enabled !== false)
      .find((b) => !!b.loaderUrl) || null
  );
}

/** Pick the first enabled button that has a guiButtonUrl set. */
function firstGui(buttons: DownloadButton[] = []): DownloadButton | null {
  return (
    buttons
      .filter((b) => b.enabled !== false)
      .find((b) => !!b.guiButtonUrl) || null
  );
}

type TabType = "client" | "tools";

export function ManageItemsPage() {
  const { type: routeType } = useParams<{ type: string }>();
  const tabType: TabType = routeType === "tools" ? "tools" : "client";
  const { items, saveAllItems, deleteItem } = useData();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState<ItemType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft" | "archived" | "featured"
  >("all");
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);

  const allItems = items;

  const filtered = useMemo(() => {
    // Normalize first so partial/old items never crash the table.
    let out = allItems.map(normalizeItem);
    if (tabType === "client") {
      out = out.filter((i) => i.type === "client");
    } else {
      out = out.filter((i) => i.type === "mod" || i.type === "macro");
    }
    if (filterType !== "all") out = out.filter((i) => i.type === filterType);
    if (filterStatus === "published")
      out = out.filter((i) => i.published && !i.archived);
    if (filterStatus === "draft")
      out = out.filter((i) => !i.published && !i.archived);
    if (filterStatus === "archived") out = out.filter((i) => i.archived);
    if (filterStatus === "featured") out = out.filter((i) => i.featured);
    if (q.trim()) {
      const t = q.toLowerCase();
      out = out.filter(
        (i) =>
          i.name.toLowerCase().includes(t) ||
          i.tags.some((tag) => tag.toLowerCase().includes(t)) ||
          i.author.toLowerCase().includes(t),
      );
    }
    out.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return out;
  }, [allItems, tabType, q, filterType, filterStatus]);

  async function patchItem(id: string, patch: Partial<Item>) {
    setBusy(true);
    try {
      const next = allItems.map((i) =>
        i.id === id
          ? { ...i, ...patch, updatedAt: new Date().toISOString() }
          : i,
      );
      await saveAllItems(next);
      toast.push("Item updated", "success");
    } catch (e) {
      toast.push("Update failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function onConfirmDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    try {
      await deleteItem(confirmDelete.id);
      toast.push("Item deleted", "success");
      setConfirmDelete(null);
    } catch {
      toast.push("Delete failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function duplicateItem(item: Item) {
    setBusy(true);
    try {
      const copy: Item = {
        ...item,
        id: newId("item"),
        name: item.name + " (Copy)",
        published: false,
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloads: {
          total: 0,
          daily: 0,
          weekly: 0,
          monthly: 0,
        },
      };
      await saveAllItems([copy, ...allItems]);
      toast.push("Item duplicated", "success");
    } catch {
      toast.push("Duplicate failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {tabType === "client" ? "Clients" : "Mods & Macros"}
          </h1>
          <p className="text-sm text-slate-400">
            {tabType === "client"
              ? "Manage every Minecraft client published on the hub."
              : "Manage mods and macros combined in a single workspace."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={
              tabType === "client"
                ? "/admin/edit/client"
                : "/admin/edit/mod"
            }
            className="btn-primary"
          >
            <Plus size={14} />
            {tabType === "client" ? "New Client" : "New Item"}
          </Link>
        </div>
      </header>

      <div className="card space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              className="input pl-9 pr-9"
              placeholder="Search by name, author, tag…"
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
          {tabType === "tools" && (
            <select
              className="input pr-8 w-full md:w-40"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as ItemType | "all")
              }
            >
              <option value="all">All types</option>
              <option value="mod">Mods only</option>
              <option value="macro">Macros only</option>
            </select>
          )}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-500 hidden md:block" />
            <select
              className="input pr-8 w-full md:w-44"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No items match"
            description="Try clearing filters or add a new item."
          />
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5">
                  <th className="px-5 py-3">Item</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3 hidden lg:table-cell">Author</th>
                  <th className="px-3 py-3 hidden lg:table-cell">Downloads</th>
                  <th className="px-3 py-3 hidden md:table-cell">Loader</th>
                  <th className="px-3 py-3 hidden md:table-cell">GUI Open</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((i) => {
                  const loader = firstLoader(i.downloadButtons);
                  const gui = firstGui(i.downloadButtons);
                  return (
                  <tr
                    key={i.id}
                    className="hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {i.thumbnail ? (
                          <img
                            src={i.thumbnail}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-ink-700 border border-white/10 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {i.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            v{i.version} · {i.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          i.type === "client" &&
                            "bg-violet-500/15 text-violet-300 border-violet-500/30",
                          i.type === "mod" &&
                            "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                          i.type === "macro" &&
                            "bg-amber-500/15 text-amber-300 border-amber-500/30",
                        )}
                      >
                        {i.type}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {i.archived ? (
                        <span className="badge-slate">
                          <Archive size={10} /> Archived
                        </span>
                      ) : i.published ? (
                        <span className="badge-emerald">
                          <CheckCircle2 size={10} /> Published
                        </span>
                      ) : (
                        <span className="badge-amber">Draft</span>
                      )}
                      {i.featured && (
                        <span className="badge-amber ml-1.5">
                          <Star size={10} className="fill-current" /> Featured
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-300 hidden lg:table-cell">
                      {i.author || "—"}
                    </td>
                    <td className="px-3 py-3 text-slate-300 hidden lg:table-cell">
                      {formatNumber(i.downloads?.total || 0)}
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      {loader ? (
                        <a
                          href={loader.loaderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[11px] font-medium text-violet-200 hover:bg-violet-500/20 max-w-[180px]"
                          title={loader.loaderUrl}
                        >
                          <LoaderIcon size={11} />
                          <span className="truncate">
                            v{loader.version || i.version || "—"}
                          </span>
                          <ExternalLink size={10} className="shrink-0 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      {gui ? (
                        <a
                          href={gui.guiButtonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/20 max-w-[180px]"
                          title={gui.guiButtonUrl}
                        >
                          <MousePointerClick size={11} />
                          <span className="truncate">
                            {gui.guiButtonText || "Open"}
                          </span>
                          <ExternalLink size={10} className="shrink-0 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <IconBtn
                          title={i.published ? "Unpublish" : "Publish"}
                          onClick={() =>
                            patchItem(i.id, { published: !i.published })
                          }
                          tone={i.published ? "emerald" : "slate"}
                          disabled={busy}
                        >
                          {i.published ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </IconBtn>
                        <IconBtn
                          title={i.featured ? "Unfeature" : "Feature"}
                          onClick={() =>
                            patchItem(i.id, { featured: !i.featured })
                          }
                          tone="amber"
                          disabled={busy}
                        >
                          <Star
                            size={14}
                            className={i.featured ? "fill-current" : ""}
                          />
                        </IconBtn>
                        <IconBtn
                          title={i.archived ? "Unarchive" : "Archive"}
                          onClick={() =>
                            patchItem(i.id, { archived: !i.archived })
                          }
                          tone="slate"
                          disabled={busy}
                        >
                          {i.archived ? (
                            <ArchiveRestore size={14} />
                          ) : (
                            <Archive size={14} />
                          )}
                        </IconBtn>
                        <IconBtn
                          title="Duplicate"
                          onClick={() => duplicateItem(i)}
                          tone="slate"
                          disabled={busy}
                        >
                          <Plus size={14} />
                        </IconBtn>
                        <Link
                          to={`/admin/edit/${i.type}/${i.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-300 hover:bg-violet-500/20 hover:text-violet-200 border border-white/10"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </Link>
                        <IconBtn
                          title="Delete"
                          onClick={() => setConfirmDelete(i)}
                          tone="rose"
                          disabled={busy}
                        >
                          <Trash2 size={14} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <Modal onClose={() => setConfirmDelete(null)} title="Delete item?">
          <p className="text-sm text-slate-300">
            You're about to permanently delete{" "}
            <span className="text-white font-semibold">
              {confirmDelete.name}
            </span>
            . This cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              className="btn-ghost"
              onClick={() => setConfirmDelete(null)}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={onConfirmDelete}
              disabled={busy}
            >
              {busy ? <Spinner /> : <Trash2 size={14} />} Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  tone,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  tone: "violet" | "emerald" | "amber" | "rose" | "slate";
  disabled?: boolean;
}) {
  const tones = {
    violet:
      "bg-violet-500/10 text-violet-200 border-violet-500/30 hover:bg-violet-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/20",
    amber:
      "bg-amber-500/10 text-amber-200 border-amber-500/30 hover:bg-amber-500/20",
    rose: "bg-rose-500/10 text-rose-200 border-rose-500/30 hover:bg-rose-500/20",
    slate: "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10",
  } as const;
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50",
        tones[tone],
      )}
    >
      {children}
    </button>
  );
}

function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="card max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            className="text-slate-400 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
