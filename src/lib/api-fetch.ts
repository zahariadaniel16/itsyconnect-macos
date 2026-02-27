/**
 * Client-side fetch wrapper with consistent error handling.
 *
 * On non-ok responses, extracts `body.error` and throws.
 * Returns parsed JSON (or `null` for 204 No Content).
 */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options);

  if (res.status === 204) return null as T;

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as Record<string, unknown>).error as string ?? `Request failed (${res.status})`,
    );
  }

  return res.json() as Promise<T>;
}
