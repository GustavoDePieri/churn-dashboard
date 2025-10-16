import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChurnAnalysis } from '@/types';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import AIInsightsEnhanced from '@/components/AIInsightsEnhanced';
import LoadingSpinner from '@/components/LoadingSpinner';
import { darkChartStyles, brandColors } from '@/lib/chartStyles';

export default function Home() {
  const [data, setData] = useState<ChurnAnalysis | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data FAST (without AI)
    async function fetchData() {
      try {
        const [churnResponse, summaryResponse] = await Promise.all([
          fetch('/api/churn-data'),
          fetch('/api/churn-summary'),
        ]);

        if (!churnResponse.ok) {
          throw new Error('Failed to fetch churn data');
        }

        const churnData = await churnResponse.json();
        setData(churnData);
        
        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          setSummary(summaryData);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    // Fetch AI insights separately (non-blocking)
    async function fetchAIInsights() {
      try {
        const response = await fetch('/api/ai-insights');
        if (response.ok) {
          const result = await response.json();
          setAiInsights(result.insights);
        }
      } catch (err) {
        console.error('Failed to fetch AI insights:', err);
      } finally {
        setAiLoading(false);
      }
    }

    fetchData();
    fetchAIInsights();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-coral-main mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h1>
          <p className="text-white/70">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AI Churn Dashboard - Ontop</title>
        <meta name="description" content="AI-powered churn analysis dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-5xl font-bold gradient-text mb-3">
                  Churn Dashboard
                </h1>
                <p className="text-xl text-white/70">
                  Key metrics and insights
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/monthly-report"
                  className="px-6 py-3 bg-gradient-brand text-white rounded-xl hover:scale-105 transition-all font-bold shadow-xl hover:shadow-purple-main/50 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Full Report</span>
                </Link>
                <Link 
                  href="/reactivations"
                  className="px-6 py-3 glass-light text-white rounded-xl hover:bg-white/10 transition-all font-medium"
                >
                  Reactivations
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metrics - Focused on Boss Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Churns"
              value={summary?.totalChurns || data.totalChurns}
              subtitle="Customers lost"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              }
            />
            <MetricCard
              title="Avg Reactivation Time"
              value={summary ? `${summary.averageReactivationDays} days` : `${Math.round(data.averageReactivationDays)} days`}
              subtitle="Churn to reactivation date"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Top Churn Reason"
              value={(summary?.topChurnCategory || data.topChurnCategories[0]?.category || 'N/A').substring(0, 20)}
              subtitle={`${summary?.topChurnCategoryCount || data.topChurnCategories[0]?.count || 0} churns`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <MetricCard
              title="Top Competitor"
              value={(summary?.topCompetitor || data.competitorAnalysis[0]?.competitor || 'N/A').substring(0, 20)}
              subtitle={`$${(summary?.topCompetitorMRR || data.competitorAnalysis[0]?.totalMRR || 0).toFixed(0)} MRR lost`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>

          {/* Boss Question 1: Main Churn Categories by Month */}
          <div className="mb-8">
            <ChartCard
              title="❌ Monthly Churn Categories"
              description="Why are customers leaving each month?"
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.monthlyChurnByCategory}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis 
                    dataKey="month" 
                    {...darkChartStyles.axis}
                    tickFormatter={(value) => {
                      const date = new Date(value + '-01');
                      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    }}
                  />
                  <YAxis {...darkChartStyles.axis} label={{ value: 'Churns', angle: -90, position: 'insideLeft', style: {fill: '#ffffff'} }} />
                  <Tooltip 
                    {...darkChartStyles.tooltip}
                    labelFormatter={(value) => {
                      const date = new Date(value + '-01');
                      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    }}
                  />
                  <Legend {...darkChartStyles.legend} />
                  {data.topChurnCategories.slice(0, 5).map((cat, index) => (
                    <Bar 
                      key={cat.category} 
                      dataKey={cat.category} 
                      stackId="churn" 
                      fill={brandColors[index % brandColors.length]}
                      name={cat.category.length > 25 ? cat.category.substring(0, 22) + '...' : cat.category}
                    />
                  ))}
                  {data.monthlyChurnByCategory.some((m: any) => m.Other) && (
                    <Bar dataKey="Other" stackId="churn" fill="#6b7280" name="Other" />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Boss Question 2: Reactivation Correlation */}
          <div className="mb-8">
            <ChartCard
              title="🔗 Churn Category vs Reactivation Rate"
              description="Which churn reasons lead to customers coming back?"
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.reactivationByChurnCategory.slice(0, 6)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="churnCategory" angle={-45} textAnchor="end" height={120} {...darkChartStyles.axis} />
                  <YAxis label={{ value: 'Reactivation Rate (%)', angle: -90, position: 'insideLeft', style: {fill: '#ffffff'} }} {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Bar dataKey="reactivationRate" fill="url(#reactivationGradient)" />
                  <defs>
                    <linearGradient id="reactivationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Boss Question 3: Competitors */}
          {data.competitorAnalysis.length > 0 && (
            <div className="mb-8">
              <ChartCard
                title="🏆 Competitors Winning - MRR & Pricing"
                description="Who's taking our customers and at what cost?"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                          Competitor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                          Accounts Won
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                          Total MRR Lost
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                          Avg Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.competitorAnalysis.slice(0, 8).map((competitor, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            {competitor.competitor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-coral-main font-bold">
                            {competitor.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70 font-medium">
                            ${competitor.totalMRR.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                            ${competitor.averagePrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </div>
          )}

          {/* Boss Question 4: Monthly Trend - When do churns happen? */}
          <div className="mb-8">
            <ChartCard
              title="📈 Churn & Reactivation Trend"
              description="When do customers leave and when do they come back?"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyTrend}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="month" {...darkChartStyles.axis} />
                  <YAxis {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Legend {...darkChartStyles.legend} />
                  <Line type="monotone" dataKey="churns" stroke="#f43f5e" strokeWidth={3} name="Churns" dot={{fill: '#f43f5e', r: 4}} />
                  <Line type="monotone" dataKey="reactivations" stroke="#34d399" strokeWidth={3} name="Reactivations" dot={{fill: '#34d399', r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* AI Insights - Loads Separately */}
          <div className="mb-8">
            <AIInsightsEnhanced insights={aiInsights} isLoading={aiLoading} />
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-white/40 border-t border-white/10 pt-8">
            <p className="flex items-center justify-center space-x-2 mb-2">
              <span className="w-2 h-2 bg-gradient-brand rounded-full animate-pulse"></span>
              <span>Powered by Google Gemini 2.5 Flash | Data from Google Sheets</span>
            </p>
            <p className="text-xs text-white/30">Last updated: {new Date().toLocaleString()}</p>
          </footer>
        </div>
      </main>
    </>
  );
}
