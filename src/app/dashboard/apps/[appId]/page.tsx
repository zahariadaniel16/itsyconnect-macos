"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MOCK_APPS,
  getAppVersions,
  getVersionBuild,
} from "@/lib/mock-data";
import {
  AppWindow,
  DownloadSimple,
  CurrencyDollar,
  Receipt,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DAILY_DOWNLOADS,
  DAILY_SESSIONS,
  CRASHES,
  TERRITORIES,
  formatDate,
} from "@/lib/mock-analytics";
import { DAILY_REVENUE } from "@/lib/mock-sales";

// ---------- Constants ----------

const STATE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  READY_FOR_SALE: "default",
  READY_FOR_DISTRIBUTION: "default",
  PREPARE_FOR_SUBMISSION: "secondary",
  WAITING_FOR_REVIEW: "outline",
  IN_REVIEW: "outline",
  ACCEPTED: "default",
  REJECTED: "destructive",
  METADATA_REJECTED: "destructive",
  DEVELOPER_REJECTED: "destructive",
};

const STATE_DOT_COLORS: Record<string, string> = {
  READY_FOR_SALE: "bg-green-500",
  READY_FOR_DISTRIBUTION: "bg-green-500",
  ACCEPTED: "bg-green-500",
  IN_REVIEW: "bg-blue-500",
  WAITING_FOR_REVIEW: "bg-amber-500",
  PREPARE_FOR_SUBMISSION: "bg-yellow-500",
  REJECTED: "bg-red-500",
  METADATA_REJECTED: "bg-red-500",
  DEVELOPER_REJECTED: "bg-red-500",
};

const PLATFORM_LABELS: Record<string, string> = {
  IOS: "iOS",
  MAC_OS: "macOS",
  TV_OS: "tvOS",
  VISION_OS: "visionOS",
};

function stateLabel(state: string): string {
  return state
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------- Chart configs ----------

const downloadsConfig = {
  firstTime: { label: "First-time", color: "var(--color-chart-1)" },
  redownload: { label: "Redownload", color: "var(--color-chart-2)" },
  update: { label: "Update", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

const revenueConfig = {
  proceeds: { label: "Proceeds", color: "var(--color-chart-1)" },
  sales: { label: "Customer price", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const territoryConfig = {
  downloads: { label: "Downloads", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

// ---------- KPI helper ----------

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon size={16} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

// ---------- Page ----------

export default function AppOverviewPage() {
  const { appId } = useParams<{ appId: string }>();
  const app = MOCK_APPS.find((a) => a.id === appId);
  const versions = getAppVersions(appId);

  if (!app) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        App not found
      </div>
    );
  }

  // Last 30 days of data
  const downloads = DAILY_DOWNLOADS.slice(-30);
  const revenue = DAILY_REVENUE.slice(-30);

  const totalDownloads = downloads.reduce(
    (s, d) => s + d.firstTime + d.redownload + d.update,
    0,
  );
  const totalFirstTime = downloads.reduce((s, d) => s + d.firstTime, 0);
  const totalProceeds = revenue.reduce((s, d) => s + d.proceeds, 0);
  const totalUnits = revenue.reduce((s, d) => s + d.units, 0);

  const totalDevices = DAILY_SESSIONS.slice(-30).reduce(
    (s, d) => s + d.uniqueDevices,
    0,
  );
  const crashDevices = CRASHES.reduce((s, c) => s + c.uniqueDevices, 0);
  const crashFreeRate =
    totalDevices > 0
      ? ((1 - crashDevices / totalDevices) * 100).toFixed(1)
      : "100";

  return (
    <div className="space-y-6">
      {/* App header */}
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-sm">
          <AppWindow size={28} weight="fill" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{app.name}</h1>
          <p className="text-sm text-muted-foreground">{app.bundleId}</p>
        </div>
      </div>

      {/* Version status cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {versions.map((version) => {
          const build = getVersionBuild(version.id);
          return (
            <Link
              key={version.id}
              href={`/dashboard/apps/${appId}/store-listing?version=${version.id}`}
              className="block"
            >
              <Card className="transition-colors hover:bg-accent/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {PLATFORM_LABELS[version.platform] ?? version.platform}
                  </CardTitle>
                  <Badge
                    variant={
                      STATE_VARIANTS[version.appVersionState] ?? "secondary"
                    }
                  >
                    {stateLabel(version.appVersionState)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono">
                      {version.versionString}
                    </span>
                    <span
                      className={`size-2 rounded-full ${STATE_DOT_COLORS[version.appVersionState] ?? "bg-muted-foreground"}`}
                    />
                  </div>
                  {build && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Build {build.buildNumber} &middot;{" "}
                      {new Date(build.uploadedDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Downloads"
          value={totalDownloads.toLocaleString()}
          subtitle={`${totalFirstTime.toLocaleString()} first-time`}
          icon={DownloadSimple}
        />
        <KpiCard
          title="Proceeds"
          value={`$${totalProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="Last 30 days"
          icon={CurrencyDollar}
        />
        <KpiCard
          title="Units sold"
          value={totalUnits.toLocaleString()}
          subtitle="Lifetime Pro IAP"
          icon={Receipt}
        />
        <KpiCard
          title="Crash-free rate"
          value={`${crashFreeRate}%`}
          subtitle={`${crashDevices} affected devices`}
          icon={ShieldCheck}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Downloads over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Downloads over time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={downloadsConfig}
              className="h-[240px] w-full"
            >
              <AreaChart data={downloads} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis tickLine={false} axisLine={false} width={40} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="update"
                  stackId="1"
                  fill="var(--color-update)"
                  stroke="var(--color-update)"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="redownload"
                  stackId="1"
                  fill="var(--color-redownload)"
                  stroke="var(--color-redownload)"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="firstTime"
                  stackId="1"
                  fill="var(--color-firstTime)"
                  stroke="var(--color-firstTime)"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Revenue over time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={revenueConfig}
              className="h-[240px] w-full"
            >
              <AreaChart data={revenue} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={(v) => `$${v}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                      formatter={(value, name) => (
                        <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                          <span className="text-muted-foreground">
                            {name === "proceeds" ? "Proceeds" : "Customer price"}
                          </span>
                          <span className="font-mono font-medium tabular-nums">
                            ${(value as number).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  fill="var(--color-sales)"
                  stroke="var(--color-sales)"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
                <Area
                  type="monotone"
                  dataKey="proceeds"
                  fill="var(--color-proceeds)"
                  stroke="var(--color-proceeds)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top territories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Top territories by downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={territoryConfig}
            className="h-[320px] w-full"
          >
            <BarChart
              data={TERRITORIES}
              layout="vertical"
              accessibilityLayer
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="territory"
                type="category"
                tickLine={false}
                axisLine={false}
                width={100}
                className="text-xs"
              />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="downloads"
                fill="var(--color-downloads)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
