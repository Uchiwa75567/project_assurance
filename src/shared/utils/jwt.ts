export function parseJwtExp(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (typeof decoded.exp !== 'number') return null;
    return decoded.exp * 1000;
  } catch {
    return null;
  }
}

export function isExpired(timestampMs: number | null): boolean {
  if (!timestampMs) return true;
  return Date.now() >= timestampMs;
}
