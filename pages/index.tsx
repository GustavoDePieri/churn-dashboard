import React, { useEffect, useState } from 'react';
import Head from 'next/head';
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
import AIInsights from '@/components/AIInsights';
import LoadingSpinner from '@/components/LoadingSpinner';

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6'];

export default function Home() {
  const [data, setData] = useState<ChurnAnalysis | null>(null);
  const [productFeedback, setProductFeedback] = useState<{ insights: string; feedbackCount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [churnResponse, feedbackResponse] = await Promise.all([
          fetch('/api/churn-data'),
          fetch('/api/product-feedback'),
        ]);

        if (!churnResponse.ok) {
          throw new Error('Failed to fetch churn data');
        }

        const churnData = await churnResponse.json();
        setData(churnData);

        if (feedbackResponse.ok) {
          const feedbackData = await feedbackResponse.json();
          setProductFeedback(feedbackData);
        }
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

      <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AI Churn Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Monthly churn analysis powered by Google Gemini AI
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Churns"
              value={data.totalChurns}
              subtitle="Total customers churned"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
            <AIInsights insights={data.aiInsights} />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Churn Categories */}
            <ChartCard
              title="Top Churn Categories"
              description="Main reasons for customer churn"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topChurnCategories.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" />
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
                    labelLine={false}
                  >
                    {data.topServiceCategories.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="churns" stroke="#ef4444" strokeWidth={2} name="Churns" />
                  <Line type="monotone" dataKey="reactivations" stroke="#10b981" strokeWidth={2} name="Reactivations" />
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
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="churnCategory" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis label={{ value: 'Reactivation Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="reactivationRate" fill="#10b981" />
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
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Competitor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Churns Won
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total MRR Lost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.competitorAnalysis.map((competitor, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {competitor.competitor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {competitor.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${competitor.totalMRR.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                title="Product Feedback Insights"
                description={`Analysis of ${productFeedback.feedbackCount} feedback entries from churned customers`}
              >
                <div className="prose prose-sm max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {productFeedback.insights}
                  </div>
                </div>
              </ChartCard>
            </div>
          )}

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

