import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AnalyticsEntry,
  DataSnapshot,
  DownloadLog,
  Item,
  MediaItem,
  SiteSettings,
} from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import {
  getAllData,
  initStorage,
  logDownload,
  resetAllData,
  saveItems,
  saveMedia,
  saveSettings,
} from "./api";
import { getLocalFallback } from "./seedFallback";

interface DataContextValue extends DataSnapshot {
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  publishedItems: Item[];
  // mutators that persist to server and refresh
  saveItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  saveAllItems: (items: Item[]) => Promise<void>;
  saveMediaList: (media: MediaItem[]) => Promise<void>;
  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  recordDownload: (payload: {
    itemId: string;
    buttonId?: string;
    buttonText?: string;
    version?: string;
  }) => Promise<void>;
  resetEverything: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [downloads, setDownloads] = useState<DownloadLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getAllData();
      setItems(data.items);
      setMedia(data.media);
      setSettings(data.settings);
      setDownloads(data.downloads);
      setAnalytics(data.analytics);
      setError(null);
    } catch (e) {
      // If API isn't reachable (e.g. static preview), fall back to an
      // in-memory seed so the UI still looks alive. We never persist
      // anything to localStorage/sessionStorage.
      const fb = getLocalFallback();
      setItems(fb.items);
      setMedia(fb.media);
      setSettings(fb.settings);
      setDownloads(fb.downloads);
      setAnalytics(fb.analytics);
      const msg = e instanceof Error ? e.message : "Failed to load data";
      setError(
        msg +
          " — showing local preview. Deploy on Vercel with Upstash Redis to enable live sync.",
      );
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initStorage();
        if (!mounted) return;
        await refresh();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const publishedItems = useMemo(
    () => items.filter((i) => i.published && !i.archived),
    [items],
  );

  const value: DataContextValue = {
    items,
    media,
    settings,
    downloads,
    analytics,
    publishedItems,
    loading,
    error,
    refresh,
    async saveItem(item) {
      const existing = items.findIndex((i) => i.id === item.id);
      let next: Item[];
      if (existing >= 0) {
        next = [...items];
        next[existing] = item;
      } else {
        next = [item, ...items];
      }
      await saveItems(next);
      await refresh();
    },
    async deleteItem(id) {
      const next = items.filter((i) => i.id !== id);
      await saveItems(next);
      await refresh();
    },
    async saveAllItems(next) {
      await saveItems(next);
      await refresh();
    },
    async saveMediaList(next) {
      await saveMedia(next);
      await refresh();
    },
    async saveSiteSettings(next) {
      await saveSettings(next);
      await refresh();
    },
    async recordDownload(payload) {
      await logDownload(payload);
      await refresh();
    },
    async resetEverything() {
      await resetAllData();
      await initStorage();
      await refresh();
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
