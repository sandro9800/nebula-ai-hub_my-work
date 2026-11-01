export type ItemType = "client" | "mod" | "macro";

export interface DownloadButton {
  id: string;
  text: string;
  url: string;
  version: string;
  order: number;
  enabled: boolean;
  /** Optional direct loader (.jar / installer) URL for this button */
  loaderUrl?: string;
  /** Optional GUI button / shortcut launcher URL */
  guiButtonUrl?: string;
  /** Optional label for the GUI button (e.g. "Open GUI", "Launch") */
  guiButtonText?: string;
}

export interface DownloadStats {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
}

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  content: string;
  thumbnail: string;
  gallery: string[];
  tags: string[];
  author: string;
  version: string;
  changelog: string;
  downloads: DownloadStats;
  downloadButtons: DownloadButton[];
  featured: boolean;
  published: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  data: string; // base64 data URL
  size: number;
  type: string;
  uploadedAt: string;
}

export interface SiteSettings {
  siteName: string;
  logo: string; // SVG string or url
  discordUrl: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  uploadLimit: number;
}

export interface DownloadLog {
  id: string;
  itemId: string;
  itemName: string;
  itemType: ItemType;
  buttonId: string;
  buttonText: string;
  version: string;
  timestamp: string;
}

export interface AnalyticsEntry {
  date: string; // YYYY-MM-DD
  downloads: number;
}

export interface DataSnapshot {
  items: Item[];
  media: MediaItem[];
  settings: SiteSettings;
  downloads: DownloadLog[];
  analytics: AnalyticsEntry[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Premium MC Hub",
  logo: "",
  discordUrl: "https://discord.gg/premiummc",
  footerText: "Your premium source for Minecraft clients, mods & macros.",
  seoTitle: "Premium MC Hub — Minecraft Clients, Mods & Macros",
  seoDescription:
    "Discover and download the best Minecraft clients, mods and macros. Premium quality, curated by the community.",
  uploadLimit: 5,
};
