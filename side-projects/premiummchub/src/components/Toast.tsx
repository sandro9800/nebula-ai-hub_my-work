import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/utils/cn";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}
interface ToastApi {
  push: (text: string, kind?: ToastKind) => void;
}
const ToastCtx = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm shadow-2xl backdrop-blur-xl animate-fade-in-up",
              t.kind === "success" &&
                "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
              t.kind === "error" &&
                "bg-rose-500/10 border-rose-500/30 text-rose-200",
              t.kind === "info" &&
                "bg-violet-500/10 border-violet-500/30 text-violet-200",
            )}
          >
            {t.kind === "success" && <CheckCircle2 size={15} />}
            {t.kind === "error" && <AlertCircle size={15} />}
            {t.kind === "info" && <Info size={15} />}
            <span className="flex-1">{t.text}</span>
            <button
              onClick={() =>
                setToasts((all) => all.filter((x) => x.id !== t.id))
              }
              className="opacity-60 hover:opacity-100"
              aria-label="dismiss"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const c = useContext(ToastCtx);
  if (!c) throw new Error("useToast must be used inside ToastProvider");
  return c;
}
