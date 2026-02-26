"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DAILY_ENGAGEMENT,
  DAILY_DOWNLOADS_BY_SOURCE,
  DAILY_WEB_PREVIEW,
  DISCOVERY_SOURCES,
  TOP_REFERRERS,
  formatDate,
} from "@/lib/mock-analytics";

// ---------- Chart configs ----------

const sourceConfig = {
  search: { label: "App Store search", color: "var(--color-chart-1)" },
  browse: { label: "App Store browse", color: "var(--color-chart-2)" },
  webReferrer: { label: "Web referrer", color: "var(--color-chart-3)" },
  unavailable: { label: "Unavailable", color: "var(--color-chart-4)" },
  count: { label: "Downloads" },
} satisfies ChartConfig;

const engagementConfig = {
  impressions: { label: "Impressions", color: "var(--color-chart-1)" },
  pageViews: { label: "Page views", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const downloadSourceConfig = {
  search: { label: "Search", color: "var(--color-chart-1)" },
  browse: { label: "Browse", color: "var(--color-chart-2)" },
  webReferrer: { label: "Web referrer", color: "var(--color-chart-3)" },
  unavailable: { label: "Unavailable", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

const webPreviewConfig = {
  pageViews: { label: "Page views", color: "var(--color-chart-1)" },
  appStoreTaps: { label: "App Store taps", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

// ---------- Page ----------

export default function AcquisitionPage() {
  const searchParams = useSearchParams();
  const days = searchParams.get("range") === "7d" ? 7 : 30;

  const engagement = useMemo(() => DAILY_ENGAGEMENT.slice(-days), [days]);
  const downloadsBySource = useMemo(
    () => DAILY_DOWNLOADS_BY_SOURCE.slice(-days),
    [days],
  );
  const webPreview = useMemo(() => DAILY_WEB_PREVIEW.slice(-days), [days]);

  const totalSources = DISCOVERY_SOURCES.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-6">
      {/* Row 1: Source pie + engagement lines */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Discovery sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Discovery sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={sourceConfig}
              className="mx-auto h-[280px] w-full"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="source"
                      formatter={(value) => (
                        <span className="font-mono font-medium tabular-nums">
                          {(value as number).toLocaleString()} (
                          {(((value as number) / totalSources) * 100).toFixed(1)}
                          %)
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={DISCOVERY_SOURCES}
                  dataKey="count"
                  nameKey="source"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={2}
                >
                  {DISCOVERY_SOURCES.map((entry) => (
                    <Cell key={entry.source} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="source" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Impressions vs page views */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Impressions vs page views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={engagementConfig}
              className="h-[280px] w-full"
            >
              <LineChart data={engagement} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis tickLine={false} axisLine={false} width={50} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="var(--color-impressions)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="var(--color-pageViews)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Downloads by source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Downloads by source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={downloadSourceConfig}
            className="h-[280px] w-full"
          >
            <BarChart data={downloadsBySource} accessibilityLayer>
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
              <Bar
                dataKey="search"
                stackId="1"
                fill="var(--color-search)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="browse"
                stackId="1"
                fill="var(--color-browse)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="webReferrer"
                stackId="1"
                fill="var(--color-webReferrer)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="unavailable"
                stackId="1"
                fill="var(--color-unavailable)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Row 3: Web preview + top referrers */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Web preview engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Web preview engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={webPreviewConfig}
              className="h-[240px] w-full"
            >
              <BarChart data={webPreview} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                  interval="preserveStartEnd"
                />
                <YAxis tickLine={false} axisLine={false} width={30} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="pageViews"
                  fill="var(--color-pageViews)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="appStoreTaps"
                  fill="var(--color-appStoreTaps)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top referrers table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Top referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead className="text-right">Page views</TableHead>
                  <TableHead className="text-right">Downloads</TableHead>
                  <TableHead className="text-right">Conv. rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TOP_REFERRERS.map((row) => (
                  <TableRow key={row.referrer}>
                    <TableCell className="font-medium">
                      {row.referrer}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.pageViews.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.downloads.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {((row.downloads / row.pageViews) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
