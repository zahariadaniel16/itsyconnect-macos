"use client";

import { Cell, Pie, PieChart } from "recharts";
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
  TRANSACTION_TYPES,
  PROCEEDS_BY_CURRENCY,
  REVENUE_BY_PRODUCT,
  REVENUE_BY_TERRITORY,
} from "@/lib/mock-sales";

// ---------- Chart configs ----------

const txTypeConfig = {
  iapPurchase: { label: "IAP purchase", color: "var(--color-chart-1)" },
  restoredIap: { label: "Restored IAP", color: "var(--color-chart-2)" },
  refund: { label: "Refund", color: "var(--color-chart-5)" },
  count: { label: "Transactions" },
} satisfies ChartConfig;

const currencyConfig = {
  usd: { label: "USD", color: "var(--color-chart-1)" },
  eur: { label: "EUR", color: "var(--color-chart-2)" },
  gbp: { label: "GBP", color: "var(--color-chart-3)" },
  cad: { label: "CAD", color: "var(--color-chart-4)" },
  aud: { label: "AUD", color: "var(--color-chart-5)" },
  other: { label: "Other", color: "oklch(0.55 0.02 250)" },
  amount: { label: "Proceeds (USD)" },
} satisfies ChartConfig;

// ---------- Page ----------

export default function SalesBreakdownPage() {
  const totalTxTypes = TRANSACTION_TYPES.reduce((s, t) => s + t.count, 0);
  const totalCurrency = PROCEEDS_BY_CURRENCY.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Donuts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Transaction types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Transaction types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={txTypeConfig}
              className="mx-auto h-[220px] w-full"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="type"
                      formatter={(value) => (
                        <span className="font-mono font-medium tabular-nums">
                          {(value as number).toLocaleString()} (
                          {(((value as number) / totalTxTypes) * 100).toFixed(1)}
                          %)
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={TRANSACTION_TYPES}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={50}
                  outerRadius={85}
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

        {/* Proceeds by currency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Proceeds by currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={currencyConfig}
              className="mx-auto h-[220px] w-full"
            >
              <PieChart accessibilityLayer>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="currency"
                      formatter={(value) => (
                        <span className="font-mono font-medium tabular-nums">
                          ${(value as number).toLocaleString()} (
                          {(((value as number) / totalCurrency) * 100).toFixed(1)}
                          %)
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={PROCEEDS_BY_CURRENCY}
                  dataKey="amount"
                  nameKey="currency"
                  innerRadius={50}
                  outerRadius={85}
                  strokeWidth={2}
                >
                  {PROCEEDS_BY_CURRENCY.map((entry) => (
                    <Cell key={entry.currency} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="currency" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by product */}
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

      {/* Revenue by territory table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Revenue by territory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Territory</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Proceeds</TableHead>
                <TableHead className="text-right">Gross sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {REVENUE_BY_TERRITORY.map((row) => (
                <TableRow key={row.code}>
                  <TableCell className="font-medium">
                    {row.territory}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.currency}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
