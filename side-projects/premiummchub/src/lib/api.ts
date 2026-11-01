import type {
  DataSnapshot,
  DownloadLog,
  Item,
  MediaItem,
  SiteSettings,
} from "@/types";
import { DEFAULT_SETTINGS } from "@/types";
import { getToken, logout } from "./auth";

async function apiFetch(action: string, body?: unknown): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`/api/data?action=${encodeURIComponent(action)}`, {
    method: body !== undefined ? "POST" : "GET",
    headers,
    body: body !== undefined ? JSON.stringify(body || {}) : undefined,
  });
  // An expired or invalid session: drop it so the admin is sent to log in again.
  if (res.status === 401 && token) logout();
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      if (j && j.error) detail = j.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(`API ${action} failed: ${detail}`);
  }
  return res.json();
}

export async function initStorage(): Promise<void> {
  try {
    await apiFetch("init");
  } catch (e) {
    // network errors should be visible but non-fatal for UI
    // eslint-disable-next-line no-console
    console.warn("initStorage failed:", e);
  }
}

export async function resetAllData(): Promise<void> {
  await apiFetch("reset");
}

export async function getAllData(): Promise<DataSnapshot> {
  const res = await apiFetch("all");
  const d = (res?.data || {}) as Partial<DataSnapshot>;
  return {
    items: d.items || [],
    media: d.media || [],
    settings: d.settings || DEFAULT_SETTINGS,
    downloads: d.downloads || [],
    analytics: d.analytics || [],
  };
}

export async function getItems(): Promise<Item[]> {
  const res = await apiFetch("items");
  return res.data || [];
}

export async function saveItems(items: Item[]): Promise<void> {
  await apiFetch("items", { data: items });
}

export async function getMedia(): Promise<MediaItem[]> {
  const res = await apiFetch("media");
  return res.data || [];
}

export async function saveMedia(media: MediaItem[]): Promise<void> {
  await apiFetch("media", { data: media });
}

export async function getSettings(): Promise<SiteSettings> {
  const res = await apiFetch("settings");
  return res.data || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await apiFetch("settings", { data: settings });
}

export async function getDownloads(): Promise<DownloadLog[]> {
  const res = await apiFetch("downloads");
  return res.data || [];
}

export async function getAnalytics(): Promise<Array<{ date: string; downloads: number }>> {
  const res = await apiFetch("analytics");
  return res.data || [];
}

export async function logDownload(payload: {
  itemId: string;
  buttonId?: string;
  buttonText?: string;
  version?: string;
}): Promise<void> {
  await apiFetch("log-download", payload);
}
