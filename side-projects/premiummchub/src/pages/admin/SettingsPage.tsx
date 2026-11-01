import { useEffect, useState } from "react";
import {
  AlertTriangle,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Trash2,
} from "lucide-react";
import { useData } from "@/lib/DataContext";
import { useToast } from "@/components/Toast";
import { LogoUploader } from "@/components/LogoUploader";
import { Spinner } from "@/components/UI";
import type { SiteSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";

export function SettingsPage() {
  const { settings, saveSiteSettings, resetEverything, refresh } = useData();
  const toast = useToast();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    if (!picked && settings) {
      setForm({ ...DEFAULT_SETTINGS, ...settings });
      setPicked(true);
    }
  }, [settings, picked]);

  function set<K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) {
    setForm((s) => ({ ...s, [key]: val }));
  }

  async function onSave() {
    setBusy(true);
    try {
      await saveSiteSettings(form);
      toast.push("Settings saved", "success");
    } catch {
      toast.push("Save failed", "error");
    } finally {
      setBusy(false);
    }
  }

  async function onConfirmReset() {
    setBusy(true);
    try {
      await resetEverything();
      setForm(DEFAULT_SETTINGS);
      setPicked(false);
      toast.push("All data reset to seed", "success");
      await refresh();
    } catch {
      toast.push("Reset failed", "error");
    } finally {
      setBusy(false);
      setConfirmReset(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white inline-flex items-center gap-2">
            <SettingsIcon size={20} /> Settings
          </h1>
          <p className="text-sm text-slate-400">
            Site identity, SEO defaults, and destructive actions.
          </p>
        </div>
        <button onClick={onSave} disabled={busy} className="btn-primary">
          {busy ? "Saving…" : <Save size={14} />} Save changes
        </button>
      </header>

      <section className="card space-y-3">
        <h3 className="font-semibold text-white">Site identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label">Site name</label>
            <input
              className="input"
              value={form.siteName}
              onChange={(e) => set("siteName", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Discord URL</label>
            <input
              className="input"
              value={form.discordUrl}
              onChange={(e) => set("discordUrl", e.target.value)}
              placeholder="https://discord.gg/…"
            />
          </div>
        </div>
        <div>
          <label className="label">Footer text</label>
          <input
            className="input"
            value={form.footerText}
            onChange={(e) => set("footerText", e.target.value)}
          />
        </div>
        <LogoUploader />
      </section>

      <section className="card space-y-3">
        <h3 className="font-semibold text-white">SEO</h3>
        <div>
          <label className="label">SEO title</label>
          <input
            className="input"
            value={form.seoTitle}
            onChange={(e) => set("seoTitle", e.target.value)}
          />
        </div>
        <div>
          <label className="label">SEO description</label>
          <textarea
            className="input min-h-[100px]"
            value={form.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
          />
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="font-semibold text-white">Uploads</h3>
        <div>
          <label className="label">Upload limit (MB per file)</label>
          <input
            type="number"
            min={1}
            max={50}
            className="input"
            value={form.uploadLimit}
            onChange={(e) =>
              set("uploadLimit", Math.max(1, Number(e.target.value) || 1))
            }
          />
        </div>
      </section>

      <section className="card border-rose-500/30 bg-rose-500/5 space-y-3">
        <h3 className="font-semibold text-rose-200 inline-flex items-center gap-2">
          <AlertTriangle size={16} /> Danger zone
        </h3>
        <p className="text-sm text-rose-200/80">
          Resetting will wipe all items, media, downloads, analytics and
          settings, and reseed the demo catalog. This cannot be undone.
        </p>
        <button
          onClick={() => setConfirmReset(true)}
          disabled={busy}
          className="btn-danger"
        >
          <Trash2 size={14} /> Reset all data
        </button>
      </section>

      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="card max-w-md w-full border-rose-500/40"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white mb-2">
              Reset everything?
            </h2>
            <p className="text-sm text-slate-300">
              This will delete all items, media, downloads, and analytics from
              the database and reseed demo data. Type "RESET" mentally — this
              is it.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="btn-ghost"
                onClick={() => setConfirmReset(false)}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={onConfirmReset}
                disabled={busy}
              >
                {busy ? <Spinner /> : <RotateCcw size={14} />} Yes, reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
