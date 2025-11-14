export interface ChurnRecord {
  id: string;
  clientName: string;
  csGroup?: string; // NEW: CS Group
  platformClientId?: string; // NEW: Platform Client ID
  csSubGroup?: string; // NEW: Cs Sub-Group
  lastInvoiceMRR?: number; // NEW: Last Invoice MRR
  tpvLastMonth?: number; // NEW: TPV Last Month
  warningMetrics?: string; // NEW: Warning Metrics
  warningExplanation?: string; // NEW: Warning Explanation
  churnExplanationST?: string; // NEW: Churn Explanation ST
  churnCategory: string;
  warningReason?: string; // NEW: Warning Reason
  accountId?: string; // NEW: Account ID
  avgMRR?: number; // NEW: Avg MRR
  avgTPV?: number; // NEW: Avg TPV
  lastEffectivePaymentDate?: string; // NEW: Last Effective Payment Date
  estimatedChurnDate?: string; // PRIMARY: Estimated Churn Date (includes past and future churns)
  competitor?: string;
  createdDate?: string; // Account creation date
  monthsBeforeChurn?: number; // Months from creation to churn
  mrr?: number;
  price?: number;
  serviceCategory?: string;
  feedback?: string;
  // NOTE: reactivationDate and reactivationDays removed
  // Use dedicated reactivations sheet as source of truth
}

export interface ChurnAnalysis {
  totalChurns: number;
  averageReactivationDays: number;
  averageMonthsBeforeChurn: number; // NEW: Average customer lifetime before churn
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

