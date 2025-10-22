export interface MonthlyData {
  month: string;
  revenue: number;
  marketShare: number;
  growth: number;
}

export interface PeriodData {
  name: string;
  revenue: number;
  marketShare: number;
  growth: number;
}

export interface YearData {
  monthly: MonthlyData[];
  bimonthly: PeriodData[];
  quarterly: PeriodData[];
  semester: PeriodData[];
  annual: {
    revenue: number;
    marketShare: number;
    averageGrowth: number;
  };
}

export interface MarketData {
  [year: string]: YearData;
}

export function generateMockData(): MarketData {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const data: MarketData = {};

  // Generate data for years 2020-2024
  for (let year = 2020; year <= 2024; year++) {
    const baseRevenue = 8000000 + (year - 2020) * 2500000;
    const baseMarketShare = 15 + (year - 2020) * 2.5;

    // Generate monthly data
    const monthlyData: MonthlyData[] = months.map((month, index) => {
      const seasonalVariation = Math.sin((index / 12) * Math.PI * 2) * 0.15;
      const randomVariation = (Math.random() - 0.5) * 0.1;
      const revenue =
        baseRevenue / 12 + baseRevenue * (seasonalVariation + randomVariation);
      const marketShare = baseMarketShare + (Math.random() - 0.5) * 2;
      const growth = -5 + Math.random() * 20;

      return {
        month,
        revenue: Math.round(revenue),
        marketShare: Number(marketShare.toFixed(1)),
        growth: Number(growth.toFixed(1)),
      };
    });

    // Generate bimonthly data
    const bimonthlyData: PeriodData[] = [];
    for (let i = 0; i < 6; i++) {
      const month1 = monthlyData[i * 2];
      const month2 = monthlyData[i * 2 + 1];
      bimonthlyData.push({
        name: `${i + 1}º Bimestre`,
        revenue: month1.revenue + month2.revenue,
        marketShare: Number(((month1.marketShare + month2.marketShare) / 2).toFixed(1)),
        growth: Number(((month1.growth + month2.growth) / 2).toFixed(1)),
      });
    }

    // Generate quarterly data
    const quarterlyData: PeriodData[] = [];
    for (let i = 0; i < 4; i++) {
      const quarterMonths = monthlyData.slice(i * 3, i * 3 + 3);
      const revenue = quarterMonths.reduce((sum, m) => sum + m.revenue, 0);
      const marketShare =
        quarterMonths.reduce((sum, m) => sum + m.marketShare, 0) / 3;
      const growth = quarterMonths.reduce((sum, m) => sum + m.growth, 0) / 3;

      quarterlyData.push({
        name: `Q${i + 1}`,
        revenue: Math.round(revenue),
        marketShare: Number(marketShare.toFixed(1)),
        growth: Number(growth.toFixed(1)),
      });
    }

    // Generate semester data
    const semesterData: PeriodData[] = [];
    for (let i = 0; i < 2; i++) {
      const semesterMonths = monthlyData.slice(i * 6, i * 6 + 6);
      const revenue = semesterMonths.reduce((sum, m) => sum + m.revenue, 0);
      const marketShare =
        semesterMonths.reduce((sum, m) => sum + m.marketShare, 0) / 6;
      const growth = semesterMonths.reduce((sum, m) => sum + m.growth, 0) / 6;

      semesterData.push({
        name: `${i + 1}º Semestre`,
        revenue: Math.round(revenue),
        marketShare: Number(marketShare.toFixed(1)),
        growth: Number(growth.toFixed(1)),
      });
    }

    // Calculate annual data
    const annualRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
    const annualMarketShare =
      monthlyData.reduce((sum, m) => sum + m.marketShare, 0) / 12;
    const annualGrowth = monthlyData.reduce((sum, m) => sum + m.growth, 0) / 12;

    data[year.toString()] = {
      monthly: monthlyData,
      bimonthly: bimonthlyData,
      quarterly: quarterlyData,
      semester: semesterData,
      annual: {
        revenue: Math.round(annualRevenue),
        marketShare: Number(annualMarketShare.toFixed(1)),
        averageGrowth: Number(annualGrowth.toFixed(1)),
      },
    };
  }

  return data;
}
