import { Card } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { YearData } from "./mockData";

interface BimonthlyViewProps {
  currentYear: string;
  comparisonYear: string;
  currentData: YearData;
  comparisonData: YearData;
}

export default function BimonthlyView({
  currentYear,
  comparisonYear,
  currentData,
  comparisonData,
}: BimonthlyViewProps) {
  const chartData = currentData.bimonthly.map((period, index) => ({
    name: period.name,
    [currentYear]: period.revenue / 1000000,
    [comparisonYear]: comparisonData.bimonthly[index].revenue / 1000000,
    marketShare: period.marketShare,
  }));

  return (
    <div className="space-y-4">
      {/* Revenue and Market Share Chart */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Desempenho Bimestral</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis yAxisId="left" stroke="#64748b" />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey={comparisonYear}
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey={currentYear}
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marketShare"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Table */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Dados Detalhados - Bimestral</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Faturamento {currentYear}</TableHead>
                <TableHead className="text-right">Faturamento {comparisonYear}</TableHead>
                <TableHead className="text-right">Variação</TableHead>
                <TableHead className="text-right">Market Share</TableHead>
                <TableHead className="text-right">Crescimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.bimonthly.map((period, index) => {
                const prevRevenue = comparisonData.bimonthly[index].revenue;
                const variation = ((period.revenue - prevRevenue) / prevRevenue) * 100;

                return (
                  <TableRow key={period.name}>
                    <TableCell>{period.name}</TableCell>
                    <TableCell className="text-right">
                      {period.revenue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {prevRevenue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {variation >= 0 ? (
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {variation.toFixed(1)}%
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {Math.abs(variation).toFixed(1)}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{period.marketShare}%</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          period.growth >= 0 ? "text-green-700" : "text-red-700"
                        }
                      >
                        {period.growth >= 0 ? "+" : ""}
                        {period.growth}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
