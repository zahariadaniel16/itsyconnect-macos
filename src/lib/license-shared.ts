/** License constants shared between server and client. */

export const FREE_LIMITS = { apps: 1, teams: 1 } as const;

export const CHECKOUT_URL = "https://itsyconnect.lemonsqueezy.com/checkout/buy/303396d1-9ac4-48ed-9da8-2c6de4800dfa";

/** Mask a license key to show only the first 8 characters. */
export function maskKey(key: string): string {
  if (key.length <= 8) return key;
  return key.slice(0, 8) + "...";
}
