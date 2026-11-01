import { Redis } from "@upstash/redis";
import crypto from "node:crypto";

const KEYS = {
  items: "pmch:items",
  media: "pmch:media",
  settings: "pmch:settings",
  downloads: "pmch:downloads",
  analytics: "pmch:analytics",
  initialized: "pmch:initialized",
};

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Missing Upstash Redis environment variables (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN).",
    );
  }
  return new Redis({ url, token });
}

const DEFAULT_SEED = {
  settings: {
    siteName: "Premium MC Hub",
    logo: "",
    discordUrl: "https://discord.gg/premiummc",
    footerText: "Your premium source for Minecraft clients, mods & macros.",
    seoTitle: "Premium MC Hub — Minecraft Clients, Mods & Macros",
    seoDescription:
      "Discover and download the best Minecraft clients, mods and macros. Premium quality, curated by the community.",
    uploadLimit: 5,
  },
  items: [
    {
      id: "item_lunar_client",
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
        "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=1200&q=80",
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
          loaderUrl: "https://launcher.lunarclient.com/Lunar%20Client.exe",
          guiButtonUrl: "lunarclient://launch",
          guiButtonText: "Launch Lunar",
        },
        {
          id: "b2",
          text: "Download for macOS",
          url: "https://www.lunarclient.com/",
          version: "1.21.4",
          order: 1,
          enabled: true,
          loaderUrl: "https://launcher.lunarclient.com/Lunar%20Client.dmg",
        },
      ],
      featured: true,
      published: true,
      archived: false,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-12-01T12:00:00.000Z",
    },
    {
      id: "item_badlion_client",
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
        "https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=1200&q=80",
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
      id: "item_futurium_client",
      type: "client",
      name: "Futurium Client",
      description:
        "Premium cracked-supporting client with a sleek UI, FPS boost and Hypixel-friendly PvP features.",
      content:
        "Futurium is a paid PvP client with Hypixel-bypass features, custom crosshair overlays, and a gorgeous dark UI. Includes built-in keystrokes, CPS display and FPS monitor.",
      thumbnail:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80",
        "https://images.unsplash.com/photo-1541562232579-512a21360020?w=1200&q=80",
      ],
      tags: ["pvp", "premium", "hypixel"],
      author: "Futurium Team",
      version: "2.7.0",
      changelog: "• New Hypixel bypass\n• UI polish\n• Reduced CPU usage by 18%",
      downloads: { total: 3210, daily: 89, weekly: 412, monthly: 1240 },
      downloadButtons: [
        {
          id: "b1",
          text: "Get Premium",
          url: "https://futurium.io/",
          version: "2.7.0",
          order: 0,
          enabled: true,
        },
      ],
      featured: false,
      published: true,
      archived: false,
      createdAt: "2024-04-05T10:00:00.000Z",
      updatedAt: "2024-10-30T12:00:00.000Z",
    },
    {
      id: "item_keystrokes_mod",
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
          loaderUrl: "https://cdn.modrinth.com/data/keystrokes-3.4.0.jar",
          guiButtonUrl: "https://modrinth.com/mod/keystrokes",
          guiButtonText: "View on Modrinth",
        },
        {
          id: "b2",
          text: "Download (Forge)",
          url: "https://curseforge.com/",
          version: "3.4.0",
          order: 1,
          enabled: true,
          loaderUrl: "https://edge.forgecdn.net/files/keystrokes-3.4.0.jar",
        },
      ],
      featured: true,
      published: true,
      archived: false,
      createdAt: "2024-03-12T10:00:00.000Z",
      updatedAt: "2024-11-10T12:00:00.000Z",
    },
    {
      id: "item_optifine_hd",
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
      id: "item_sodium_mod",
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
      id: "item_autoclick_macro",
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
    {
      id: "item_bedwars_macro",
      type: "macro",
      name: "BedWars Helper",
      description:
        "Scripted macro pack for BedWars — auto-bridge, fireball toss, and quick-buy keybinds.",
      content:
        "BedWars Helper is a collection of Python / AHK scripts that automate common BedWars actions like bridging, fireball tossing, and quick-buy presses. Works on most popular clients.",
      thumbnail:
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=1200&q=80",
      ],
      tags: ["macro", "bedwars", "pvp"],
      author: "HelperScripts",
      version: "1.8.0",
      changelog: "• Faster bridging\n• New fireball modes",
      downloads: { total: 2210, daily: 48, weekly: 290, monthly: 820 },
      downloadButtons: [
        {
          id: "b1",
          text: "Download Pack",
          url: "https://example.com/bedwars-helper",
          version: "1.8.0",
          order: 0,
          enabled: true,
        },
      ],
      featured: false,
      published: true,
      archived: false,
      createdAt: "2024-06-10T10:00:00.000Z",
      updatedAt: "2024-10-15T12:00:00.000Z",
    },
  ],
  media: [],
  downloads: [],
  analytics: [],
};

async function ensureSeed(redis) {
  const initialized = await redis.get(KEYS.initialized);
  if (initialized) return;
  await redis.set(KEYS.items, DEFAULT_SEED.items);
  await redis.set(KEYS.media, DEFAULT_SEED.media);
  await redis.set(KEYS.settings, DEFAULT_SEED.settings);
  await redis.set(KEYS.downloads, DEFAULT_SEED.downloads);
  await redis.set(KEYS.analytics, DEFAULT_SEED.analytics);
  await redis.set(KEYS.initialized, true);
}

/**
 * Defensive normalizer — applied to every item returned by the API.
 * Fills in missing fields so the admin table and item detail page
 * never crash on legacy / partial data. Pure data, no side effects.
 */
function normalizeItem(it) {
  if (!it || typeof it !== "object") return it;
  const buttons = Array.isArray(it.downloadButtons) ? it.downloadButtons : [];
  return {
    id: it.id || "",
    type: it.type || "client",
    name: it.name || "",
    description: it.description || "",
    content: it.content || "",
    thumbnail: it.thumbnail || "",
    gallery: Array.isArray(it.gallery) ? it.gallery : [],
    tags: Array.isArray(it.tags) ? it.tags : [],
    author: it.author || "",
    version: it.version || "1.0.0",
    changelog: it.changelog || "",
    downloads: it.downloads && typeof it.downloads === "object"
      ? {
          total: Number(it.downloads.total) || 0,
          daily: Number(it.downloads.daily) || 0,
          weekly: Number(it.downloads.weekly) || 0,
          monthly: Number(it.downloads.monthly) || 0,
        }
      : { total: 0, daily: 0, weekly: 0, monthly: 0 },
    downloadButtons: buttons.map((b) => ({
      id: b.id || "",
      text: b.text || "Download",
      url: b.url || "",
      version: b.version || it.version || "1.0.0",
      order: typeof b.order === "number" ? b.order : 0,
      enabled: b.enabled !== false,
      loaderUrl: b.loaderUrl || "",
      guiButtonUrl: b.guiButtonUrl || "",
      guiButtonText: b.guiButtonText || "",
    })),
    featured: !!it.featured,
    published: !!it.published,
    archived: !!it.archived,
    createdAt: it.createdAt || new Date(0).toISOString(),
    updatedAt: it.updatedAt || new Date(0).toISOString(),
  };
}

async function readAll(redis) {
  const [items, media, settings, downloads, analytics] = await Promise.all([
    redis.get(KEYS.items),
    redis.get(KEYS.media),
    redis.get(KEYS.settings),
    redis.get(KEYS.downloads),
    redis.get(KEYS.analytics),
  ]);
  const rawItems = Array.isArray(items) ? items : [];
  return {
    items: rawItems.map(normalizeItem),
    media: media || [],
    settings: settings || DEFAULT_SEED.settings,
    downloads: downloads || [],
    analytics: analytics || [],
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Server-side admin authentication
// Credentials and the signing secret only ever live in server environment
// variables (never in the browser bundle). ADMIN_* are preferred; the legacy
// VITE_ADMIN_* names are read as a fallback so existing deployments keep
// working until the variables are renamed.
// ---------------------------------------------------------------------------
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function adminCreds() {
  return {
    user: process.env.ADMIN_USERNAME || process.env.VITE_ADMIN_USERNAME || "",
    pass: process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || "",
  };
}

// The password is part of the key, so changing it invalidates every session.
function signingKey() {
  const { pass } = adminCreds();
  const secret =
    process.env.SESSION_SECRET || process.env.UPSTASH_REDIS_REST_TOKEN || "";
  return pass && secret ? `${secret}:${pass}` : "";
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function signToken(user) {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ u: user, exp: expiresAt })).toString(
    "base64url",
  );
  const sig = crypto
    .createHmac("sha256", signingKey())
    .update(payload)
    .digest("base64url");
  return { token: `${payload}.${sig}`, expiresAt };
}

function verifyToken(token) {
  const key = signingKey();
  if (!key || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", key)
    .update(payload)
    .digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

function isAdmin(req) {
  const header = (req.headers["authorization"] || "").toString();
  return header.startsWith("Bearer ") && verifyToken(header.slice(7));
}

function clientIp(req) {
  const xff = (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim();
  const ip = xff || (req.socket && req.socket.remoteAddress) || "unknown";
  return ip.replace(/[^0-9a-fA-F:.]/g, "").slice(0, 45) || "unknown";
}

// Fixed-window counter in Redis. Returns true while under the limit.
async function withinLimit(redis, key, limit, windowSec) {
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, windowSec);
  return n <= limit;
}

function isPublicItem(it) {
  return !!it && !!it.published && !it.archived;
}

// What anonymous visitors may see: published items only, no admin analytics.
function publicView(data) {
  return {
    ...data,
    items: data.items.filter(isPublicItem),
    downloads: [],
    analytics: [],
  };
}

function short(v) {
  return String(v == null ? "" : v).slice(0, 100);
}

function unauthorized(res) {
  return res.status(401).json({ error: "Unauthorized" });
}

export default async function handler(req, res) {
  // Same-origin only: the frontend is served from the same Vercel project,
  // so no CORS headers are sent.
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = (req.query.action || "").toString();

  let redis;
  try {
    redis = getRedis();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const admin = isAdmin(req);

    if (req.method === "GET") {
      if (action === "all") {
        await ensureSeed(redis);
        const data = await readAll(redis);
        return res
          .status(200)
          .json({ ok: true, data: admin ? data : publicView(data) });
      }
      if (action === "items") {
        const items = ((await redis.get(KEYS.items)) || []).map(normalizeItem);
        return res
          .status(200)
          .json({ ok: true, data: admin ? items : items.filter(isPublicItem) });
      }
      if (action === "media") {
        const media = (await redis.get(KEYS.media)) || [];
        return res.status(200).json({ ok: true, data: media });
      }
      if (action === "settings") {
        const settings = (await redis.get(KEYS.settings)) || DEFAULT_SEED.settings;
        return res.status(200).json({ ok: true, data: settings });
      }
      if (action === "downloads") {
        if (!admin) return unauthorized(res);
        const downloads = (await redis.get(KEYS.downloads)) || [];
        return res.status(200).json({ ok: true, data: downloads });
      }
      if (action === "analytics") {
        if (!admin) return unauthorized(res);
        const analytics = (await redis.get(KEYS.analytics)) || [];
        return res.status(200).json({ ok: true, data: analytics });
      }
      return res.status(400).json({ error: "Unknown GET action" });
    }

    if (req.method === "POST") {
      const body = req.body && typeof req.body === "object" ? req.body : {};
      const ip = clientIp(req);

      // ----- public actions -----
      if (action === "login") {
        const { user, pass } = adminCreds();
        if (!user || !pass || !signingKey()) {
          return res
            .status(503)
            .json({ error: "Admin login is not configured on the server." });
        }
        const attemptsKey = `pmch:login:${ip}`;
        if (!(await withinLimit(redis, attemptsKey, 10, 15 * 60))) {
          return res
            .status(429)
            .json({ error: "Too many attempts. Try again in 15 minutes." });
        }
        const okUser = safeEqual(String(body.username ?? ""), user);
        const okPass = safeEqual(String(body.password ?? ""), pass);
        if (!(okUser && okPass)) {
          return res.status(401).json({ error: "Invalid credentials." });
        }
        await redis.del(attemptsKey);
        const { token, expiresAt } = signToken(user);
        return res.status(200).json({ ok: true, token, expiresAt });
      }
      if (action === "init") {
        const initialized = await redis.get(KEYS.initialized);
        if (initialized) {
          return res.status(200).json({ ok: true, seeded: false });
        }
        await ensureSeed(redis);
        return res.status(200).json({ ok: true, seeded: true });
      }
      if (action === "log-download") {
        if (!(await withinLimit(redis, `pmch:dl:${ip}`, 30, 60))) {
          return res.status(429).json({ error: "Too many requests" });
        }
        const itemId = body.itemId;
        if (typeof itemId !== "string" || !itemId || itemId.length > 100) {
          return res.status(400).json({ error: "itemId required" });
        }
        const [items, downloads, analytics] = await Promise.all([
          redis.get(KEYS.items),
          redis.get(KEYS.downloads),
          redis.get(KEYS.analytics),
        ]);
        const itemsArr = items || [];
        const downloadsArr = downloads || [];
        const analyticsArr = analytics || [];
        const item = itemsArr.find((i) => i.id === itemId);
        if (!item || !isPublicItem(item)) {
          return res.status(404).json({ error: "Item not found" });
        }
        item.downloads = item.downloads || {
          total: 0,
          daily: 0,
          weekly: 0,
          monthly: 0,
        };
        item.downloads.total += 1;
        item.downloads.daily += 1;
        item.downloads.weekly += 1;
        item.downloads.monthly += 1;
        const log = {
          id: "log_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
          itemId: item.id,
          itemName: item.name,
          itemType: item.type,
          buttonId: short(body.buttonId),
          buttonText: short(body.buttonText),
          version: short(body.version) || item.version || "",
          timestamp: new Date().toISOString(),
        };
        downloadsArr.unshift(log);
        if (downloadsArr.length > 500) downloadsArr.length = 500;

        const today = todayKey();
        let day = analyticsArr.find((a) => a.date === today);
        if (!day) {
          day = { date: today, downloads: 0 };
          analyticsArr.push(day);
          analyticsArr.sort((a, b) => a.date.localeCompare(b.date));
          if (analyticsArr.length > 365) analyticsArr.shift();
        }
        day.downloads += 1;

        await Promise.all([
          redis.set(KEYS.items, itemsArr),
          redis.set(KEYS.downloads, downloadsArr),
          redis.set(KEYS.analytics, analyticsArr),
        ]);
        return res.status(200).json({ ok: true });
      }

      // ----- everything below requires a valid admin session -----
      if (!admin) return unauthorized(res);

      if (action === "reset") {
        await redis.del(
          KEYS.items,
          KEYS.media,
          KEYS.settings,
          KEYS.downloads,
          KEYS.analytics,
          KEYS.initialized,
        );
        return res.status(200).json({ ok: true });
      }
      if (action === "items" || action === "media" || action === "downloads" || action === "analytics") {
        if (!Array.isArray(body.data)) {
          return res.status(400).json({ error: "data must be an array" });
        }
        await redis.set(KEYS[action], body.data);
        return res.status(200).json({ ok: true });
      }
      if (action === "settings") {
        if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
          return res.status(400).json({ error: "data must be an object" });
        }
        await redis.set(KEYS.settings, body.data);
        return res.status(200).json({ ok: true });
      }
      return res.status(400).json({ error: "Unknown POST action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
