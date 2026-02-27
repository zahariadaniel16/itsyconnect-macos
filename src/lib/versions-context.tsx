"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useParams } from "next/navigation";
import type { AscVersion } from "@/lib/asc/version-types";

interface VersionsContextValue {
  versions: AscVersion[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  /** Update a single version in-place without refetching. */
  updateVersion: (versionId: string, updater: (v: AscVersion) => AscVersion) => void;
}

const VersionsContext = createContext<VersionsContextValue>({
  versions: [],
  loading: true,
  error: null,
  refresh: async () => {},
  updateVersion: () => {},
});

export function VersionsProvider({ children }: { children: React.ReactNode }) {
  const { appId } = useParams<{ appId: string }>();
  const [versions, setVersions] = useState<AscVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!appId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/apps/${appId}/versions`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load versions");
        setVersions([]);
        return;
      }

      const data = await res.json();
      setVersions(data.versions ?? []);
    } catch {
      setError("Network error");
      setVersions([]);
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateVersion = useCallback(
    (versionId: string, updater: (v: AscVersion) => AscVersion) => {
      setVersions((prev) =>
        prev.map((v) => (v.id === versionId ? updater(v) : v)),
      );
    },
    [],
  );

  return (
    <VersionsContext.Provider value={{ versions, loading, error, refresh, updateVersion }}>
      {children}
    </VersionsContext.Provider>
  );
}

export function useVersions() {
  return useContext(VersionsContext);
}
