"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DAILY_SESSIONS,
  DAILY_VERSION_SESSIONS,
  DAILY_INSTALLS_DELETES,
  DAILY_OPT_IN,
  CRASHES,
  formatDate,
} from "@/lib/mock-analytics";

// ---------- Chart configs ----------

const sessionsConfig = {
  sessions: { label: "Sessions", color: "var(--color-chart-1)" },
  uniqueDevices: { label: "Unique devices", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const durationConfig = {
  avgDuration: { label: "Avg duration (s)", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

const versionConfig = {
  v11: { label: "v1.1", color: "var(--color-chart-4)" },
  v12: { label: "v1.2", color: "var(--color-chart-3)" },
  v13: { label: "v1.3", color: "var(--color-chart-2)" },
  v20: { label: "v2.0", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

const installDeleteConfig = {
  installs: { label: "Installs", color: "var(--color-chart-1)" },
  deletes: { label: "Deletes", color: "var(--color-chart-5)" },
} satisfies ChartConfig;

const optInConfig = {
  downloading: { label: "Downloading", color: "var(--color-chart-2)" },
  optingIn: { label: "Opting in", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

// ---------- Page ----------

export default function UsagePage() {
  const searchParams = useSearchParams();
  const days = searchParams.get("range") === "7d" ? 7 : 30;

  const sessions = useMemo(() => DAILY_SESSIONS.slice(-days), [days]);
  const versionSessions = useMemo(
    () => DAILY_VERSION_SESSIONS.slice(-days),
    [days],
  );
  const installsDeletes = useMemo(
    () => DAILY_INSTALLS_DELETES.slice(-days),
    [days],
  );
  const optIn = useMemo(() => DAILY_OPT_IN.slice(-days), [days]);

  const totalCrashes = CRASHES.reduce((s, c) => s + c.crashes, 0);

  // Opt-in rate
  const totalDownloading = optIn.reduce((s, d) => s + d.downloading, 0);
  const totalOptingIn = optIn.reduce((s, d) => s + d.optingIn, 0);
  const optInRate =
    totalDownloading > 0
      ? ((totalOptingIn / totalDownloading) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Row 1: Sessions + duration */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Sessions and unique devices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Sessions and devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={sessionsConfig}
              className="h-[280px] w-full"
            >
              <LineChart data={sessions} accessibilityLayer>
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
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="uniqueDevices"
                  stroke="var(--color-uniqueDevices)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Average session duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Average session duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={durationConfig}
              className="h-[280px] w-full"
            >
              <AreaChart data={sessions} accessibilityLayer>
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
                  width={35}
                  tickFormatter={(v) => `${v}s`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v) => formatDate(v as string)}
                      formatter={(value) => (
                        <span className="font-mono font-medium tabular-nums">
                          {value}s
                        </span>
                      )}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="avgDuration"
                  fill="var(--color-avgDuration)"
                  stroke="var(--color-avgDuration)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Version adoption */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Sessions by app version
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={versionConfig}
            className="h-[280px] w-full"
          >
            <AreaChart data={versionSessions} accessibilityLayer>
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
                dataKey="v11"
                stackId="1"
                fill="var(--color-v11)"
                stroke="var(--color-v11)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="v12"
                stackId="1"
                fill="var(--color-v12)"
                stroke="var(--color-v12)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="v13"
                stackId="1"
                fill="var(--color-v13)"
                stroke="var(--color-v13)"
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="v20"
                stackId="1"
                fill="var(--color-v20)"
                stroke="var(--color-v20)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Row 3: Installs vs deletes + opt-in */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Installs vs deletes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Installs vs deletes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={installDeleteConfig}
              className="h-[240px] w-full"
            >
              <BarChart data={installsDeletes} accessibilityLayer>
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
                  dataKey="installs"
                  fill="var(--color-installs)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="deletes"
                  fill="var(--color-deletes)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Opt-in rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Analytics opt-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">
                {optInRate}%
              </span>
              <span className="text-sm text-muted-foreground">opt-in rate</span>
            </div>
            <ChartContainer
              config={optInConfig}
              className="h-[192px] w-full"
            >
              <BarChart data={optIn} accessibilityLayer>
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
                  dataKey="downloading"
                  fill="var(--color-downloading)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="optingIn"
                  fill="var(--color-optingIn)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Crashes table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Crashes by version
          </CardTitle>
          <Badge variant="outline" className="text-xs tabular-nums">
            {totalCrashes} total
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead className="text-right">Crashes</TableHead>
                <TableHead className="text-right">Affected devices</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRASHES.map((row) => (
                <TableRow key={`${row.version}-${row.platform}`}>
                  <TableCell className="font-medium font-mono">
                    {row.version}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.platform}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.crashes}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.uniqueDevices}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
