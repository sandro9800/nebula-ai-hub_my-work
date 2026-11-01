import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader as LoaderIcon,
  MousePointerClick,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useData } from "@/lib/DataContext";
import { useToast } from "@/components/Toast";
import { ImageDropzone } from "@/components/ImageDropzone";
import { newId } from "@/lib/utils";
import type { DownloadButton, Item, ItemType } from "@/types";

const DEFAULT_ITEM: Item = {
  id: "",
  type: "client",
  name: "",
  description: "",
  content: "",
  thumbnail: "",
  gallery: [],
  tags: [],
  author: "",
  version: "1.0.0",
  changelog: "",
  downloads: { total: 0, daily: 0, weekly: 0, monthly: 0 },
  downloadButtons: [],
  featured: false,
  published: false,
  archived: false,
  createdAt: "",
  updatedAt: "",
};

function makeItem(type: ItemType): Item {
  return {
    ...DEFAULT_ITEM,
    id: newId("item"),
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function EditItemPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const itemType: ItemType =
    type === "mod" || type === "macro" ? type : "client";
  const nav = useNavigate();
  const toast = useToast();
  const { items, saveItem, media, settings } = useData();
  const [item, setItem] = useState<Item>(() => makeItem(itemType));
  const [tagInput, setTagInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Load existing item from context once items are available
  useEffect(() => {
    if (!id) return;
    if (items.length === 0) return;
    if (picked) return;
    const found = items.find((i) => i.id === id);
    if (found) {
      setItem({ ...found });
      setPicked(true);
    }
  }, [id, items, picked]);

  // When route type changes, reset the base
  useEffect(() => {
    if (!id) {
      setItem((it) => ({
        ...it,
        type: itemType,
        id: newId("item"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setPicked(true);
    }
  }, [itemType, id]);

  function set<K extends keyof Item>(key: K, val: Item[K]) {
    setItem((it) => ({ ...it, [key]: val }));
  }

  function addTag() {
    const v = tagInput.trim();
    if (!v) return;
    if (item.tags.includes(v)) {
      setTagInput("");
      return;
    }
    set("tags", [...item.tags, v]);
    setTagInput("");
  }
  function removeTag(t: string) {
    set("tags", item.tags.filter((x) => x !== t));
  }

  function addGallery() {
    const v = galleryInput.trim();
    if (!v) return;
    set("gallery", [...item.gallery, v]);
    setGalleryInput("");
  }
  function removeGallery(g: string) {
    set("gallery", item.gallery.filter((x) => x !== g));
  }

  // Direct multi-file gallery upload. Uses a ref (not the React synthetic
  // event) to clear the input after the await, because React nullifies the
  // event payload after async work — using e.target.value there would
  // throw at runtime.
  async function uploadGalleryFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const limitBytes = (settings.uploadLimit || 5) * 1024 * 1024;
      const next: string[] = [...item.gallery];
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) {
          toast.push(`${f.name} is not an image`, "error");
          continue;
        }
        if (f.size > limitBytes) {
          toast.push(`${f.name} exceeds ${settings.uploadLimit || 5}MB limit`, "error");
          continue;
        }
        const data: string = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result || ""));
          r.onerror = () => resolve("");
          r.readAsDataURL(f);
        });
        if (data) next.push(data);
      }
      set("gallery", next);
      if (next.length > item.gallery.length) {
        toast.push("Images added to gallery", "success");
      }
    } catch (err) {
      toast.push("Upload failed", "error");
    } finally {
      setUploadingGallery(false);
      if (galleryFileRef.current) galleryFileRef.current.value = "";
    }
  }

  function addButton() {
    const btn: DownloadButton = {
      id: newId("btn"),
      text: "Download",
      url: "",
      version: item.version || "1.0.0",
      order: item.downloadButtons.length,
      enabled: true,
    };
    set("downloadButtons", [...item.downloadButtons, btn]);
  }
  function updateButton(bid: string, patch: Partial<DownloadButton>) {
    set(
      "downloadButtons",
      item.downloadButtons.map((b) =>
        b.id === bid ? { ...b, ...patch } : b,
      ),
    );
  }
  function removeButton(bid: string) {
    set(
      "downloadButtons",
      item.downloadButtons
        .filter((b) => b.id !== bid)
        .map((b, i) => ({ ...b, order: i })),
    );
  }
  function moveButton(bid: string, dir: -1 | 1) {
    const idx = item.downloadButtons.findIndex((b) => b.id === bid);
    if (idx < 0) return;
    const next = [...item.downloadButtons];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    set("downloadButtons", next.map((b, i) => ({ ...b, order: i })));
  }

  async function onSave() {
    if (!item.name.trim()) {
      toast.push("Name is required", "error");
      return;
    }
    setBusy(true);
    try {
      const final: Item = {
        ...item,
        updatedAt: new Date().toISOString(),
        createdAt: item.createdAt || new Date().toISOString(),
      };
      await saveItem(final);
      toast.push("Item saved", "success");
      nav("/admin/" + (item.type === "client" ? "clients" : "tools"));
    } catch {
      toast.push("Save failed", "error");
    } finally {
      setBusy(false);
    }
  }

  const allImages = useMemo(() => {
    const urls = media.map((m) => m.data);
    return [item.thumbnail, ...item.gallery].filter(Boolean).concat(urls);
  }, [item, media]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {id ? "Edit" : "Create"} {itemType}
          </h1>
          <p className="text-sm text-slate-400">
            Quick workflow: fill the basics, drag/drop a thumbnail, add a
            download button with a Loader and an optional GUI button, save.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/${itemType}/${item.id}`}
            target="_blank"
            className="btn-ghost"
          >
            <Eye size={14} /> Preview
          </Link>
          <button onClick={onSave} disabled={busy} className="btn-primary">
            {busy ? "Saving…" : <Save size={14} />} Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <section className="card space-y-3">
            <h3 className="font-semibold text-white">Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label">Name *</label>
                <input
                  className="input"
                  value={item.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Lunar Client"
                />
              </div>
              <div>
                <label className="label">Author</label>
                <input
                  className="input"
                  value={item.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. Moonsworth"
                />
              </div>
              <div>
                <label className="label">Version</label>
                <input
                  className="input"
                  value={item.version}
                  onChange={(e) => set("version", e.target.value)}
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  className="input pr-8"
                  value={item.type}
                  onChange={(e) => set("type", e.target.value as ItemType)}
                >
                  <option value="client">Client</option>
                  <option value="mod">Mod</option>
                  <option value="macro">Macro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Short description</label>
              <input
                className="input"
                value={item.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="One-line summary shown on cards."
              />
            </div>
            <div>
              <label className="label">Long content / About</label>
              <textarea
                className="input min-h-[160px] resize-y"
                value={item.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Detailed write-up, paragraphs welcome."
              />
            </div>
          </section>

          <section className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Media</h3>
              <span className="text-[11px] text-slate-500">
                Optional — uploads are saved with this item.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageDropzone
                label="Thumbnail"
                hint="Drag/drop or click — shows on cards."
                value={item.thumbnail}
                onChange={(v) => set("thumbnail", v)}
                uploadLimitMb={settings.uploadLimit || 5}
                aspect="wide"
              />
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Gallery
                </div>
                <div className="rounded-xl border-2 border-dashed border-white/10 bg-ink-900/40 p-3">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Quick-add a single image to the gallery, or upload multiple
                    at once:
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="input flex-1 text-xs"
                      value={galleryInput}
                      onChange={(e) => setGalleryInput(e.target.value)}
                      placeholder="https://…"
                    />
                    <button
                      onClick={addGallery}
                      className="btn-ghost shrink-0 h-9 text-xs"
                    >
                      <Plus size={12} /> Add URL
                    </button>
                  </div>
                  <label
                    className={
                      "mt-2 inline-flex items-center gap-1.5 text-[11px] cursor-pointer " +
                      (uploadingGallery
                        ? "text-slate-500 pointer-events-none"
                        : "text-violet-300 hover:text-violet-200")
                    }
                  >
                    <ImageIcon size={12} />
                    {uploadingGallery
                      ? "Uploading…"
                      : "Upload images directly"}
                    <input
                      ref={galleryFileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => uploadGalleryFiles(e.target.files)}
                    />
                  </label>
                </div>
                {item.gallery.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {item.gallery.map((g) => (
                      <div
                        key={g}
                        className="relative group aspect-square overflow-hidden rounded-lg border border-white/10"
                      >
                        <img
                          src={g}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => removeGallery(g)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {allImages.length > 0 && (
              <details className="text-xs text-slate-400">
                <summary className="cursor-pointer hover:text-white inline-flex items-center gap-1">
                  <ImageIcon size={12} /> Pick from Media library (optional)
                </summary>
                <p className="text-[11px] text-slate-500 mt-1">
                  You don't need to upload to the Media library first — these
                  are pre-uploaded images you can also reuse.
                </p>
                <div className="mt-2 grid grid-cols-6 gap-2 max-h-44 overflow-y-auto">
                  {allImages.map((u, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (!item.thumbnail) set("thumbnail", u);
                        else set("gallery", [...item.gallery, u]);
                        toast.push("Image attached", "info");
                      }}
                      className="aspect-square overflow-hidden rounded-md border border-white/10 hover:border-violet-500"
                    >
                      <img
                        src={u}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </details>
            )}
          </section>

          <section className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Download buttons</h3>
              <button onClick={addButton} className="btn-ghost h-8">
                <Plus size={13} /> Add button
              </button>
            </div>
            <p className="text-xs text-slate-500 -mt-1">
              Each button has a <span className="text-slate-300">Loader</span>{" "}
              (the actual file/installer) and an optional{" "}
              <span className="text-slate-300">GUI button</span> that opens a
              companion app or shortcut. URL is the public landing page.
            </p>
            {item.downloadButtons.length === 0 && (
              <p className="text-sm text-slate-500">No buttons yet.</p>
            )}
            <div className="space-y-3">
              {item.downloadButtons.map((b, idx) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-white/10 p-3 space-y-3 bg-ink-900/40"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div>
                      <label className="label">Text</label>
                      <input
                        className="input"
                        placeholder="e.g. Download for Windows"
                        value={b.text}
                        onChange={(e) =>
                          updateButton(b.id, { text: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Landing URL</label>
                      <input
                        className="input"
                        placeholder="https://example.com"
                        value={b.url}
                        onChange={(e) =>
                          updateButton(b.id, { url: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Version</label>
                      <input
                        className="input"
                        placeholder="1.0.0"
                        value={b.version}
                        onChange={(e) =>
                          updateButton(b.id, { version: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-300 mb-1.5">
                        <LoaderIcon size={12} /> Loader
                      </div>
                      <input
                        className="input text-xs"
                        placeholder="Direct .jar / installer URL"
                        value={b.loaderUrl || ""}
                        onChange={(e) =>
                          updateButton(b.id, { loaderUrl: e.target.value })
                        }
                      />
                      <p className="mt-1 text-[10px] text-slate-500">
                        The file the user actually downloads.
                      </p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
                        <MousePointerClick size={12} /> GUI button
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="input text-xs"
                          placeholder="https://… / launch://…"
                          value={b.guiButtonUrl || ""}
                          onChange={(e) =>
                            updateButton(b.id, { guiButtonUrl: e.target.value })
                          }
                        />
                        <input
                          className="input text-xs"
                          placeholder='Label, e.g. "Launch GUI"'
                          value={b.guiButtonText || ""}
                          onChange={(e) =>
                            updateButton(b.id, { guiButtonText: e.target.value })
                          }
                        />
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Optional: opens a companion app / installer shortcut.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateButton(b.id, { enabled: !b.enabled })}
                        className={
                          b.enabled
                            ? "badge-emerald cursor-pointer"
                            : "badge-slate cursor-pointer"
                        }
                      >
                        {b.enabled ? "Enabled" : "Disabled"}
                      </button>
                      <span className="text-slate-500">Order #{idx + 1}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveButton(b.id, -1)}
                        className="btn-ghost h-7 px-2"
                        disabled={idx === 0}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveButton(b.id, 1)}
                        className="btn-ghost h-7 px-2"
                        disabled={idx === item.downloadButtons.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeButton(b.id)}
                        className="btn-ghost h-7 px-2 text-rose-300"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card space-y-3">
            <h3 className="font-semibold text-white">Changelog</h3>
            <textarea
              className="input min-h-[120px] font-mono text-xs"
              value={item.changelog}
              onChange={(e) => set("changelog", e.target.value)}
              placeholder="• Added new feature&#10;• Fixed bug"
            />
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card space-y-3">
            <h3 className="font-semibold text-white">Visibility</h3>
            <Toggle
              icon={item.published ? <Eye size={14} /> : <EyeOff size={14} />}
              label="Published"
              value={item.published}
              onChange={(v) => set("published", v)}
            />
            <Toggle
              icon={<Star size={14} className={item.featured ? "fill-current" : ""} />}
              label="Featured"
              value={item.featured}
              onChange={(v) => set("featured", v)}
            />
            <Toggle
              icon={<X size={14} />}
              label="Archived"
              value={item.archived}
              onChange={(v) => set("archived", v)}
            />
          </section>
          <section className="card space-y-3">
            <h3 className="font-semibold text-white">Tags</h3>
            <div className="flex gap-2">
              <input
                className="input flex-1"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
              />
              <button onClick={addTag} className="btn-ghost shrink-0">
                <Plus size={14} />
              </button>
            </div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="badge-violet cursor-pointer"
                    onClick={() => removeTag(t)}
                    title="Click to remove"
                  >
                    {t} <X size={10} />
                  </span>
                ))}
              </div>
            )}
          </section>
          <section className="card space-y-2 text-xs text-slate-400">
            <h3 className="font-semibold text-white text-sm flex items-center gap-1">
              <LinkIcon size={12} /> IDs
            </h3>
            <p>
              Item ID: <span className="font-mono text-slate-300">{item.id}</span>
            </p>
            <p>
              Created: <span className="font-mono text-slate-300">{item.createdAt || "—"}</span>
            </p>
            <p>
              Updated: <span className="font-mono text-slate-300">{item.updatedAt || "—"}</span>
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Toggle({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={
        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors " +
        (value
          ? "border-violet-500/30 bg-violet-500/10 text-violet-200"
          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10")
      }
    >
      <span className="inline-flex items-center gap-2">
        {icon} {label}
      </span>
      <span
        className={
          "h-5 w-9 rounded-full p-0.5 transition-colors " +
          (value ? "bg-violet-500" : "bg-ink-700")
        }
      >
        <span
          className={
            "block h-4 w-4 rounded-full bg-white transition-transform " +
            (value ? "translate-x-4" : "translate-x-0")
          }
        />
      </span>
    </button>
  );
}
