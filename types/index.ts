export interface ChurnRecord {
  id: string;
  clientName: string;
  churnDate: string;
  churnCategory: string;
  reactivationDate?: string;
  reactivationDays?: number;
  competitor?: string;
  mrr?: number;
  price?: number;
  serviceCategory?: string;
  feedback?: string;
}

export interface ChurnAnalysis {
  totalChurns: number;
  averageReactivationDays: number;
  topChurnCategories: CategoryCount[];
  topServiceCategories: CategoryCount[];
  competitorAnalysis: CompetitorData[];
  reactivationByChurnCategory: ReactivationCorrelation[];
  monthlyTrend: MonthlyTrendData[];
  aiInsights: string;
}

export interface CategoryCount {
  category: string;
  count: number;
  percentage: number;
}

export interface CompetitorData {
  competitor: string;
  count: number;
  totalMRR: number;
  averagePrice: number;
}

export interface ReactivationCorrelation {
  churnCategory: string;
  reactivationRate: number;
  averageDaysToReactivation: number;
  totalCount: number;
}

export interface MonthlyTrendData {
  month: string;
  churns: number;
  reactivations: number;
}

