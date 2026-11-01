import { useState } from "react";
import { ImageDown, Sparkles, Upload, X } from "lucide-react";
import { useData } from "@/lib/DataContext";
import { useToast } from "@/components/Toast";
import { DEFAULT_SETTINGS } from "@/types";

/**
 * Dedicated logo / icon uploader for the site header.
 * Persists directly to settings.logo via the same Redis-backed pipeline.
 * Not tied to the media library.
 */
export function LogoUploader() {
  const { settings, saveSiteSettings, refresh } = useData();
  const toast = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);

  const limit = (settings.uploadLimit || DEFAULT_SETTINGS.uploadLimit || 5);
  const logo = settings.logo || "";

  async function persist(next: string) {
    setBusy(true);
    try {
      await saveSiteSettings({ ...settings, logo: next });
      await refresh();
      toast.push(
        next ? "Site logo updated" : "Site logo cleared",
        "success",
      );
    } catch {
      toast.push("Logo update failed", "error");
    } finally {
      setBusy(false);
    }
  }

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.push("That file isn't an image", "error");
      return;
    }
    if (file.size > limit * 1024 * 1024) {
      toast.push(`File exceeds ${limit}MB limit`, "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) persist(result);
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    persist("");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
        <ImageDown size={12} /> Website logo / icon
      </div>
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        <div className="flex items-center justify-center rounded-xl border border-white/10 bg-ink-900/60 p-3 w-full md:w-32 h-24 overflow-hidden">
          {logo ? (
            <img
              src={logo}
              alt="Current site logo"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <Sparkles size={18} />
              <span className="mt-1 text-[10px]">Default mark</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) readFile(f);
            }}
            className={
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-3 py-3 text-center transition-colors " +
              (dragOver
                ? "border-violet-400 bg-violet-500/10"
                : "border-white/10 bg-ink-900/40 hover:border-violet-500/40 hover:bg-violet-500/5")
            }
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f);
                e.target.value = "";
              }}
            />
            <Upload size={16} className="text-violet-300" />
            <p className="mt-1 text-xs font-medium text-slate-200">
              {busy ? "Uploading…" : "Click or drop to upload logo"}
            </p>
            <p className="text-[10px] text-slate-500">
              PNG / SVG / WebP — up to {limit}MB
            </p>
          </label>

          <div className="flex items-center gap-2">
            {logo && (
              <button
                type="button"
                onClick={clear}
                disabled={busy}
                className="btn-ghost h-8 text-xs text-rose-300"
              >
                <X size={12} /> Clear logo
              </button>
            )}
            <p className="text-[11px] text-slate-500">
              Stored independently of the media library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
