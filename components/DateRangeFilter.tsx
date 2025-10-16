import React from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApplyFilter: () => void;
  onReset: () => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onReset,
}: DateRangeFilterProps) {
  const setQuickFilter = (months: number) => {
    const end = endOfMonth(new Date());
    const start = startOfMonth(subMonths(end, months - 1));
    onStartDateChange(format(start, 'yyyy-MM-dd'));
    onEndDateChange(format(end, 'yyyy-MM-dd'));
  };

  return (
    <div className="glass rounded-xl p-6 mb-8 shadow-xl">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-white/80 mb-2">
            📅 From Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-4 py-2 bg-navy-light border border-purple-main/30 rounded-lg text-white focus:ring-2 focus:ring-purple-main focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-white/80 mb-2">
            📅 To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-4 py-2 bg-navy-light border border-purple-main/30 rounded-lg text-white focus:ring-2 focus:ring-purple-main focus:border-transparent outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onApplyFilter}
            className="px-6 py-2 bg-gradient-cta text-white rounded-lg hover:scale-105 transition-all font-bold shadow-lg"
          >
            Apply Filter
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2 glass-light text-white rounded-lg hover:bg-white/10 transition-all font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-white/60 mr-2">Quick filters:</span>
        <button
          onClick={() => setQuickFilter(1)}
          className="px-3 py-1 text-xs glass-light rounded-lg hover:bg-purple-main/20 transition-colors text-white/80"
        >
          Last Month
        </button>
        <button
          onClick={() => setQuickFilter(3)}
          className="px-3 py-1 text-xs glass-light rounded-lg hover:bg-purple-main/20 transition-colors text-white/80"
        >
          Last 3 Months
        </button>
        <button
          onClick={() => setQuickFilter(6)}
          className="px-3 py-1 text-xs glass-light rounded-lg hover:bg-purple-main/20 transition-colors text-white/80"
        >
          Last 6 Months
        </button>
        <button
          onClick={() => setQuickFilter(12)}
          className="px-3 py-1 text-xs glass-light rounded-lg hover:bg-purple-main/20 transition-colors text-white/80"
        >
          Last 12 Months
        </button>
      </div>
    </div>
  );
}

