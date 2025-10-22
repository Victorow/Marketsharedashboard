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
  ComposedChart,
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
import { ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { MarketData } from "./mockData";

interface AnnualViewProps {
  data: MarketData;
  years: string[];
}

export default function AnnualView({ data, years }: AnnualViewProps) {
  const chartData = years.map((year) => ({
    year,
    revenue: data[year].annual.revenue / 1000000,
    marketShare: data[year].annual.marketShare,
    growth: data[year].annual.averageGrowth,
  }));

  return (
    <div className="space-y-4">
      {/* Historical Revenue */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Evolução Histórica de Faturamento</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                      <p className="text-slate-900 mb-2">{payload[0].payload.year}</p>
                      <p className="text-blue-600">
                        R$ {payload[0].value}M
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Market Share Evolution */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Evolução de Market Share</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="marketShare" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Line
                type="monotone"
                dataKey="marketShare"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Growth Rate */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Taxa de Crescimento Anual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Year Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {years.map((year, index) => {
          const yearData = data[year];
          const prevYear = index > 0 ? data[years[index - 1]] : null;
          const variation = prevYear
            ? ((yearData.annual.revenue - prevYear.annual.revenue) /
                prevYear.annual.revenue) *
              100
            : 0;

          return (
            <Card
              key={year}
              className="p-4 bg-gradient-to-br from-white to-slate-50 border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-slate-900">{year}</span>
              </div>
              <p className="text-slate-600 text-sm mb-1">Faturamento</p>
              <p className="text-slate-900 mb-3">
                {(yearData.annual.revenue / 1000000).toFixed(1)}M
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Market Share</span>
                  <span className="text-indigo-700">
                    {yearData.annual.marketShare.toFixed(1)}%
                  </span>
                </div>
                {index > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Variação</span>
                    {variation >= 0 ? (
                      <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 text-xs">
                        <ArrowUpRight className="h-2 w-2 mr-1" />
                        {variation.toFixed(1)}%
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 text-xs">
                        <ArrowDownRight className="h-2 w-2 mr-1" />
                        {Math.abs(variation).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Table */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Dados Anuais Consolidados</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ano</TableHead>
                <TableHead className="text-right">Faturamento</TableHead>
                <TableHead className="text-right">Market Share</TableHead>
                <TableHead className="text-right">Crescimento Médio</TableHead>
                <TableHead className="text-right">Variação YoY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((year, index) => {
                const yearData = data[year];
                const prevYear = index > 0 ? data[years[index - 1]] : null;
                const variation = prevYear
                  ? ((yearData.annual.revenue - prevYear.annual.revenue) /
                      prevYear.annual.revenue) *
                    100
                  : 0;

                return (
                  <TableRow key={year}>
                    <TableCell>{year}</TableCell>
                    <TableCell className="text-right">
                      {yearData.annual.revenue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {yearData.annual.marketShare.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          yearData.annual.averageGrowth >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {yearData.annual.averageGrowth >= 0 ? "+" : ""}
                        {yearData.annual.averageGrowth.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {index > 0 ? (
                        variation >= 0 ? (
                          <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            {variation.toFixed(1)}%
                          </Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            {Math.abs(variation).toFixed(1)}%
                          </Badge>
                        )
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
