import { cn } from "@/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-violet-400",
        className,
      )}
    />
  );
}

export function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-900">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-2xl shadow-violet-500/40 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl animate-pulse" />
      </div>
      <p className="mt-6 text-sm text-slate-400">
        {message || "Loading Premium MC Hub…"}
      </p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-ink-900/40 p-10 text-center">
      {icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "violet",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  accent?: "violet" | "emerald" | "amber" | "rose";
}) {
  const accents = {
    violet: "from-violet-500/20 to-violet-500/0 text-violet-300",
    emerald: "from-emerald-500/20 to-emerald-500/0 text-emerald-300",
    amber: "from-amber-500/20 to-amber-500/0 text-amber-300",
    rose: "from-rose-500/20 to-rose-500/0 text-rose-300",
  } as const;
  return (
    <div className="relative overflow-hidden rounded-2xl glass p-5">
      <div
        className={cn(
          "absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl",
          accents[accent],
        )}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-white/5",
              accents[accent].split(" ").pop(),
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
