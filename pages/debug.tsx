import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function DebugPage() {
  const [debugData, setDebugData] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebugData() {
      try {
        const [debugRes, summaryRes] = await Promise.all([
          fetch('/api/debug-summary'),
          fetch('/api/churn-summary'),
        ]);

        if (debugRes.ok) {
          const data = await debugRes.json();
          setDebugData(data);
        }

        if (summaryRes.ok) {
          const data = await summaryRes.json();
          setSummaryData(data);
        } else {
          const errorData = await summaryRes.json();
          setError(`churn-summary failed: ${errorData.error}`);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    fetchDebugData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading debug data...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Debug - Churn Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">🔍 Debug Dashboard</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200 font-mono text-sm">{error}</p>
            </div>
          )}

          {/* Summary Data */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">📊 /api/churn-summary Result</h2>
            {summaryData ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-black/20 p-3 rounded">
                  <span className="text-gray-300">Average Reactivation Days:</span>
                  <span className={`font-bold text-xl ${summaryData.averageReactivationDays === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {summaryData.averageReactivationDays} days
                  </span>
                </div>
                <div className="flex items-center justify-between bg-black/20 p-3 rounded">
                  <span className="text-gray-300">Total Churns:</span>
                  <span className="text-white font-bold">{summaryData.totalChurns}</span>
                </div>
              </div>
            ) : (
              <p className="text-red-400">❌ churn-summary endpoint failed</p>
            )}
          </div>

          {/* Debug Data */}
          {debugData && (
            <>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">🎯 Calculated Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded">
                    <div className="text-gray-400 text-sm">Average Days</div>
                    <div className={`text-3xl font-bold ${debugData.metrics.averageDaysToReactivation === 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {debugData.metrics.averageDaysToReactivation}
                    </div>
                  </div>
                  <div className="bg-black/20 p-4 rounded">
                    <div className="text-gray-400 text-sm">Valid Calculations</div>
                    <div className="text-3xl font-bold text-white">{debugData.metrics.validCalculations}</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded">
                    <div className="text-gray-400 text-sm">Total Reactivations</div>
                    <div className="text-3xl font-bold text-white">{debugData.metrics.totalReactivations}</div>
                  </div>
                  <div className="bg-black/20 p-4 rounded">
                    <div className="text-gray-400 text-sm">Reactivation Rate</div>
                    <div className="text-3xl font-bold text-white">{debugData.metrics.reactivationRate}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">📋 Data Status</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Churn Records</h3>
                    <div className="bg-black/20 p-3 rounded text-gray-300">
                      Total: {debugData.churnRecords.total}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Reactivation Records</h3>
                    <div className="bg-black/20 p-3 rounded space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Total:</span>
                        <span className="font-bold">{debugData.reactivationRecords.total}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>With Churn Date:</span>
                        <span className={`font-bold ${debugData.reactivationRecords.withChurnDate === 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {debugData.reactivationRecords.withChurnDate}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>With Reactivation Date:</span>
                        <span className="font-bold">{debugData.reactivationRecords.withReactivationDate}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>With BOTH Dates:</span>
                        <span className={`font-bold ${debugData.reactivationRecords.withBothDates === 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {debugData.reactivationRecords.withBothDates}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {debugData.reactivationRecords.samples.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">📝 Sample Records (with both dates)</h2>
                  <div className="space-y-2">
                    {debugData.reactivationRecords.samples.map((sample: any, i: number) => (
                      <div key={i} className="bg-black/20 p-3 rounded text-sm">
                        <div className="text-white font-semibold">{sample.accountName}</div>
                        <div className="text-gray-400">
                          Churned: {sample.churnDate} → Reactivated: {sample.reactivationDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`${debugData.diagnosis.includes('⚠️') ? 'bg-red-500/20 border-red-500' : 'bg-green-500/20 border-green-500'} border rounded-xl p-6`}>
                <h2 className="text-2xl font-bold text-white mb-2">🔬 Diagnosis</h2>
                <p className="text-lg text-white">{debugData.diagnosis}</p>
              </div>
            </>
          )}

          {/* Raw JSON */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-6">
            <h2 className="text-2xl font-bold text-white mb-4">📄 Raw JSON Data</h2>
            <pre className="bg-black/40 p-4 rounded overflow-auto text-xs text-gray-300 max-h-96">
              {JSON.stringify({ summary: summaryData, debug: debugData }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

