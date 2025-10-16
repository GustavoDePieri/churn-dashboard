import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-6 text-lg font-medium text-gray-700">Loading churn data...</p>
      <p className="mt-2 text-sm text-gray-500">Analyzing with AI</p>
    </div>
  );
}

