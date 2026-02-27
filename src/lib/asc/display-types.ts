export const DISPLAY_TYPE_LABELS: Record<string, string> = {
  APP_IPHONE_67: 'iPhone 6.7"',
  APP_IPHONE_61: 'iPhone 6.1"',
  APP_IPHONE_65: 'iPhone 6.5"',
  APP_IPHONE_58: 'iPhone 5.8"',
  APP_IPHONE_55: 'iPhone 5.5"',
  APP_IPHONE_47: 'iPhone 4.7"',
  APP_IPHONE_40: 'iPhone 4"',
  APP_IPHONE_35: 'iPhone 3.5"',
  APP_IPAD_PRO_3GEN_129: 'iPad Pro 12.9"',
  APP_IPAD_PRO_3GEN_11: 'iPad Pro 11"',
  APP_IPAD_PRO_129: 'iPad Pro 12.9" (2nd)',
  APP_IPAD_105: 'iPad 10.5"',
  APP_IPAD_97: 'iPad 9.7"',
  APP_DESKTOP: "Mac",
  APP_APPLE_TV: "Apple TV",
  APP_APPLE_VISION_PRO: "Apple Vision Pro",
};

/** Consistent display order for screenshot sets. Types not listed sort to end alphabetically. */
export const DISPLAY_TYPE_ORDER: string[] = [
  "APP_IPHONE_67",
  "APP_IPHONE_61",
  "APP_IPHONE_65",
  "APP_IPHONE_58",
  "APP_IPHONE_55",
  "APP_IPHONE_47",
  "APP_IPHONE_40",
  "APP_IPHONE_35",
  "APP_IPAD_PRO_3GEN_129",
  "APP_IPAD_PRO_3GEN_11",
  "APP_IPAD_PRO_129",
  "APP_IPAD_105",
  "APP_IPAD_97",
  "APP_DESKTOP",
  "APP_APPLE_TV",
  "APP_APPLE_VISION_PRO",
];

export function displayTypeLabel(type: string): string {
  return DISPLAY_TYPE_LABELS[type] ?? type;
}

export function sortDisplayTypes(types: string[]): string[] {
  return [...types].sort((a, b) => {
    const ai = DISPLAY_TYPE_ORDER.indexOf(a);
    const bi = DISPLAY_TYPE_ORDER.indexOf(b);
    const aIdx = ai === -1 ? Infinity : ai;
    const bIdx = bi === -1 ? Infinity : bi;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.localeCompare(b);
  });
}

// --- Screenshot types (client-safe, no server deps) ---

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

/** Build an Apple CDN thumbnail URL from a screenshot's assetToken. */
export function screenshotImageUrl(assetToken: string, width = 300): string {
  return `https://is1-ssl.mzstatic.com/image/thumb/${assetToken}/${width}x0w.png`;
}
