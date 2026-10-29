export const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "eschool_token";

export type UserRole = "ADMIN" | "ENSEIGNANT" | "PARENT" | "ELEVE";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  const candidate = token.trim();
  if (!candidate || candidate.startsWith("mock-")) {
    return null;
  }

  const parts = candidate.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = globalThis.atob(padded);
    const parsed = JSON.parse(decoded) as Record<string, unknown>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const exp = parsed.exp;
    if (typeof exp === "number" && Date.now() >= exp * 1000) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function extractBearerToken(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (normalized.toLowerCase().startsWith("bearer ")) {
    const token = normalized.slice(7).trim();
    return token || null;
  }

  return normalized;
}

export function isJwtToken(token: string | undefined): boolean {
  return decodeJwtPayload(token ?? "") !== null;
}

export function getTokenRole(token: string | undefined): UserRole | null {
  const payload = decodeJwtPayload(token ?? "");
  if (!payload || typeof payload.role !== "string") {
    return null;
  }

  const role = payload.role.toUpperCase();
  if (["ADMIN", "ENSEIGNANT", "PARENT", "ELEVE"].includes(role)) {
    return role as UserRole;
  }

  return null;
}

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function hasPermissionForPath(pathname: string, token: string | undefined): boolean {
  const role = getTokenRole(token);

  if (!role) {
    return false;
  }

  if (pathname === "/" || pathname === "/login") {
    return true;
  }

  if (pathname.startsWith("/admin")) {
    return role === "ADMIN";
  }

  if (pathname.startsWith("/teacher")) {
    return role === "ENSEIGNANT";
  }

  if (pathname.startsWith("/parent")) {
    return role === "PARENT";
  }

  if (pathname.startsWith("/eleve")) {
    return role === "ELEVE";
  }

  return true;
}
