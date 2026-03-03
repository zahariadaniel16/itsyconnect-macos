"use client";

import { useAnalytics } from "@/lib/analytics-context";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export function AnalyticsStateGuard({ children }: { children: React.ReactNode }) {
  const { data, loading, error, pending } = useAnalytics();

  if (loading && !data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (pending && !data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <Spinner className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Fetching analytics data – this may take a moment on first load
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return <>{children}</>;
}
