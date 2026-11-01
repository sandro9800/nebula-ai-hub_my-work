import { useRef, useState } from "react";
import { useData } from "@/lib/DataContext";
import { useToast } from "@/components/Toast";
import { EmptyState } from "@/components/UI";
import { Copy, Image as ImageIcon, Trash2, Upload, X } from "lucide-react";
import { bytesToHuman, newId } from "@/lib/utils";
import type { MediaItem } from "@/types";

export function MediaPage() {
  const { media, saveMediaList, settings } = useData();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const uploadLimit = (settings.uploadLimit || 5) * 1024 * 1024;

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function onUploadClick() {
    fileRef.current?.click();
  }

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const next: MediaItem[] = [...media];
      for (const f of Array.from(files)) {
        if (f.size > uploadLimit) {
          toast.push(
            `${f.name} exceeds ${(settings.uploadLimit || 5)}MB limit`,
            "error",
          );
          continue;
        }
        if (!f.type.startsWith("image/")) {
          toast.push(`${f.name} is not an image`, "error");
          continue;
        }
        const data = await readFileAsDataURL(f);
        next.unshift({
          id: newId("media"),
          name: f.name,
          data,
          size: f.size,
          type: f.type,
          uploadedAt: new Date().toISOString(),
        });
      }
      await saveMediaList(next);
      toast.push("Uploaded to media library", "success");
    } catch (e) {
      toast.push("Upload failed", "error");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onDelete(m: MediaItem) {
    if (!confirm(`Delete ${m.name}?`)) return;
    setBusy(true);
    try {
      await saveMediaList(media.filter((x) => x.id !== m.id));
      toast.push("Media removed", "success");
    } catch {
      toast.push("Delete failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function copy(m: MediaItem) {
    try {
      await navigator.clipboard.writeText(m.data);
      toast.push("Copied data URL to clipboard", "success");
    } catch {
      toast.push("Copy failed", "error");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Media</h1>
          <p className="text-sm text-slate-400">
            The media library is now <span className="text-slate-200 font-medium">optional</span>.
            You can also drag-drop images directly into any item editor — no
            need to pre-upload here. Images are stored as base64 in the
            database. Limit: {settings.uploadLimit || 5}MB per file.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <button onClick={onUploadClick} className="btn-primary" disabled={busy}>
            <Upload size={14} /> Upload images
          </button>
        </div>
      </header>

      {media.length === 0 ? (
        <EmptyState
          icon={<ImageIcon size={20} />}
          title="Media library is empty"
          description="No problem — the editor now lets you drag-drop images directly into any item. Upload here only if you want to reuse the same image across multiple items."
          action={
            <button onClick={onUploadClick} className="btn-primary">
              <Upload size={14} /> Upload your first image
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60 hover:border-violet-500/40 transition-colors"
            >
              <button
                onClick={() => setPreview(m)}
                className="block aspect-square w-full overflow-hidden"
              >
                <img
                  src={m.data}
                  alt={m.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
              <div className="p-2.5 text-xs">
                <p className="font-medium text-white truncate" title={m.name}>
                  {m.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {bytesToHuman(m.size)}
                </p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copy(m)}
                  className="p-1.5 rounded-md bg-black/70 text-white hover:bg-violet-500"
                  title="Copy data URL"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => onDelete(m)}
                  className="p-1.5 rounded-md bg-black/70 text-white hover:bg-rose-500"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.data}
              alt={preview.name}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 p-2 rounded-md bg-black/70 text-white hover:bg-rose-500"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
