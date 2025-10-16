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
import { ReactivationAnalysis } from '@/types';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { darkChartStyles } from '@/lib/chartStyles';

export default function Reactivations() {
  const [data, setData] = useState<ReactivationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Reactivations Dashboard - Ontop</title>
        <meta name="description" content="Customer reactivation analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex gap-3 mb-6">
              <Link href="/" className="inline-flex items-center space-x-2 text-purple-main hover:text-pink-main transition-colors group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/monthly-report" className="inline-flex items-center space-x-2 text-purple-main hover:text-pink-main transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Full Report</span>
              </Link>
            </div>
            <h1 className="text-5xl font-bold gradient-text mb-3">
              Reactivations
            </h1>
            <p className="text-xl text-white/70">
              Customers who came back
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              subtitle="Monthly recurring revenue"
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
              subtitle="Average revenue per client"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>

          {/* Reactivation Reasons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard
              title="✅ Top Reactivation Reasons"
              description="Why customers came back"
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.topReactivationReasons.slice(0, 6)}>
                  <CartesianGrid {...darkChartStyles.cartesianGrid} />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={120} {...darkChartStyles.axis} />
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

            <ChartCard
              title="📈 Monthly Reactivation Trend"
              description="Reactivations and MRR over time"
            >
              <ResponsiveContainer width="100%" height={350}>
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
