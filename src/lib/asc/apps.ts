import { ascFetch } from "./client";
import { cacheGet, cacheSet } from "@/lib/cache";

const APPS_TTL = 60 * 60 * 1000; // 1 hour

export interface AscApp {
  id: string;
  attributes: {
    name: string;
    bundleId: string;
    sku: string;
    primaryLocale: string;
    iconUrl: string | null;
  };
}

interface AscAppsResponse {
  data: Array<{
    id: string;
    attributes: {
      name: string;
      bundleId: string;
      sku: string;
      primaryLocale: string;
    };
  }>;
}

interface ItunesLookupResponse {
  results: Array<{
    trackId: number;
    artworkUrl512?: string;
    artworkUrl100?: string;
  }>;
}

/** Fetch app icons from Apple's public iTunes lookup API. */
async function fetchIconUrls(
  appIds: string[],
): Promise<Map<string, string>> {
  const icons = new Map<string, string>();
  if (appIds.length === 0) return icons;

  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${appIds.join(",")}&country=us`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!res.ok) return icons;

    const data: ItunesLookupResponse = await res.json();
    for (const result of data.results) {
      const url = result.artworkUrl512 ?? result.artworkUrl100;
      if (url) {
        icons.set(String(result.trackId), url);
      }
    }
  } catch {
    // Icon fetch is best-effort – don't fail the whole request
  }

  return icons;
}

export async function listApps(forceRefresh = false): Promise<AscApp[]> {
  if (!forceRefresh) {
    const cached = cacheGet<AscApp[]>("apps");
    // Treat cache as stale if iconUrl field is missing (schema upgrade)
    if (cached && cached[0]?.attributes?.iconUrl !== undefined) return cached;
  }

  const response = await ascFetch<AscAppsResponse>(
    "/v1/apps?fields[apps]=name,bundleId,sku,primaryLocale&limit=200",
  );

  const iconUrls = await fetchIconUrls(response.data.map((a) => a.id));

  const apps: AscApp[] = response.data.map((a) => ({
    id: a.id,
    attributes: {
      ...a.attributes,
      iconUrl: iconUrls.get(a.id) ?? null,
    },
  }));

  cacheSet("apps", apps, APPS_TTL);
  return apps;
}
