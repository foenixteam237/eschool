export const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_JWT_STORAGE_KEY || "eschool_token";

export type UserRole = "ADMIN" | "ENSEIGNANT" | "PARENT" | "ELEVE";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  if (!token || typeof token !== "string") {
    return null;
  }

  if (token.startsWith("mock-")) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(decoded) as Record<string, unknown>;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    if (typeof parsed.exp === "number" && Date.now() >= parsed.exp * 1000) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
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
