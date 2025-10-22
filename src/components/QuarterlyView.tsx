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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
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

interface QuarterlyViewProps {
  currentYear: string;
  comparisonYear: string;
  currentData: YearData;
  comparisonData: YearData;
}

export default function QuarterlyView({
  currentYear,
  comparisonYear,
  currentData,
  comparisonData,
}: QuarterlyViewProps) {
  const chartData = currentData.quarterly.map((quarter, index) => ({
    name: quarter.name,
    [currentYear]: quarter.revenue / 1000000,
    [comparisonYear]: comparisonData.quarterly[index].revenue / 1000000,
    marketShare: quarter.marketShare,
    growth: quarter.growth,
  }));

  const radarData = currentData.quarterly.map((quarter) => ({
    quarter: quarter.name,
    marketShare: quarter.marketShare,
    growth: Math.max(0, quarter.growth + 10),
  }));

  return (
    <div className="space-y-4">
      {/* Revenue Comparison */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Comparação de Faturamento Trimestral</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={comparisonYear}
              fill="#cbd5e1"
              radius={[4, 4, 0, 0]}
            />
            <Area
              type="monotone"
              dataKey={currentYear}
              fill="url(#colorRevenue)"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Análise de Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="quarter" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar
                name="Market Share"
                dataKey="marketShare"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Radar
                name="Crescimento"
                dataKey="growth"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quarter Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {currentData.quarterly.map((quarter, index) => (
            <Card key={quarter.name} className="p-4 bg-gradient-to-br from-white to-slate-50 border-slate-200">
              <div className="space-y-2">
                <p className="text-slate-600 text-sm">{quarter.name}</p>
                <p className="text-slate-900">
                  {(quarter.revenue / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    {quarter.marketShare}%
                  </Badge>
                  {quarter.growth >= 0 ? (
                    <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                      <ArrowUpRight className="h-3 w-3" />
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                      <ArrowDownRight className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Dados Detalhados - Trimestral</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trimestre</TableHead>
                <TableHead className="text-right">Faturamento {currentYear}</TableHead>
                <TableHead className="text-right">Faturamento {comparisonYear}</TableHead>
                <TableHead className="text-right">Variação</TableHead>
                <TableHead className="text-right">Market Share</TableHead>
                <TableHead className="text-right">Crescimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.quarterly.map((quarter, index) => {
                const prevRevenue = comparisonData.quarterly[index].revenue;
                const variation = ((quarter.revenue - prevRevenue) / prevRevenue) * 100;

                return (
                  <TableRow key={quarter.name}>
                    <TableCell>{quarter.name}</TableCell>
                    <TableCell className="text-right">
                      {quarter.revenue.toLocaleString("pt-BR", {
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
                    <TableCell className="text-right">{quarter.marketShare}%</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          quarter.growth >= 0 ? "text-green-700" : "text-red-700"
                        }
                      >
                        {quarter.growth >= 0 ? "+" : ""}
                        {quarter.growth}%
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
