import { useState } from "react";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  LineChart,
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
import { ArrowUpRight, ArrowDownRight, TrendingUp, GitCompare } from "lucide-react";
import { MarketData } from "./mockData";

interface ComparisonViewProps {
  data: MarketData;
  years: string[];
  selectedYear: string;
  comparisonYear: string;
}

export default function ComparisonView({
  data,
  years,
  selectedYear,
  comparisonYear,
}: ComparisonViewProps) {
  const [comparisonType, setComparisonType] = useState<string>("monthly");

  const getComparisonData = () => {
    const current = data[selectedYear];
    const comparison = data[comparisonYear];

    switch (comparisonType) {
      case "monthly":
        return current.monthly.map((month, index) => ({
          name: month.month.substring(0, 3),
          [selectedYear]: month.revenue / 1000000,
          [comparisonYear]: comparison.monthly[index].revenue / 1000000,
          diff:
            ((month.revenue - comparison.monthly[index].revenue) /
              comparison.monthly[index].revenue) *
            100,
        }));
      case "bimonthly":
        return current.bimonthly.map((period, index) => ({
          name: period.name,
          [selectedYear]: period.revenue / 1000000,
          [comparisonYear]: comparison.bimonthly[index].revenue / 1000000,
          diff:
            ((period.revenue - comparison.bimonthly[index].revenue) /
              comparison.bimonthly[index].revenue) *
            100,
        }));
      case "quarterly":
        return current.quarterly.map((quarter, index) => ({
          name: quarter.name,
          [selectedYear]: quarter.revenue / 1000000,
          [comparisonYear]: comparison.quarterly[index].revenue / 1000000,
          diff:
            ((quarter.revenue - comparison.quarterly[index].revenue) /
              comparison.quarterly[index].revenue) *
            100,
        }));
      case "semester":
        return current.semester.map((semester, index) => ({
          name: semester.name,
          [selectedYear]: semester.revenue / 1000000,
          [comparisonYear]: comparison.semester[index].revenue / 1000000,
          diff:
            ((semester.revenue - comparison.semester[index].revenue) /
              comparison.semester[index].revenue) *
            100,
        }));
      default:
        return [];
    }
  };

  const comparisonData = getComparisonData();

  // Multi-year comparison
  const multiYearData = years.map((year) => ({
    year,
    revenue: data[year].annual.revenue / 1000000,
    marketShare: data[year].annual.marketShare,
  }));

  // Radar comparison
  const radarData = [
    {
      metric: "Receita Total",
      [selectedYear]: (data[selectedYear].annual.revenue / data[comparisonYear].annual.revenue) * 100,
      [comparisonYear]: 100,
    },
    {
      metric: "Market Share",
      [selectedYear]: (data[selectedYear].annual.marketShare / data[comparisonYear].annual.marketShare) * 100,
      [comparisonYear]: 100,
    },
    {
      metric: "Crescimento",
      [selectedYear]: Math.max(0, (data[selectedYear].annual.averageGrowth + 20)),
      [comparisonYear]: Math.max(0, (data[comparisonYear].annual.averageGrowth + 20)),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Comparison Controls */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="flex items-center gap-4">
          <GitCompare className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <h3 className="text-slate-900">Tipo de Comparação</h3>
            <p className="text-slate-600 text-sm">
              Selecione o período de comparação
            </p>
          </div>
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="bimonthly">Bimestral</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="semester">Semestral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">
            Comparação {selectedYear} vs {comparisonYear}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar dataKey={comparisonYear} fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey={selectedYear} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Análise Comparativa de Performance</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" stroke="#64748b" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar
                name={comparisonYear}
                dataKey={comparisonYear}
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.6}
              />
              <Radar
                name={selectedYear}
                dataKey={selectedYear}
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Variance Chart */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">
          Variação Percentual por Período
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar
              dataKey="diff"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", formatter: (value: number) => `${value.toFixed(1)}%` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Multi-year Evolution */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Evolução Multi-Anual</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={multiYearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" stroke="#64748b" />
            <YAxis yAxisId="left" stroke="#64748b" />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Receita (M)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="marketShare"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Market Share (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Comparison Table */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Tabela Comparativa Detalhada</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">{selectedYear}</TableHead>
                <TableHead className="text-right">{comparisonYear}</TableHead>
                <TableHead className="text-right">Diferença Absoluta</TableHead>
                <TableHead className="text-right">Variação %</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonData.map((item) => {
                const absoluteDiff = item[selectedYear] - item[comparisonYear];
                return (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">
                      R$ {item[selectedYear].toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      R$ {item[comparisonYear].toFixed(2)}M
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          absoluteDiff >= 0 ? "text-green-700" : "text-red-700"
                        }
                      >
                        {absoluteDiff >= 0 ? "+" : ""}
                        R$ {absoluteDiff.toFixed(2)}M
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.diff >= 0 ? (
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {item.diff.toFixed(1)}%
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {Math.abs(item.diff).toFixed(1)}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.diff >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600 inline" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600 inline" />
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
