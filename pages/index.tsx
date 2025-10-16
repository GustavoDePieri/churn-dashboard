import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

const COLORS = brandColors;

export default function Home() {
  const [data, setData] = useState<ChurnAnalysis | null>(null);
  const [productFeedback, setProductFeedback] = useState<{ insights: string; feedbackCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // First, fetch data WITHOUT AI insights to show dashboard quickly
    async function fetchInitialData() {
      try {
        const churnResponse = await fetch('/api/churn-data');

        if (!churnResponse.ok) {
          throw new Error('Failed to fetch churn data');
        }

        const churnData = await churnResponse.json();
        setData(churnData);
        setLoading(false);
        
        // Check if AI insights are already loaded
        if (churnData.aiInsights && churnData.aiInsights.length > 10) {
          setAiLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
        setAiLoading(false);
      }
    }

    // Fetch product feedback separately (non-blocking)
    async function fetchProductFeedback() {
      try {
        const feedbackResponse = await fetch('/api/product-feedback');
        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setProductFeedback(feedbackData);
        }
      } catch (err) {
        // Silent fail for product feedback
      }
    }

    fetchInitialData();
    fetchProductFeedback();

    // Simulate AI finishing (in reality, it loads with the data)
    const aiTimeout = setTimeout(() => setAiLoading(false), 2000);
    return () => clearTimeout(aiTimeout);
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
        <title>AI Churn Dashboard - Monthly Report</title>
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
                  AI Churn Dashboard
                </h1>
                <p className="text-xl text-white/70">
                  Monthly churn analysis powered by Google Gemini 2.5 Flash
                </p>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/monthly-report"
                  className="px-8 py-4 bg-gradient-brand text-white rounded-xl hover:scale-105 transition-all font-bold shadow-xl hover:shadow-purple-main/50 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Monthly Report</span>
                </Link>
                <Link 
                  href="/reactivations"
                  className="px-8 py-4 bg-gradient-cta text-white rounded-xl hover:scale-105 transition-all font-bold shadow-xl hover:shadow-pink-main/50 flex items-center space-x-2"
                >
                  <span>Reactivations</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {data.executiveSummary && (
            <div className="mb-8 glass rounded-2xl p-6 border-l-4 border-purple-main shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Executive Summary
              </h2>
              <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap pl-13">{data.executiveSummary}</p>
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <MetricCard
              title="Total Churns"
              value={data.totalChurns}
              subtitle="Total customers churned"
              trend="down"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Total MRR Lost"
              value={`$${data.totalMRRLost.toFixed(0)}`}
              subtitle={`Avg $${data.averageMRRPerChurn.toFixed(0)} per churn`}
              trend="down"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Avg Reactivation Time"
              value={`${data.averageReactivationDays.toFixed(0)} days`}
              subtitle="Time to return"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Top Churn Reason"
              value={data.topChurnCategories[0]?.category || 'N/A'}
              subtitle={`${data.topChurnCategories[0]?.count || 0} cases (${data.topChurnCategories[0]?.percentage.toFixed(1) || 0}%)`}
              trend="down"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <MetricCard
              title="Competitors Identified"
              value={data.competitorAnalysis.length}
              subtitle="Active competitors"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
          </div>

          {/* AI Insights */}
          <div className="mb-8">
            <AIInsightsEnhanced insights={data.aiInsights} isLoading={aiLoading} />
          </div>

          {/* Client Feedback Categories - Prominent Display */}
          {data.clientFeedbackCategories && data.clientFeedbackCategories.length > 0 && (
            <div className="mb-8">
              <ChartCard
                title="🗣️ Client-Reported Feedback Categories"
                description={`Analysis of ${data.clientFeedbackCategories.reduce((sum, c) => sum + c.count, 0)} feedback entries - Key themes from customer voices`}
              >
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data.clientFeedbackCategories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45} 
                      textAnchor="end" 
                      height={120} 
                      fontSize={12} 
                      stroke="#ffffff" 
                      tick={{fill: '#ffffff'}}
                    />
                    <YAxis 
                      label={{ value: 'Number of Mentions', angle: -90, position: 'insideLeft', style: {fill: '#ffffff'} }} 
                      stroke="#ffffff" 
                      tick={{fill: '#ffffff'}}
                    />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#1a0d2e', border: '1px solid #8b5cf6', borderRadius: '8px'}}
                      labelStyle={{color: '#ffffff'}}
                    />
                    <Legend wrapperStyle={{color: '#ffffff'}} />
                    <Bar dataKey="count" fill="url(#colorGradient)" name="Feedback Mentions" />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9}/>
                        <stop offset="100%" stopColor="#fb7185" stopOpacity={0.7}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6 p-4 glass-light border-l-4 border-yellow-500 rounded-xl">
                  <p className="text-sm text-white/90">
                    <strong className="text-yellow-400">📊 Product Feedback Integration:</strong> These insights have been automatically synced for cross-analysis with the Product Feedback Dashboard.
                  </p>
                </div>
              </ChartCard>
            </div>
          )}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Churn Categories */}
            <ChartCard
              title="Top Churn Categories"
              description="Main reasons for customer churn"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topChurnCategories.slice(0, 8)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} {...darkChartStyles.axis} />
                  <YAxis {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Bar dataKey="count" fill="url(#churnGradient)" />
                  <defs>
                    <linearGradient id="churnGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Service Categories */}
            <ChartCard
              title="Service Categories Distribution"
              description="Categories of services from churned clients"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.topServiceCategories.slice(0, 8)}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.category} (${entry.percentage.toFixed(0)}%)`}
                    labelLine={{stroke: '#ffffff'}}
                    style={{fill: '#ffffff'}}
                  >
                    {data.topServiceCategories.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...darkChartStyles.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Monthly Trend */}
            <ChartCard
              title="Monthly Churn & Reactivation Trend"
              description="Churns vs reactivations over time"
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

            {/* Reactivation by Category */}
            <ChartCard
              title="Reactivation Rate by Churn Category"
              description="Correlation between churn reason and return rate"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.reactivationByChurnCategory.slice(0, 8)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="churnCategory" angle={-45} textAnchor="end" height={100} {...darkChartStyles.axis} />
                  <YAxis label={{ value: 'Reactivation Rate (%)', angle: -90, position: 'insideLeft', style: {fill: '#ffffff'} }} {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Bar dataKey="reactivationRate" fill="url(#reactivationGradient)" />
                  <defs>
                    <linearGradient id="reactivationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Competitor Analysis Table */}
          {data.competitorAnalysis.length > 0 && (
            <div className="mb-8">
              <ChartCard
                title="Competitor Analysis"
                description="Competitors winning customers and associated MRR/pricing"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                          Competitor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">
                          Churns Won
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
                      {data.competitorAnalysis.map((competitor, index) => (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                            {competitor.competitor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-coral-main font-medium">
                            {competitor.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
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

          {/* Product Feedback Insights */}
          {productFeedback && productFeedback.feedbackCount > 0 && (
            <div className="mb-8">
              <ChartCard
                title="📝 Product Feedback Insights"
                description={`Analysis of ${productFeedback.feedbackCount} feedback entries from churned customers`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-white/80 whitespace-pre-wrap leading-relaxed">
                    {productFeedback.insights}
                  </div>
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
            <p className="text-xs text-white/30">Last updated: {new Date().toLocaleString()}</p>
          </footer>
        </div>
      </main>
    </>
  );
}

