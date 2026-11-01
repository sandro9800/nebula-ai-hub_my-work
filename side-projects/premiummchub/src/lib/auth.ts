// Admin authentication is verified by the server (POST /api/data?action=login).
// The browser only stores the signed, expiring session token it gets back, in
// sessionStorage (per tab). The server re-checks the token on every protected
// request, so the client-side check below is purely for UX (redirects).
const SESSION_KEY = "pmch_admin_session";

interface Session {
  user: string;
  token: string;
  expiresAt: number;
}

function readSession(): Session | null {
  if (typeof window === "undefined" || !window.sessionStorage) return null;
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.token === "string" &&
      typeof parsed.expiresAt === "number" &&
      parsed.expiresAt > Date.now()
    ) {
      return parsed as Session;
    }
  } catch {
    // fall through
  }
  window.sessionStorage.removeItem(SESSION_KEY);
  return null;
}

export function getToken(): string | null {
  return readSession()?.token ?? null;
}

export async function login(
  username: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/data?action=login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || typeof data.token !== "string") {
      return { ok: false, error: data.error || "Invalid credentials." };
    }
    if (typeof window !== "undefined" && window.sessionStorage) {
      const session: Session = {
        user: username,
        token: data.token,
        expiresAt: Number(data.expiresAt) || Date.now() + 8 * 60 * 60 * 1000,
      };
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the server." };
  }
}

export function logout(): void {
  if (typeof window !== "undefined" && window.sessionStorage) {
    window.sessionStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  return readSession() !== null;
}
