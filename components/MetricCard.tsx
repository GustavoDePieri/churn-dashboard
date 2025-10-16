import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export default function MetricCard({ title, value, subtitle, icon, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-coral-main',
    neutral: 'text-white/60',
  };

  return (
    <div className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-main/20 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/60 mb-2 group-hover:text-white/80 transition-colors">{title}</p>
          <p className="text-3xl font-bold text-white mb-1 gradient-text">{value}</p>
          {subtitle && (
            <p className={`text-sm mt-2 ${trend ? trendColors[trend] : 'text-white/60'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-gradient-brand rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

