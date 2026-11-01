import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader,
  MousePointerClick,
  Star,
  Tag,
  User,
} from "lucide-react";
import { useData } from "@/lib/DataContext";
import { useToast } from "@/components/Toast";
import { Spinner } from "@/components/UI";
import { formatDate, formatNumber } from "@/lib/utils";
import type { DownloadButton, Item } from "@/types";

export function ItemDetailPage() {
  const { id, type } = useParams<{ id: string; type: string }>();
  const { items, publishedItems, recordDownload, loading } = useData();
  const nav = useNavigate();
  const toast = useToast();
  const [active, setActive] = useState(0);

  const item: Item | undefined =
    items.find((i) => i.id === id && i.type === type) ||
    publishedItems.find((i) => i.id === id && i.type === type);

  useEffect(() => {
    if (!loading && !item && id) {
      // Not found after load finished
    }
  }, [loading, item, id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Item not found</h1>
        <p className="mt-2 text-slate-400">
          The item you're looking for doesn't exist or was removed.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
    );
  }

  const gallery =
    item.gallery && item.gallery.length > 0
      ? item.gallery
      : item.thumbnail
        ? [item.thumbnail]
        : [];
  const buttons = (item.downloadButtons || []).filter((b) => b.enabled);

  async function handleDownload(btn: DownloadButton) {
    if (!item) return;
    try {
      await recordDownload({
        itemId: item.id,
        buttonId: btn.id,
        buttonText: btn.text,
        version: btn.version,
      });
      toast.push(`Download started: ${btn.text}`, "success");
      if (btn.url) {
        window.open(btn.url, "_blank", "noopener,noreferrer");
      }
    } catch (e) {
      toast.push("Download tracking failed, opening link anyway", "error");
      if (btn.url) window.open(btn.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            {gallery[active] ? (
              <img
                src={gallery[active]}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ink-700 to-ink-900" />
            )}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="badge-violet">{item.type}</span>
              {item.featured && (
                <span className="badge-amber">
                  <Star size={10} className="fill-current" /> Featured
                </span>
              )}
              {item.published ? (
                <span className="badge-emerald">
                  <CheckCircle2 size={10} /> Published
                </span>
              ) : (
                <span className="badge-slate">Draft</span>
              )}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    active === i
                      ? "border-violet-500"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <img
                    src={g}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">About</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {item.content || item.description}
            </p>
          </section>

          {item.changelog && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">
                Changelog
              </h2>
              <pre className="rounded-2xl glass p-4 text-sm text-slate-300 whitespace-pre-wrap font-sans">
                {item.changelog}
              </pre>
            </section>
          )}

          {item.tags && item.tags.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Tag size={16} /> Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <Link
                    to={`/search?q=${encodeURIComponent(t)}`}
                    key={t}
                    className="badge-slate hover:border-violet-500/40 hover:text-violet-200 transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card sticky top-24">
            <h1 className="text-2xl font-extrabold text-white">{item.name}</h1>
            <p className="mt-1 text-sm text-slate-400">{item.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Info icon={<User size={12} />} label="Author" value={item.author} />
              <Info
                icon={<Calendar size={12} />}
                label="Updated"
                value={formatDate(item.updatedAt)}
              />
              <Info
                icon={<Tag size={12} />}
                label="Version"
                value={"v" + item.version}
                mono
              />
              <Info
                icon={<Download size={12} />}
                label="Downloads"
                value={formatNumber(item.downloads?.total || 0)}
              />
            </div>

            <div className="mt-5 space-y-2">
              {buttons.length === 0 && (
                <p className="text-sm text-slate-500">
                  No download links available.
                </p>
              )}
              {buttons
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((b) => (
                  <div key={b.id} className="space-y-1.5">
                    <button
                      onClick={() => handleDownload(b)}
                      className="btn-primary w-full justify-between"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Download size={14} /> {b.text}
                      </span>
                      <ExternalLink size={13} />
                    </button>
                    {b.loaderUrl && (
                      <a
                        href={b.loaderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          recordDownload({
                            itemId: item.id,
                            buttonId: b.id,
                            buttonText: b.text + " (loader)",
                            version: b.version,
                          })
                        }
                        className="btn-ghost w-full justify-between text-xs h-9"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Loader size={12} /> Loader · v{b.version}
                        </span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                    {b.guiButtonUrl && (
                      <a
                        href={b.guiButtonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          recordDownload({
                            itemId: item.id,
                            buttonId: b.id,
                            buttonText: b.text + " (gui)",
                            version: b.version,
                          })
                        }
                        className="btn-emerald w-full justify-between text-xs h-9"
                      >
                        <span className="inline-flex items-center gap-2">
                          <MousePointerClick size={12} />{" "}
                          {b.guiButtonText || "Open GUI"}
                        </span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
            </div>

            {item.downloads && (
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {(
                  [
                    { l: "Today", v: item.downloads.daily || 0 },
                    { l: "Week", v: item.downloads.weekly || 0 },
                    { l: "Month", v: item.downloads.monthly || 0 },
                  ] as const
                ).map((s) => (
                  <div
                    key={s.l}
                    className="rounded-lg bg-ink-900/60 border border-white/5 p-2"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {s.l}
                    </p>
                    <p className="text-base font-bold text-white">
                      {formatNumber(s.v)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg bg-ink-900/60 border border-white/5 p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-500 inline-flex items-center gap-1">
        {icon} {label}
      </p>
      <p
        className={`mt-0.5 text-sm text-slate-200 truncate ${
          mono ? "font-mono" : "font-medium"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
