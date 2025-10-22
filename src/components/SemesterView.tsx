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
  PieChart,
  Pie,
  Cell,
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
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target } from "lucide-react";
import { YearData } from "./mockData";

interface SemesterViewProps {
  currentYear: string;
  comparisonYear: string;
  currentData: YearData;
  comparisonData: YearData;
}

export default function SemesterView({
  currentYear,
  comparisonYear,
  currentData,
  comparisonData,
}: SemesterViewProps) {
  const chartData = currentData.semester.map((semester, index) => ({
    name: semester.name,
    [currentYear]: semester.revenue / 1000000,
    [comparisonYear]: comparisonData.semester[index].revenue / 1000000,
  }));

  const pieData = currentData.semester.map((semester, index) => ({
    name: semester.name,
    value: semester.revenue,
  }));

  const COLORS = ["#3b82f6", "#6366f1"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Comparison */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Comparação Semestral</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={comparisonYear}
                fill="#94a3b8"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey={currentYear}
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribution Pie Chart */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-slate-900 mb-4">Distribuição de Receita</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Semester Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentData.semester.map((semester, index) => {
          const prevSemester = comparisonData.semester[index];
          const variation = ((semester.revenue - prevSemester.revenue) / prevSemester.revenue) * 100;

          return (
            <Card
              key={semester.name}
              className="p-6 bg-gradient-to-br from-white to-blue-50 border-slate-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-slate-600 text-sm mb-1">{semester.name}</p>
                  <p className="text-slate-900">
                    {semester.revenue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Market Share</span>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    {semester.marketShare}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Crescimento</span>
                  <span
                    className={
                      semester.growth >= 0 ? "text-green-700" : "text-red-700"
                    }
                  >
                    {semester.growth >= 0 ? "+" : ""}
                    {semester.growth}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">vs {comparisonYear}</span>
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
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Table */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-slate-900 mb-4">Dados Detalhados - Semestral</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semestre</TableHead>
                <TableHead className="text-right">Faturamento {currentYear}</TableHead>
                <TableHead className="text-right">Faturamento {comparisonYear}</TableHead>
                <TableHead className="text-right">Variação</TableHead>
                <TableHead className="text-right">Market Share</TableHead>
                <TableHead className="text-right">Crescimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.semester.map((semester, index) => {
                const prevRevenue = comparisonData.semester[index].revenue;
                const variation = ((semester.revenue - prevRevenue) / prevRevenue) * 100;

                return (
                  <TableRow key={semester.name}>
                    <TableCell>{semester.name}</TableCell>
                    <TableCell className="text-right">
                      {semester.revenue.toLocaleString("pt-BR", {
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
                    <TableCell className="text-right">{semester.marketShare}%</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          semester.growth >= 0 ? "text-green-700" : "text-red-700"
                        }
                      >
                        {semester.growth >= 0 ? "+" : ""}
                        {semester.growth}%
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
