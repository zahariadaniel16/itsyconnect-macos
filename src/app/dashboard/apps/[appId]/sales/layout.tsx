"use client";

import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TABS = [
  { label: "Overview", segment: "" },
  { label: "Breakdown", segment: "/breakdown" },
  { label: "Transactions", segment: "/transactions" },
];

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appId } = useParams<{ appId: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const base = `/dashboard/apps/${appId}/sales`;
  const range = searchParams.get("range") || "30d";

  function buildHref(segment: string, newRange?: string) {
    const r = newRange || range;
    return `${base}${segment}${r !== "30d" ? `?range=${r}` : ""}`;
  }

  const currentSegment =
    TABS.find((t) =>
      t.segment === ""
        ? pathname === base
        : pathname.startsWith(`${base}${t.segment}`),
    )?.segment ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b">
        <nav className="-mb-px flex">
          {TABS.map((tab) => {
            const href = buildHref(tab.segment);
            const active =
              tab.segment === ""
                ? pathname === base
                : pathname.startsWith(`${base}${tab.segment}`);
            return (
              <Link
                key={tab.segment}
                href={href}
                className={cn(
                  "border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <Select
          value={range}
          onValueChange={(v) => {
            router.replace(buildHref(currentSegment, v));
          }}
        >
          <SelectTrigger className="mb-1 w-[140px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {children}
    </div>
  );
}
