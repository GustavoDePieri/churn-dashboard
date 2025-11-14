import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import AIInsightsEnhanced from '@/components/AIInsightsEnhanced';
import LoadingSpinner from '@/components/LoadingSpinner';
import DateRangeFilter from '@/components/DateRangeFilter';
import Header from '@/components/Header';
import { darkChartStyles, brandColors } from '@/lib/chartStyles';

const COLORS = brandColors;

export default function MonthlyReport() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Date filter state
  const [startDate, setStartDate] = useState(format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [appliedStartDate, setAppliedStartDate] = useState(startDate);
  const [appliedEndDate, setAppliedEndDate] = useState(endDate);

  const fetchData = async (start: string, end: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/monthly-report?startDate=${start}&endDate=${end}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch monthly report');
      }

      const reportData = await response.json();
      setData(reportData);
      setLastUpdated(new Date());
      setLoading(false);
      
      if (reportData.aiInsights && reportData.aiInsights.length > 10) {
        setAiLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchData(appliedStartDate, appliedEndDate);
    
    const aiTimeout = setTimeout(() => setAiLoading(false), 2000);
    return () => clearTimeout(aiTimeout);
  }, [appliedStartDate, appliedEndDate]);

  const handleApplyFilter = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleReset = () => {
    const defaultStart = format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd');
    const defaultEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setAppliedStartDate(defaultStart);
    setAppliedEndDate(defaultEnd);
  };

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
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Report</h1>
          <p className="text-white/70">{error || 'No data available'}</p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-gradient-cta text-white rounded-xl hover:scale-105 transition-all font-bold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { churnAnalysis, reactivationAnalysis, crossAnalysis, aiInsights, dateRange } = data;

  return (
    <>
      <Head>
        <title>Monthly Churn Report - AI Analysis</title>
        <meta name="description" content="Comprehensive monthly churn and reactivation analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header lastUpdated={lastUpdated} />

      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-5xl font-bold gradient-text mb-3">
                  📊 Monthly Churn Report
                </h1>
                <p className="text-xl text-white/70">
                  Comprehensive analysis powered by Google Gemini 2.5 Flash
                </p>
                <p className="text-sm text-white/50 mt-2">
                  Analyzing data from {format(new Date(appliedStartDate), 'MMM dd, yyyy')} to {format(new Date(appliedEndDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 glass-light text-white rounded-xl hover:bg-white/10 transition-all font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Churn Dashboard</span>
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

          {/* Date Range Filter */}
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApplyFilter={handleApplyFilter}
            onReset={handleReset}
          />

          {/* Executive Summary - Cross Analysis */}
          <div className="glass rounded-2xl p-6 mb-8 border-l-4 border-purple-main shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              Executive Summary - Churn vs Reactivation Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-light rounded-lg p-4">
                <p className="text-white/60 text-sm">Total Churns</p>
                <p className="text-3xl font-bold text-coral-main">{crossAnalysis.totalChurns}</p>
              </div>
              <div className="glass-light rounded-lg p-4">
                <p className="text-white/60 text-sm">Total Reactivations</p>
                <p className="text-3xl font-bold text-green-400">{crossAnalysis.totalReactivations}</p>
              </div>
              <div className="glass-light rounded-lg p-4">
                <p className="text-white/60 text-sm">Matched Reactivations</p>
                <p className="text-3xl font-bold gradient-text">{crossAnalysis.reactivatedFromChurns}</p>
                <p className="text-xs text-white/50 mt-1">Clients who churned & returned</p>
              </div>
              <div className="glass-light rounded-lg p-4">
                <p className="text-white/60 text-sm">Reactivation Rate</p>
                <p className="text-3xl font-bold text-purple-main">{crossAnalysis.reactivationRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Avg Days to Reactivation"
              value={Math.round(crossAnalysis.averageDaysToReactivation)}
              subtitle="Time for clients to return"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Top Churn Category"
              value={churnAnalysis.topChurnCategories[0]?.category || 'N/A'}
              subtitle={`${churnAnalysis.topChurnCategories[0]?.count || 0} churns`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <MetricCard
              title="MRR Recovered"
              value={`$${(reactivationAnalysis.totalMRRRecovered || 0).toFixed(0)}`}
              subtitle="From reactivated clients"
              trend="up"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Top Competitor"
              value={churnAnalysis.competitorAnalysis[0]?.competitor || 'N/A'}
              subtitle={`${churnAnalysis.competitorAnalysis[0]?.count || 0} wins`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>

          {/* AI Insights */}
          <div className="mb-8">
            <AIInsightsEnhanced insights={aiInsights} isLoading={aiLoading} />
          </div>

          {/* Boss Requirements Section 1: Main Categories & Churn Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
              title="📋 Main Service Categories Provided"
              description="Categories of services from churned clients"
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={churnAnalysis.topServiceCategories.slice(0, 8)}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={(entry) => `${entry.category.substring(0, 15)}... (${entry.percentage.toFixed(0)}%)`}
                    labelLine={{stroke: '#ffffff'}}
                    style={{fill: '#ffffff'}}
                  >
                    {churnAnalysis.topServiceCategories.slice(0, 8).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...darkChartStyles.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="❌ Main Churn Categories"
              description="Primary reasons for customer churn"
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={churnAnalysis.topChurnCategories.slice(0, 8)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={120} {...darkChartStyles.axis} />
                  <YAxis {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Bar dataKey="count" fill="url(#churnGradient)" />
                  <defs>
                    <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Monthly Churn Categories Stacked Chart */}
          {churnAnalysis.monthlyChurnByCategory && churnAnalysis.monthlyChurnByCategory.length > 0 && (
            <div className="mb-8">
              <ChartCard
                title="📊 Monthly Churn Categories Breakdown"
                description="Churn categories tracked month-by-month"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={churnAnalysis.monthlyChurnByCategory}>
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
                    {churnAnalysis.topChurnCategories.slice(0, 5).map((cat: any, index: number) => (
                      <Bar 
                        key={cat.category} 
                        dataKey={cat.category} 
                        stackId="churn" 
                        fill={brandColors[index % brandColors.length]}
                        name={cat.category.length > 25 ? cat.category.substring(0, 22) + '...' : cat.category}
                      />
                    ))}
                    {churnAnalysis.monthlyChurnByCategory.some((m: any) => m.Other) && (
                      <Bar dataKey="Other" stackId="churn" fill="#6b7280" name="Other" />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {/* Boss Requirements Section 2: When Clients Come Back & Time Analysis */}
          <ChartCard
            title="⏱️ Reactivation Timeline - When Do Clients Come Back?"
            description="Distribution of days taken for clients to reactivate after churning"
          >
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid {...darkChartStyles.cartesianGrid} />
                <XAxis 
                  type="number" 
                  dataKey="daysToReactivate" 
                  name="Days to Reactivate" 
                  label={{ value: 'Days After Churn', position: 'insideBottom', offset: -5, style: {fill: '#ffffff'} }}
                  {...darkChartStyles.axis}
                />
                <YAxis 
                  type="number" 
                  dataKey="mrrRecovered" 
                  name="MRR Recovered" 
                  label={{ value: 'MRR ($)', angle: -90, position: 'insideLeft', style: {fill: '#ffffff'} }}
                  {...darkChartStyles.axis}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  {...darkChartStyles.tooltip}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass rounded-lg p-3">
                          <p className="text-white font-bold text-sm">{data.clientName}</p>
                          <p className="text-white/80 text-xs">Days: {data.daysToReactivate}</p>
                          <p className="text-white/80 text-xs">MRR: ${data.mrrRecovered}</p>
                          <p className="text-purple-main text-xs">Churn: {data.churnCategory}</p>
                          <p className="text-green-400 text-xs">Reason: {data.reactivationReason}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  name="Reactivated Clients" 
                  data={crossAnalysis.matchedClients} 
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Boss Requirements Section 3: Correlation Between Churn Category and Reactivation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
            <ChartCard
              title="🔗 Correlation: Churn Category → Reactivation"
              description="Which churn categories lead to reactivations"
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={crossAnalysis.reactivationsByChurnCategory}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={120} {...darkChartStyles.axis} />
                  <YAxis {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Legend {...darkChartStyles.legend} />
                  <Bar dataKey="count" fill="url(#correlationGradient)" name="Reactivations" />
                  <defs>
                    <linearGradient id="correlationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="📊 Churn vs Reactivation Rate by Category"
              description="Comparison of churn volume and reactivation success"
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={churnAnalysis.reactivationByChurnCategory.slice(0, 8)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="churnCategory" angle={-45} textAnchor="end" height={120} {...darkChartStyles.axis} />
                  <YAxis {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Legend {...darkChartStyles.legend} />
                  <Bar dataKey="totalCount" fill="#f43f5e" name="Total Churns" />
                  <Bar dataKey="reactivationRate" fill="#34d399" name="Reactivation Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Boss Requirements Section 4: Competitors Winning */}
          {churnAnalysis.competitorAnalysis.length > 0 && (
            <ChartCard
              title="🏆 Competitors Winning - Price & MRR Analysis"
              description="Competitors who won churned accounts with associated financials"
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
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                        Market Share %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {churnAnalysis.competitorAnalysis.map((competitor: any, index: number) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-main font-semibold">
                          {((competitor.count / crossAnalysis.totalChurns) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          )}

          {/* Matched Clients Table */}
          {crossAnalysis.matchedClients.length > 0 && (
            <div className="mt-8">
              <ChartCard
                title="🔄 Detailed Client Journey: Churn → Reactivation"
                description={`${crossAnalysis.matchedClients.length} clients who churned and came back`}
              >
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full">
                    <thead className="sticky top-0 glass">
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">Client</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">Churn Date</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">Reactivation Date</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">Days</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">Churn Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">Reactivation Reason</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">MRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crossAnalysis.matchedClients.map((client: any, index: number) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-sm text-white font-medium">{client.clientName}</td>
                          <td className="px-4 py-3 text-sm text-coral-main">{format(new Date(client.estimatedChurnDate), 'MMM dd, yyyy')}</td>
                          <td className="px-4 py-3 text-sm text-green-400">{format(new Date(client.reactivationDate), 'MMM dd, yyyy')}</td>
                          <td className="px-4 py-3 text-sm text-purple-main font-bold">{client.daysToReactivate}</td>
                          <td className="px-4 py-3 text-sm text-white/70 max-w-xs truncate">{client.churnCategory}</td>
                          <td className="px-4 py-3 text-sm text-white/70 max-w-xs truncate">{client.reactivationReason}</td>
                          <td className="px-4 py-3 text-sm text-white/70">${client.mrrRecovered.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-white/40 border-t border-white/10 pt-8">
            <p className="flex items-center justify-center space-x-2 mb-2">
              <span className="w-2 h-2 bg-gradient-brand rounded-full animate-pulse"></span>
              <span>Powered by Google Gemini 2.5 Flash | Data from Google Sheets</span>
            </p>
            <p className="text-xs text-white/30">Report generated: {new Date().toLocaleString()}</p>
          </footer>
        </div>
      </main>
    </>
  );
}

