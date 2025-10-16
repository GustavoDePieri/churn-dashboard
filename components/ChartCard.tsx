import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function ChartCard({ title, children, description }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}

