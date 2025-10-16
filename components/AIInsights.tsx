import React from 'react';

interface AIInsightsProps {
  insights: string;
  isLoading?: boolean;
}

export default function AIInsights({ insights, isLoading }: AIInsightsProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg shadow-md p-6 border border-primary-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="animate-pulse w-8 h-8 bg-primary-300 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900">AI Generating Insights...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg shadow-md p-6 border border-primary-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
          AI
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
      </div>
      <div className="prose prose-sm max-w-none">
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {insights}
        </div>
      </div>
    </div>
  );
}

