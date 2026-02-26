"use client";

import { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CurrencyDollar,
  Receipt,
  ArrowsClockwise,
  TrendUp,
} from "@phosphor-icons/react";
import {
  DAILY_REVENUE,
  REVENUE_BY_TERRITORY,
  REVENUE_BY_PRODUCT,
  TRANSACTION_TYPES,
  PAYMENT_METHODS,
  MONTHLY_SUMMARY,
  RECENT_TRANSACTIONS,
  PRODUCT_TYPE_LABELS,
  formatDate,
} from "@/lib/mock-sales";

// ---------- Chart configs ----------

const revenueConfig = {
  proceeds: { label: "Proceeds", color: "var(--color-chart-1)" },
  sales: { label: "Customer price", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const territoryConfig = {
  proceeds: { label: "Proceeds (USD)", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

const txTypeConfig = {
  newPurchase: { label: "New purchase", color: "var(--color-chart-1)" },
  restored: { label: "Restored", color: "var(--color-chart-2)" },
  refund: { label: "Refund", color: "var(--color-chart-5)" },
  count: { label: "Transactions" },
} satisfies ChartConfig;

const paymentConfig = {
  visa: { label: "Visa", color: "var(--color-chart-1)" },
  mastercard: { label: "Mastercard", color: "var(--color-chart-2)" },
  appleBalance: { label: "Apple balance", color: "var(--color-chart-3)" },
  amex: { label: "Amex", color: "var(--color-chart-4)" },
  other: { label: "Other", color: "var(--color-chart-5)" },
  count: { label: "Transactions" },
} satisfies ChartConfig;

// ---------- Helpers ----------

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

export default function SalesPage() {
  const [range, setRange] = useState("30d");
  const days = range === "7d" ? 7 : 30;

  const revenue = useMemo(() => DAILY_REVENUE.slice(-days), [days]);

  const totalProceeds = revenue.reduce((s, d) => s + d.proceeds, 0);
  const totalSales = revenue.reduce((s, d) => s + d.sales, 0);
  const totalUnits = revenue.reduce((s, d) => s + d.units, 0);
  const totalRefunds = revenue.reduce((s, d) => s + d.refunds, 0);
  const avgPerUnit = totalUnits > 0 ? totalProceeds / totalUnits : 0;
  const refundRate =
    totalUnits > 0 ? ((totalRefunds / totalUnits) * 100).toFixed(1) : "0";

  const totalPayments = PAYMENT_METHODS.reduce((s, p) => s + p.count, 0);
  const totalTxTypes = TRANSACTION_TYPES.reduce((s, t) => s + t.count, 0);

  return (
    <div className="space-y-6">
      {/* Header with date filter */}
      <div className="flex items-center justify-end">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[140px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Proceeds"
          value={`$${totalProceeds.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`$${totalSales.toLocaleString()} gross sales`}
          icon={CurrencyDollar}
        />
        <KpiCard
          title="Units sold"
          value={totalUnits.toLocaleString()}
          subtitle="Lifetime Pro IAP"
          icon={Receipt}
        />
        <KpiCard
          title="Avg. per unit"
          value={`$${avgPerUnit.toFixed(2)}`}
          subtitle="Developer proceeds"
          icon={TrendUp}
        />
        <KpiCard
          title="Refund rate"
          value={`${refundRate}%`}
          subtitle={`${totalRefunds} refund${totalRefunds !== 1 ? "s" : ""} this period`}
          icon={ArrowsClockwise}
        />
      </div>

      {/* Revenue over time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Revenue over time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-[300px] w-full">
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

      {/* Row: Territory + transaction types */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue by territory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Revenue by territory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={territoryConfig}
              className="h-[380px] w-full"
            >
              <BarChart
                data={REVENUE_BY_TERRITORY}
                layout="vertical"
                accessibilityLayer
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="territory"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                  className="text-xs"
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => (
                        <span className="font-mono font-medium tabular-nums">
                          ${(value as number).toLocaleString()}
                        </span>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey="proceeds"
                  fill="var(--color-proceeds)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Transaction types + payment methods */}
        <div className="space-y-4">
          {/* Transaction types pie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Transaction types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={txTypeConfig}
                className="mx-auto h-[160px] w-full"
              >
                <PieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="type"
                        formatter={(value) => (
                          <span className="font-mono font-medium tabular-nums">
                            {(value as number).toLocaleString()} (
                            {(((value as number) / totalTxTypes) * 100).toFixed(1)}%)
                          </span>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={TRANSACTION_TYPES}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={40}
                    outerRadius={70}
                    strokeWidth={2}
                  >
                    {TRANSACTION_TYPES.map((entry) => (
                      <Cell key={entry.type} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="type" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Payment methods pie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Payment methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={paymentConfig}
                className="mx-auto h-[160px] w-full"
              >
                <PieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        nameKey="method"
                        formatter={(value) => (
                          <span className="font-mono font-medium tabular-nums">
                            {(value as number).toLocaleString()} (
                            {(((value as number) / totalPayments) * 100).toFixed(1)}%)
                          </span>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={PAYMENT_METHODS}
                    dataKey="count"
                    nameKey="method"
                    innerRadius={40}
                    outerRadius={70}
                    strokeWidth={2}
                  >
                    {PAYMENT_METHODS.map((entry) => (
                      <Cell key={entry.method} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="method" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Revenue by product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Proceeds</TableHead>
                <TableHead className="text-right">Sales</TableHead>
                <TableHead className="text-right">Refunds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REVENUE_BY_PRODUCT.map((row) => (
                <TableRow key={row.sku}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.type}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.customerPrice > 0
                      ? `$${row.customerPrice.toFixed(2)}`
                      : "Free"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.units.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${row.proceeds.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${row.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.refunds}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Monthly summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Proceeds</TableHead>
                <TableHead className="text-right">Gross sales</TableHead>
                <TableHead className="text-right">Refunds</TableHead>
                <TableHead className="text-right">Territories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MONTHLY_SUMMARY.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.units.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${row.proceeds.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${row.sales.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.refunds}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.territories}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Recent transactions
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Lifetime Pro
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Proceeds</TableHead>
                <TableHead className="text-right">Units</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {RECENT_TRANSACTIONS.map((tx, i) => (
                <TableRow key={i}>
                  <TableCell className="tabular-nums">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {PRODUCT_TYPE_LABELS[tx.type] ?? tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.territory}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {tx.currency}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {tx.customerPrice > 0
                      ? tx.customerPrice.toFixed(2)
                      : "–"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {tx.proceeds > 0 ? tx.proceeds.toFixed(2) : "–"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {tx.units}
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
