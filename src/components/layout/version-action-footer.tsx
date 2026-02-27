"use client";

import { useState, useMemo } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { CheckCircle, Circle } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVersions } from "@/lib/versions-context";
import { useSubmissionChecklist } from "@/lib/submission-checklist-context";
import { resolveVersion, type AscVersion } from "@/lib/asc/version-types";

const FOOTER_PAGES = new Set(["store-listing"]);

const SUBMIT_STATES = new Set(["PREPARE_FOR_SUBMISSION"]);
const RESUBMIT_STATES = new Set(["REJECTED", "METADATA_REJECTED", "DEVELOPER_REJECTED"]);
const CANCEL_STATES = new Set(["WAITING_FOR_REVIEW", "IN_REVIEW"]);

function getPageSegment(pathname: string): string {
  const parts = pathname.split("/");
  return parts[parts.length - 1] ?? "";
}

function SubmissionChecklist({ version }: { version: AscVersion }) {
  const { flags } = useSubmissionChecklist();

  const hasBuild = version.build !== null;
  const rd = version.reviewDetail?.attributes;
  const hasContact = !!(rd?.contactEmail && rd?.contactFirstName && rd?.contactLastName && rd?.contactPhone);

  const items = [
    { label: "Build", done: hasBuild },
    { label: "Description", done: flags.hasDescription },
    { label: "What's new", done: flags.hasWhatsNew },
    { label: "Keywords", done: flags.hasKeywords },
    { label: "Review contact", done: hasContact },
  ];

  return (
    <div className="flex items-center gap-3.5">
      {items.map((item) => (
        <span
          key={item.label}
          className={`flex items-center gap-1.5 text-xs ${item.done ? "text-muted-foreground" : "text-muted-foreground/60"}`}
        >
          {item.done
            ? <CheckCircle size={14} weight="fill" className="text-green-500/70" />
            : <Circle size={14} />}
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function VersionActionFooter() {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { versions, refresh } = useVersions();
  const [loading, setLoading] = useState(false);

  const pageSegment = getPageSegment(pathname);

  const version = useMemo(
    () => resolveVersion(versions, searchParams.get("version")),
    [versions, searchParams],
  );

  if (!appId || !FOOTER_PAGES.has(pageSegment) || !version) return null;

  const state = version.attributes.appVersionState;

  if (SUBMIT_STATES.has(state)) {
    return (
      <Footer left={<SubmissionChecklist version={version} />}>
        <Button disabled onClick={() => toast.info("Attach a build first")}>
          Submit for review
        </Button>
      </Footer>
    );
  }

  if (RESUBMIT_STATES.has(state)) {
    return (
      <Footer left={<SubmissionChecklist version={version} />}>
        <Button disabled onClick={() => toast.info("Attach a build first")}>
          Resubmit for review
        </Button>
      </Footer>
    );
  }

  if (CANCEL_STATES.has(state)) {
    return (
      <Footer>
        <Button
          variant="destructive"
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const res = await fetch(
                `/api/apps/${appId}/versions/${version.id}/cancel-submission`,
                { method: "POST" },
              );
              const data = await res.json();
              if (!res.ok) {
                toast.error(data.error ?? "Failed to cancel submission");
                return;
              }
              toast.success("Submission cancelled");
              await refresh();
            } catch {
              toast.error("Failed to cancel submission");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading && <Spinner />}
          Cancel submission
        </Button>
      </Footer>
    );
  }

  if (state === "PENDING_DEVELOPER_RELEASE") {
    return (
      <Footer>
        <Button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              const res = await fetch(
                `/api/apps/${appId}/versions/${version.id}/release-now`,
                { method: "POST" },
              );
              const data = await res.json();
              if (!res.ok) {
                toast.error(data.error ?? "Failed to release version");
                return;
              }
              toast.success("Version released");
              await refresh();
            } catch {
              toast.error("Failed to release version");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading && <Spinner />}
          Release now
        </Button>
      </Footer>
    );
  }

  return null;
}

function Footer({ left, children }: { left?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-t bg-sidebar px-6 py-3">
      <div>{left}</div>
      {children}
    </div>
  );
}
