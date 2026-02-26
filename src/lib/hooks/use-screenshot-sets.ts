"use client";

import { useEffect, useState, useCallback } from "react";
import type { AscScreenshotSet } from "@/lib/asc/screenshots";

interface UseScreenshotSetsResult {
  screenshotSets: AscScreenshotSet[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useScreenshotSets(
  appId: string,
  versionId: string,
  localizationId: string,
): UseScreenshotSetsResult {
  const [screenshotSets, setScreenshotSets] = useState<AscScreenshotSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!appId || !versionId || !localizationId) {
      setScreenshotSets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/apps/${appId}/versions/${versionId}/localizations/${localizationId}/screenshots`,
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load screenshots");
        setScreenshotSets([]);
        return;
      }

      const data = await res.json();
      setScreenshotSets(data.screenshotSets ?? []);
    } catch {
      setError("Network error");
      setScreenshotSets([]);
    } finally {
      setLoading(false);
    }
  }, [appId, versionId, localizationId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { screenshotSets, loading, error, refresh };
}
