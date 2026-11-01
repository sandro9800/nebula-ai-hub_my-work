import { useCallback, useRef, useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ImageDropzoneProps {
  label?: string;
  hint?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  onClear?: () => void;
  uploadLimitMb: number;
  className?: string;
  /** Aspect hint, used only for preview sizing. */
  aspect?: "square" | "wide" | "tall";
  /** Whether the user is also allowed to paste a URL. */
  allowUrl?: boolean;
}

/**
 * Lightweight, self-contained image uploader that:
 *  - accepts drag/drop OR click-to-browse
 *  - reads the file as a base64 data URL
 *  - enforces a soft MB limit
 *  - shows a preview
 *  - optionally accepts a URL paste as a fallback
 */
export function ImageDropzone({
  label = "Upload image",
  hint,
  value,
  onChange,
  onClear,
  uploadLimitMb,
  className,
  aspect = "wide",
  allowUrl = true,
}: ImageDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("That file isn't an image");
        return;
      }
      const limitBytes = uploadLimitMb * 1024 * 1024;
      if (file.size > limitBytes) {
        setError(`File is larger than ${uploadLimitMb}MB`);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        if (result) onChange(result);
      };
      reader.readAsDataURL(file);
    },
    [onChange, uploadLimitMb],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "tall"
        ? "aspect-[3/4]"
        : "aspect-[16/9]";

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>}

      {value ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-white/10 bg-ink-900",
            aspectClass,
          )}
        >
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2.5 py-1 text-xs text-white hover:bg-violet-500/80 backdrop-blur"
            >
              <Upload size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                onClear?.();
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white hover:bg-rose-500"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
            dragOver
              ? "border-violet-400 bg-violet-500/10"
              : "border-white/10 bg-ink-900/40 hover:border-violet-500/40 hover:bg-violet-500/5",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <ImageIcon size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              Drop an image, or click to browse
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {hint || `PNG, JPG, GIF, WebP — up to ${uploadLimitMb}MB`}
            </p>
          </div>
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) readFile(f);
          if (fileRef.current) fileRef.current.value = "";
        }}
      />

      {allowUrl && (
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setUrlMode((s) => !s)}
            className="text-slate-500 hover:text-violet-300"
          >
            {urlMode ? "Hide URL input" : "…or paste a URL instead"}
          </button>
        </div>
      )}

      {allowUrl && urlMode && (
        <div className="flex gap-2">
          <input
            className="input flex-1 text-xs"
            placeholder="https://…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost h-9 text-xs"
            onClick={() => {
              if (urlInput.trim()) {
                onChange(urlInput.trim());
                setUrlInput("");
                setUrlMode(false);
              }
            }}
          >
            Use
          </button>
        </div>
      )}

      {error && <p className="text-[11px] text-rose-300">{error}</p>}
    </div>
  );
}
