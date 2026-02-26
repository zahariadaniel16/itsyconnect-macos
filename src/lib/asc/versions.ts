import { ascFetch } from "./client";
import { cacheGet, cacheSet } from "@/lib/cache";
import type { AscBuild, AscReviewDetail, AscVersion } from "./version-types";

export type { AscBuild, AscReviewDetail, AscVersion };
export { getVersionPlatforms, getVersionsByPlatform, resolveVersion } from "./version-types";

const VERSIONS_TTL = 15 * 60 * 1000; // 15 min

interface AscVersionsResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: AscVersion["attributes"];
    relationships?: {
      build?: { data: { id: string; type: string } | null };
      appStoreReviewDetail?: { data: { id: string; type: string } | null };
    };
  }>;
  included?: Array<{
    id: string;
    type: string;
    attributes: Record<string, unknown>;
  }>;
}

function resolveIncluded(
  response: AscVersionsResponse,
): AscVersion[] {
  const builds = new Map<string, AscBuild>();
  const reviewDetails = new Map<string, AscReviewDetail>();

  for (const item of response.included ?? []) {
    if (item.type === "builds") {
      builds.set(item.id, {
        id: item.id,
        attributes: item.attributes as unknown as AscBuild["attributes"],
      });
    } else if (item.type === "appStoreReviewDetails") {
      reviewDetails.set(item.id, {
        id: item.id,
        attributes: item.attributes as unknown as AscReviewDetail["attributes"],
      });
    }
  }

  return response.data.map((v) => ({
    id: v.id,
    attributes: v.attributes,
    build: builds.get(v.relationships?.build?.data?.id ?? "") ?? null,
    reviewDetail:
      reviewDetails.get(v.relationships?.appStoreReviewDetail?.data?.id ?? "") ??
      null,
  }));
}

export async function listVersions(
  appId: string,
  forceRefresh = false,
): Promise<AscVersion[]> {
  const cacheKey = `versions:${appId}`;

  if (!forceRefresh) {
    const cached = cacheGet<AscVersion[]>(cacheKey);
    if (cached) return cached;
  }

  const response = await ascFetch<AscVersionsResponse>(
    `/v1/apps/${appId}/appStoreVersions` +
      `?fields[appStoreVersions]=versionString,appVersionState,appStoreState,platform,copyright,releaseType,earliestReleaseDate,downloadable,createdDate` +
      `&include=build,appStoreReviewDetail` +
      `&fields[builds]=version,uploadedDate,processingState,minOsVersion,iconAssetToken` +
      `&fields[appStoreReviewDetails]=contactEmail,contactFirstName,contactLastName,contactPhone,demoAccountName,demoAccountPassword,demoAccountRequired,notes`,
  );

  const versions = resolveIncluded(response);
  cacheSet(cacheKey, versions, VERSIONS_TTL);
  return versions;
}
