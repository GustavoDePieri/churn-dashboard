import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function ChartCard({ title, children, description }: ChartCardProps) {
  return (
    <div className="glass rounded-2xl p-6 shadow-xl hover:shadow-purple-main/20 transition-all duration-300">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-white/60">{description}</p>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}

