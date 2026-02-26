"use client";

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
  MONTHLY_SUMMARY,
  RECENT_TRANSACTIONS,
  PRODUCT_TYPE_LABELS,
  formatDate,
} from "@/lib/mock-sales";

export default function SalesTransactionsPage() {
  return (
    <div className="space-y-6">
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
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal"
                    >
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
