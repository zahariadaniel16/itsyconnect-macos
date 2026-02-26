export interface AscBuild {
  id: string;
  attributes: {
    version: string; // build number
    uploadedDate: string;
    processingState: string;
    minOsVersion: string | null;
    iconAssetToken: { templateUrl: string } | null;
  };
}

export interface AscReviewDetail {
  id: string;
  attributes: {
    contactEmail: string | null;
    contactFirstName: string | null;
    contactLastName: string | null;
    contactPhone: string | null;
    demoAccountName: string | null;
    demoAccountPassword: string | null;
    demoAccountRequired: boolean;
    notes: string | null;
  };
}

export interface AscVersion {
  id: string;
  attributes: {
    versionString: string;
    appVersionState: string;
    appStoreState: string;
    platform: string;
    copyright: string | null;
    releaseType: string | null;
    earliestReleaseDate: string | null;
    downloadable: boolean;
    createdDate: string;
    reviewType: string | null;
  };
  build: AscBuild | null;
  reviewDetail: AscReviewDetail | null;
}

/** Get unique platforms from a list of versions. */
export function getVersionPlatforms(versions: AscVersion[]): string[] {
  return [...new Set(versions.map((v) => v.attributes.platform))];
}

/** Filter versions by platform. */
export function getVersionsByPlatform(
  versions: AscVersion[],
  platform: string,
): AscVersion[] {
  return versions.filter((v) => v.attributes.platform === platform);
}

const EDITABLE_STATES = new Set([
  "PREPARE_FOR_SUBMISSION",
  "REJECTED",
  "METADATA_REJECTED",
  "DEVELOPER_REJECTED",
]);

/** Resolve a version by ID or fall back to the first editable / latest. */
export function resolveVersion(
  versions: AscVersion[],
  versionId: string | null,
): AscVersion | undefined {
  if (versionId) {
    const found = versions.find((v) => v.id === versionId);
    if (found) return found;
  }
  return (
    versions.find((v) => EDITABLE_STATES.has(v.attributes.appVersionState)) ??
    versions[0]
  );
}
