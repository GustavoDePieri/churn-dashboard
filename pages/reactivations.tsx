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
import AIInsights from '@/components/AIInsights';
import LoadingSpinner from '@/components/LoadingSpinner';

const COLORS = ['#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#0ea5e9', '#ef4444', '#6366f1', '#14b8a6'];

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600">{error || 'No data available'}</p>
          <Link href="/" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
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

      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
              ← Back to Churn Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Reactivations Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Customer reactivation analysis powered by Google Gemini AI
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
            <AIInsights insights={data.aiInsights} />
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
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
                    labelLine={false}
                  >
                    {data.reactivationsByCSPath.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Reactivations" />
                  <Line yAxisId="right" type="monotone" dataKey="mrr" stroke="#0ea5e9" strokeWidth={2} name="MRR ($)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Reactivation Reasons Table */}
            <ChartCard
              title="Detailed Reactivation Breakdown"
              description="Complete list of reactivation reasons"
            >
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Count
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.topReactivationReasons.map((reason, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {reason.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {reason.count}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
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
          <footer className="mt-12 text-center text-sm text-gray-500">
            <p>Powered by Google Gemini AI | Data from Google Sheets</p>
            <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
          </footer>
        </div>
      </main>
    </>
  );
}

