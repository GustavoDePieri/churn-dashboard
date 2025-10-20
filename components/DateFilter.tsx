import React from 'react';

export type DatePeriod = 
  | 'all-time'
  | 'today'
  | 'yesterday'
  | 'this-week'
  | 'last-week'
  | 'this-month'
  | 'last-month'
  | 'last-30-days'
  | 'last-90-days'
  | 'last-180-days'
  | 'this-year'
  | 'custom-range';

interface DateFilterProps {
  selectedPeriod: DatePeriod;
  onPeriodChange: (period: DatePeriod) => void;
}

export default function DateFilter({ selectedPeriod, onPeriodChange }: DateFilterProps) {
  const periods: { value: DatePeriod; label: string }[] = [
    { value: 'all-time', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-30-days', label: 'Last 30 Days' },
    { value: 'last-90-days', label: 'Last 90 Days' },
    { value: 'last-180-days', label: 'Last 180 Days' },
    { value: 'this-year', label: 'This Year' },
    { value: 'custom-range', label: 'Custom Range' },
  ];

  return (
    <div className="glass-light rounded-xl p-4 mb-6">
      <label htmlFor="date-period" className="block text-sm font-medium text-white/80 mb-2">
        Date Period
      </label>
      <select
        id="date-period"
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value as DatePeriod)}
        className="w-full px-4 py-3 glass-light rounded-xl text-white bg-navy-dark/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-main focus:border-transparent transition-all cursor-pointer hover:bg-navy-dark/70"
      >
        {periods.map((period) => (
          <option 
            key={period.value} 
            value={period.value}
            className="bg-navy-dark text-white py-2"
          >
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
}

