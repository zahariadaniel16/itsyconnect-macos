import { ascFetch } from "./client";
import { cacheGet, cacheSet } from "@/lib/cache";

const SCREENSHOTS_TTL = 15 * 60 * 1000; // 15 min

export interface AscScreenshot {
  id: string;
  attributes: {
    fileSize: number;
    fileName: string;
    sourceFileChecksum: string | null;
    assetDeliveryState: { state: string } | null;
    assetToken: string | null;
  };
}

export interface AscScreenshotSet {
  id: string;
  attributes: {
    screenshotDisplayType: string;
  };
  screenshots: AscScreenshot[];
}

interface AscScreenshotSetsResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: AscScreenshotSet["attributes"];
    relationships: {
      appScreenshots?: {
        data: Array<{ id: string; type: string }>;
      };
    };
  }>;
  included?: Array<{
    id: string;
    type: string;
    attributes: Record<string, unknown>;
  }>;
}

export async function listScreenshotSets(
  localizationId: string,
  forceRefresh = false,
): Promise<AscScreenshotSet[]> {
  const cacheKey = `screenshotSets:${localizationId}`;

  if (!forceRefresh) {
    const cached = cacheGet<AscScreenshotSet[]>(cacheKey);
    if (cached) return cached;
  }

  const response = await ascFetch<AscScreenshotSetsResponse>(
    `/v1/appStoreVersionLocalizations/${localizationId}/appScreenshotSets` +
      `?include=appScreenshots` +
      `&fields[appScreenshotSets]=screenshotDisplayType` +
      `&fields[appScreenshots]=fileSize,fileName,sourceFileChecksum,assetDeliveryState,assetToken`,
  );

  const screenshotsById = new Map<string, AscScreenshot>();
  for (const item of response.included ?? []) {
    if (item.type === "appScreenshots") {
      screenshotsById.set(item.id, {
        id: item.id,
        attributes: item.attributes as unknown as AscScreenshot["attributes"],
      });
    }
  }

  const sets: AscScreenshotSet[] = response.data.map((s) => {
    const screenshotIds =
      s.relationships.appScreenshots?.data?.map((r) => r.id) ?? [];
    return {
      id: s.id,
      attributes: s.attributes,
      screenshots: screenshotIds
        .map((id) => screenshotsById.get(id))
        .filter((s): s is AscScreenshot => !!s),
    };
  });

  cacheSet(cacheKey, sets, SCREENSHOTS_TTL);
  return sets;
}
