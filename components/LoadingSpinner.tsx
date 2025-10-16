import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-32 h-32">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-main/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent rounded-full animate-spin"
             style={{
               borderImage: 'linear-gradient(120deg, #8b5cf6, #ec4899, #fb7185) 1',
               borderTopColor: '#8b5cf6',
             }}>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-2xl font-bold gradient-text mb-2">Loading Dashboard...</p>
        <p className="text-white/60 text-sm">Fetching churn data from Google Sheets</p>
      </div>
      <div className="flex space-x-2 mt-8">
        <div className="w-3 h-3 bg-purple-main rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-3 h-3 bg-pink-main rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-3 h-3 bg-coral-main rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
    </div>
  );
}

