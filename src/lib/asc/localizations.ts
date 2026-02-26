import { ascFetch } from "./client";
import { cacheGet, cacheSet } from "@/lib/cache";

const LOCALIZATIONS_TTL = 15 * 60 * 1000; // 15 min

export interface AscLocalization {
  id: string;
  attributes: {
    locale: string;
    description: string | null;
    keywords: string | null;
    marketingUrl: string | null;
    promotionalText: string | null;
    supportUrl: string | null;
    whatsNew: string | null;
  };
}

interface AscLocalizationsResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: AscLocalization["attributes"];
  }>;
}

export async function listLocalizations(
  versionId: string,
  forceRefresh = false,
): Promise<AscLocalization[]> {
  const cacheKey = `localizations:${versionId}`;

  if (!forceRefresh) {
    const cached = cacheGet<AscLocalization[]>(cacheKey);
    if (cached) return cached;
  }

  const response = await ascFetch<AscLocalizationsResponse>(
    `/v1/appStoreVersions/${versionId}/appStoreVersionLocalizations` +
      `?fields[appStoreVersionLocalizations]=locale,description,keywords,marketingUrl,promotionalText,supportUrl,whatsNew`,
  );

  const localizations: AscLocalization[] = response.data.map((l) => ({
    id: l.id,
    attributes: l.attributes,
  }));

  cacheSet(cacheKey, localizations, LOCALIZATIONS_TTL);
  return localizations;
}
