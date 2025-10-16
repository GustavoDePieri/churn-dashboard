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
import { ReactivationAnalysis } from '@/types';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import AIInsightsEnhanced from '@/components/AIInsightsEnhanced';
import LoadingSpinner from '@/components/LoadingSpinner';
import { darkChartStyles, brandColors } from '@/lib/chartStyles';

const COLORS = brandColors;

export default function Reactivations() {
  const [data, setData] = useState<ReactivationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/reactivations');

        if (!response.ok) {
          throw new Error('Failed to fetch reactivation data');
        }

        const reactivationData = await response.json();
        setData(reactivationData);
        setLoading(false);
        
        // Check if AI insights are loaded
        if (reactivationData.aiInsights && reactivationData.aiInsights.length > 10) {
          setAiLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
        setAiLoading(false);
      }
    }

    fetchData();
    
    // Simulate AI finishing
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
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-gradient-cta text-white rounded-xl hover:scale-105 transition-all font-bold">
            ← Back to Churn Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reactivations Dashboard - AI Analysis</title>
        <meta name="description" content="AI-powered reactivation analysis dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center space-x-2 text-purple-main hover:text-pink-main mb-6 transition-colors group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Churn Dashboard</span>
            </Link>
            <h1 className="text-5xl font-bold gradient-text mb-3">
              Reactivations Dashboard
            </h1>
            <p className="text-xl text-white/70">
              Customer reactivation analysis powered by Google Gemini 2.5 Flash
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Total Reactivations"
              value={data.totalReactivations}
              subtitle="Customers who returned"
              trend="up"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="MRR Recovered"
              value={`$${data.totalMRRRecovered.toFixed(0)}`}
              subtitle="Total monthly recurring revenue"
              trend="up"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Avg MRR per Reactivation"
              value={`$${data.averageMRR.toFixed(0)}`}
              subtitle="Average revenue recovered"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>

          {/* AI Insights */}
          <div className="mb-8">
            <AIInsightsEnhanced insights={data.aiInsights} isLoading={aiLoading} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Reactivation Reasons */}
            <ChartCard
              title="Top Reactivation Reasons"
              description="Why customers came back"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topReactivationReasons.slice(0, 8)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} {...darkChartStyles.axis} />
                  <YAxis {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Bar dataKey="count" fill="url(#reactivationBarGradient)" />
                  <defs>
                    <linearGradient id="reactivationBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* CS Path Distribution */}
            <ChartCard
              title="Customer Success Path Distribution"
              description="Reactivations by CS approach"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.reactivationsByCSPath}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.category} (${entry.percentage.toFixed(0)}%)`}
                    labelLine={{stroke: '#ffffff'}}
                    style={{fill: '#ffffff'}}
                  >
                    {data.reactivationsByCSPath.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...darkChartStyles.tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Monthly Trend */}
            <ChartCard
              title="Monthly Reactivation Trend"
              description="Reactivations and MRR recovered over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyReactivations}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="month" {...darkChartStyles.axis} />
                  <YAxis yAxisId="left" {...darkChartStyles.axis} />
                  <YAxis yAxisId="right" orientation="right" {...darkChartStyles.axis} />
                  <Tooltip {...darkChartStyles.tooltip} />
                  <Legend {...darkChartStyles.legend} />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="#34d399" strokeWidth={3} name="Reactivations" dot={{fill: '#34d399', r: 4}} />
                  <Line yAxisId="right" type="monotone" dataKey="mrr" stroke="#8b5cf6" strokeWidth={3} name="MRR ($)" dot={{fill: '#8b5cf6', r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Reactivation Reasons Table */}
            <ChartCard
              title="Detailed Reactivation Breakdown"
              description="Complete list of reactivation reasons"
            >
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full">
                  <thead className="sticky top-0 glass">
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">
                        Count
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topReactivationReasons.map((reason, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-sm text-white font-medium">
                          {reason.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-400 font-semibold">
                          {reason.count}
                        </td>
                        <td className="px-4 py-3 text-sm text-white/70">
                          {reason.percentage.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
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
