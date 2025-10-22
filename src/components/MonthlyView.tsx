import { Card } from "./ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
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

interface MonthlyViewProps {
  currentYear: string;
  comparisonYear: string;
  currentData: YearData;
  comparisonData: YearData;
}

export default function MonthlyView({
  currentYear,
  comparisonYear,
  currentData,
  comparisonData,
}: MonthlyViewProps) {
  const chartData = currentData.monthly.map((month, index) => ({
    month: month.month.substring(0, 3),
    [currentYear]: month.revenue / 1000000,
    [comparisonYear]: comparisonData.monthly[index].revenue / 1000000,
    marketShare: month.marketShare,
    marketSharePrev: comparisonData.monthly[index].marketShare,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="text-slate-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toFixed(2)}M
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Revenue Chart */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Faturamento Mensal</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey={comparisonYear}
              stroke="#94a3b8"
              fillOpacity={1}
              fill="url(#colorPrev)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey={currentYear}
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorCurrent)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Market Share Chart */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Market Share Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="marketSharePrev"
                stroke="#94a3b8"
                strokeWidth={2}
                name={comparisonYear}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="marketShare"
                stroke="#6366f1"
                strokeWidth={2}
                name={currentYear}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Growth Comparison */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Crescimento Mensal (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentData.monthly.map((m) => ({ month: m.month.substring(0, 3), growth: m.growth }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Dados Detalhados - Mensal</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês</TableHead>
                <TableHead className="text-right">Faturamento {currentYear}</TableHead>
                <TableHead className="text-right">Faturamento {comparisonYear}</TableHead>
                <TableHead className="text-right">Variação</TableHead>
                <TableHead className="text-right">Market Share {currentYear}</TableHead>
                <TableHead className="text-right">Crescimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.monthly.map((month, index) => {
                const prevRevenue = comparisonData.monthly[index].revenue;
                const variation = ((month.revenue - prevRevenue) / prevRevenue) * 100;

                return (
                  <TableRow key={month.month}>
                    <TableCell>{month.month}</TableCell>
                    <TableCell className="text-right">
                      {month.revenue.toLocaleString("pt-BR", {
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
                    <TableCell className="text-right">{month.marketShare}%</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          month.growth >= 0 ? "text-green-700" : "text-red-700"
                        }
                      >
                        {month.growth >= 0 ? "+" : ""}
                        {month.growth}%
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
