import { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import MonthlyView from "./MonthlyView";
import BimonthlyView from "./BimonthlyView";
import QuarterlyView from "./QuarterlyView";
import SemesterView from "./SemesterView";
import AnnualView from "./AnnualView";
import ComparisonView from "./ComparisonView";
import { generateMockData } from "./mockData";

export default function MarketShareDashboard() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [comparisonYear, setComparisonYear] = useState("2023");
  const [activeView, setActiveView] = useState("monthly");

  const years = ["2020", "2021", "2022", "2023", "2024"];
  const data = generateMockData();

  // Calculate current year metrics
  const currentYearData = data[selectedYear];
  const previousYearData = data[comparisonYear];

  const currentTotal = currentYearData.annual.revenue;
  const previousTotal = previousYearData.annual.revenue;
  const yearOverYearGrowth = ((currentTotal - previousTotal) / previousTotal) * 100;

  const currentMarketShare = currentYearData.annual.marketShare;
  const previousMarketShare = previousYearData.annual.marketShare;
  const marketShareChange = currentMarketShare - previousMarketShare;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-slate-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              Market Share Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Análise completa de faturamento e participação de mercado
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px] bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-sm">vs</span>
              <Select value={comparisonYear} onValueChange={setComparisonYear}>
                <SelectTrigger className="w-[120px] bg-white border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">Faturamento Total</p>
                <p className="text-slate-900">
                  {currentTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {yearOverYearGrowth >= 0 ? (
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {yearOverYearGrowth.toFixed(1)}%
                </Badge>
              ) : (
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(yearOverYearGrowth).toFixed(1)}%
                </Badge>
              )}
              <span className="text-slate-500 text-sm">vs {comparisonYear}</span>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">Market Share</p>
                <p className="text-slate-900">{currentMarketShare.toFixed(1)}%</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {marketShareChange >= 0 ? (
                <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {marketShareChange.toFixed(1)}pp
                </Badge>
              ) : (
                <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(marketShareChange).toFixed(1)}pp
                </Badge>
              )}
              <span className="text-slate-500 text-sm">vs {comparisonYear}</span>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">Crescimento Médio</p>
                <p className="text-slate-900">
                  {currentYearData.annual.averageGrowth.toFixed(1)}%
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(Math.abs(currentYearData.annual.averageGrowth) * 5, 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">Ticket Médio</p>
                <p className="text-slate-900">
                  {(currentTotal / 12).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm">
                Média mensal de faturamento
              </p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Mensal
            </TabsTrigger>
            <TabsTrigger
              value="bimonthly"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Bimestral
            </TabsTrigger>
            <TabsTrigger
              value="quarterly"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Trimestral
            </TabsTrigger>
            <TabsTrigger
              value="semester"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Semestral
            </TabsTrigger>
            <TabsTrigger
              value="annual"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Anual
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Comparação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <MonthlyView
              currentYear={selectedYear}
              comparisonYear={comparisonYear}
              currentData={currentYearData}
              comparisonData={previousYearData}
            />
          </TabsContent>

          <TabsContent value="bimonthly" className="space-y-4">
            <BimonthlyView
              currentYear={selectedYear}
              comparisonYear={comparisonYear}
              currentData={currentYearData}
              comparisonData={previousYearData}
            />
          </TabsContent>

          <TabsContent value="quarterly" className="space-y-4">
            <QuarterlyView
              currentYear={selectedYear}
              comparisonYear={comparisonYear}
              currentData={currentYearData}
              comparisonData={previousYearData}
            />
          </TabsContent>

          <TabsContent value="semester" className="space-y-4">
            <SemesterView
              currentYear={selectedYear}
              comparisonYear={comparisonYear}
              currentData={currentYearData}
              comparisonData={previousYearData}
            />
          </TabsContent>

          <TabsContent value="annual" className="space-y-4">
            <AnnualView data={data} years={years} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <ComparisonView
              data={data}
              years={years}
              selectedYear={selectedYear}
              comparisonYear={comparisonYear}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
