import type { DataSnapshot, Item } from "@/types";
import { DEFAULT_SETTINGS } from "@/types";

const SEED: DataSnapshot = {
  settings: DEFAULT_SETTINGS,
  media: [],
  downloads: [],
  analytics: [],
  items: [
    {
      id: "fallback_lunar",
      type: "client",
      name: "Lunar Client",
      description:
        "The most popular PvP client for Minecraft, with built-in mods, OptiFine support and an in-game cosmetics store.",
      content:
        "Lunar Client is a free all-in-one modpack available for Minecraft 1.7 through 1.21. It comes bundled with FPS-boosting mods, PvP enhancements, an FPS display, an in-game store, and a customizable HUD. Lunar requires no installation beyond its official launcher.",
      thumbnail:
        "https://images.unsplash.com/photo-1614294149013-7eae30a7cd5e?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1614294149013-7eae30a7cd5e?w=1200&q=80",
        "https://images.unsplash.com/photo-1541562232579-512a21360020?w=1200&q=80",
      ],
      tags: ["pvp", "all-in-one", "free", "popular"],
      author: "Moonsworth",
      version: "1.21.4",
      changelog:
        "• Added new cosmetic capes\n• Fixed OptiFine compatibility\n• Performance improvements on macOS",
      downloads: { total: 15420, daily: 312, weekly: 1820, monthly: 6420 },
      downloadButtons: [
        {
          id: "b1",
          text: "Download for Windows",
          url: "https://www.lunarclient.com/",
          version: "1.21.4",
          order: 0,
          enabled: true,
        },
        {
          id: "b2",
          text: "Download for macOS",
          url: "https://www.lunarclient.com/",
          version: "1.21.4",
          order: 1,
          enabled: true,
        },
      ],
      featured: true,
      published: true,
      archived: false,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-12-01T12:00:00.000Z",
    },
    {
      id: "fallback_badlion",
      type: "client",
      name: "Badlion Client",
      description:
        "Free PvP client with OptiFine integration, mods manager, and tournament-grade FPS performance.",
      content:
        "Badlion Client is one of the longest-running PvP clients for Minecraft. It bundles a smart mod manager, an OptiFine integration layer, FPS boost technology and a sleek dark UI. Trusted by tournament players worldwide.",
      thumbnail:
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80",
      ],
      tags: ["pvp", "free", "tournament", "optifine"],
      author: "Badlion",
      version: "4.2.1",
      changelog:
        "• New FPS boost mode\n• Better mod compatibility\n• Updated anti-cheat hooks",
      downloads: { total: 8930, daily: 142, weekly: 720, monthly: 2980 },
      downloadButtons: [
        {
          id: "b1",
          text: "Download for Windows",
          url: "https://client.badlion.net/",
          version: "4.2.1",
          order: 0,
          enabled: true,
        },
      ],
      featured: true,
      published: true,
      archived: false,
      createdAt: "2024-02-10T10:00:00.000Z",
      updatedAt: "2024-11-20T12:00:00.000Z",
    },
    {
      id: "fallback_keystrokes",
      type: "mod",
      name: "Keystrokes Display",
      description:
        "Clean, customizable on-screen keystrokes & CPS mod — perfect for recording PvP clips.",
      content:
        "A lightweight Forge / Fabric mod that displays W A S D, mouse buttons, and CPS counters on screen. Highly customizable colors, position, and keybind scheme. Works in any modpack.",
      thumbnail:
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=1200&q=80",
      ],
      tags: ["utility", "pvp", "fabric", "forge"],
      author: "AshtonDev",
      version: "3.4.0",
      changelog:
        "• Added per-key colors\n• New CPS panel\n• Fabric 1.21 support",
      downloads: { total: 12080, daily: 245, weekly: 1400, monthly: 4980 },
      downloadButtons: [
        {
          id: "b1",
          text: "Download (Fabric)",
          url: "https://modrinth.com/",
          version: "3.4.0",
          order: 0,
          enabled: true,
        },
        {
          id: "b2",
          text: "Download (Forge)",
          url: "https://curseforge.com/",
          version: "3.4.0",
          order: 1,
          enabled: true,
        },
      ],
      featured: true,
      published: true,
      archived: false,
      createdAt: "2024-03-12T10:00:00.000Z",
      updatedAt: "2024-11-10T12:00:00.000Z",
    },
    {
      id: "fallback_optifine",
      type: "mod",
      name: "OptiFine HD",
      description:
        "The legendary performance and shader mod for Minecraft. Add shaders, dynamic lights and HD textures.",
      content:
        "OptiFine HD adds support for shaders, dynamic lights, connected textures, custom skies, and a long list of performance / graphics options. Available for Java Edition via official installer.",
      thumbnail:
        "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=1200&q=80",
      ],
      tags: ["performance", "shaders", "essential"],
      author: "sp614x",
      version: "1.21.4_HD_U_J1",
      changelog: "• 1.21.4 support\n• Improved shader compatibility",
      downloads: { total: 24630, daily: 488, weekly: 2810, monthly: 8920 },
      downloadButtons: [
        {
          id: "b1",
          text: "Download Installer",
          url: "https://optifine.net/downloads",
          version: "1.21.4",
          order: 0,
          enabled: true,
        },
      ],
      featured: true,
      published: true,
      archived: false,
      createdAt: "2024-01-05T10:00:00.000Z",
      updatedAt: "2024-12-15T12:00:00.000Z",
    },
    {
      id: "fallback_sodium",
      type: "mod",
      name: "Sodium",
      description:
        "The modern, open-source rendering engine replacement for Minecraft. Massive FPS gains on every system.",
      content:
        "Sodium is the Fabric mod that rewrites Minecraft's rendering engine from scratch, delivering huge FPS improvements and fixing many vanilla rendering bugs. Pairs with Iris for shader support.",
      thumbnail:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
      ],
      tags: ["performance", "fabric", "open-source"],
      author: "JellySquid",
      version: "0.6.5",
      changelog: "• 1.21.4 support\n• Major memory savings",
      downloads: { total: 18920, daily: 376, weekly: 2110, monthly: 7110 },
      downloadButtons: [
        {
          id: "b1",
          text: "Modrinth",
          url: "https://modrinth.com/mod/sodium",
          version: "0.6.5",
          order: 0,
          enabled: true,
        },
      ],
      featured: false,
      published: true,
      archived: false,
      createdAt: "2024-01-22T10:00:00.000Z",
      updatedAt: "2024-11-30T12:00:00.000Z",
    },
    {
      id: "fallback_autoclick",
      type: "macro",
      name: "Apex Auto-Clicker",
      description:
        "Configurable auto-clicker macro with smart humanization patterns. Safe for most servers.",
      content:
        "Apex is a lightweight auto-clicker that simulates human-like click patterns. Includes jitter control, configurable CPS, hotkey activation, and per-game profiles. Disclaimer: use at your own risk on multiplayer servers.",
      thumbnail:
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1200&q=80",
      ],
      tags: ["macro", "autoclicker", "utility"],
      author: "ApexTools",
      version: "5.0.2",
      changelog: "• New jitter algorithm\n• Profiles per game",
      downloads: { total: 5420, daily: 110, weekly: 615, monthly: 1980 },
      downloadButtons: [
        {
          id: "b1",
          text: "Download (Windows)",
          url: "https://example.com/apex-windows",
          version: "5.0.2",
          order: 0,
          enabled: true,
        },
      ],
      featured: false,
      published: true,
      archived: false,
      createdAt: "2024-05-01T10:00:00.000Z",
      updatedAt: "2024-11-05T12:00:00.000Z",
    },
  ] as Item[],
};

export function getLocalFallback(): DataSnapshot {
  return JSON.parse(JSON.stringify(SEED)) as DataSnapshot;
}
