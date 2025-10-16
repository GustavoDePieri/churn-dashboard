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
  totalMRRLost: number;
  averageMRRPerChurn: number;
  topChurnCategories: CategoryCount[];
  topServiceCategories: CategoryCount[];
  clientFeedbackCategories: CategoryCount[];
  competitorAnalysis: CompetitorData[];
  reactivationByChurnCategory: ReactivationCorrelation[];
  monthlyTrend: MonthlyTrendData[];
  monthlyChurnByCategory: any[]; // Array of objects with month and category counts
  aiInsights: string;
  executiveSummary: string;
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

export interface ReactivationRecord {
  id: string;
  platformClientId: string;
  customerSuccessPath: string;
  accountOwner: string;
  accountName: string;
  mrr: number;
  activeContracts: number;
  reactivationId: string;
  reactivationReason: string;
  reactivationDate: string;
  churnDate?: string; // NEW: Churn Date from reactivations sheet
}

export interface ReactivationAnalysis {
  totalReactivations: number;
  totalMRRRecovered: number;
  averageMRR: number;
  topReactivationReasons: CategoryCount[];
  reactivationsByCSPath: CategoryCount[];
  monthlyReactivations: { month: string; count: number; mrr: number }[];
  aiInsights: string;
}

