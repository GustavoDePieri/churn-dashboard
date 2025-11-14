import React, { useState } from 'react';
import { ChurnRecord } from '@/types';

interface ChurnClientListProps {
  records: ChurnRecord[];
  period: string;
}

const ChurnClientList: React.FC<ChurnClientListProps> = ({ records, period }) => {
  const [sortField, setSortField] = useState<keyof ChurnRecord>('deactivationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Sort records
  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Filter records by search term
  const filteredRecords = sortedRecords.filter(record => 
    record.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.churnCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.competitor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.serviceCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to page 1 when search or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof ChurnRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: keyof ChurnRecord }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatMRR = (mrr?: number) => {
    if (mrr === undefined || mrr === null) return 'N/A';
    return `$${mrr.toLocaleString()}`;
  };

  return (
    <div className="glass rounded-2xl mb-8">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all rounded-2xl"
      >
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-purple-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">Churned Clients</h2>
            <p className="text-white/60 text-sm mt-1">
              {filteredRecords.length} client{filteredRecords.length !== 1 ? 's' : ''} {period}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-white/60 font-medium">
            {isExpanded ? 'Hide Details' : 'View Details'}
          </span>
          <svg 
            className={`w-6 h-6 text-purple-main transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pl-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-main/50 focus:border-purple-main/50 transition-all"
              />
              <svg className="w-5 h-5 text-white/40 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-white/60 text-xs font-medium mb-1">Total Clients</div>
              <div className="text-white text-xl font-bold">{filteredRecords.length}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-white/60 text-xs font-medium mb-1">Total MRR Lost</div>
              <div className="text-coral-main text-xl font-bold">
                ${filteredRecords.reduce((sum, r) => sum + (r.mrr || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-white/60 text-xs font-medium mb-1">Avg MRR per Client</div>
              <div className="text-white text-xl font-bold">
                ${Math.round(filteredRecords.reduce((sum, r) => sum + (r.mrr || 0), 0) / Math.max(filteredRecords.length, 1)).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-white/60 text-xs font-medium mb-1">Avg Customer Lifetime</div>
              <div className="text-white text-xl font-bold">
                {Math.round(filteredRecords.reduce((sum, r) => sum + (r.monthsBeforeChurn || 0), 0) / Math.max(filteredRecords.length, 1))} months
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:text-purple-main transition-colors"
                    onClick={() => handleSort('clientName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Account Name</span>
                      <SortIcon field="clientName" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:text-purple-main transition-colors"
                    onClick={() => handleSort('csGroup')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>CS Group</span>
                      <SortIcon field="csGroup" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:text-purple-main transition-colors"
                    onClick={() => handleSort('churnCategory')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Churn Category</span>
                      <SortIcon field="churnCategory" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:text-purple-main transition-colors"
                    onClick={() => handleSort('competitor')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Competitor</span>
                      <SortIcon field="competitor" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:text-purple-main transition-colors"
                    onClick={() => handleSort('lastInvoiceMRR')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Last Invoice MRR</span>
                      <SortIcon field="lastInvoiceMRR" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-bold text-white/80 uppercase tracking-wider cursor-pointer hover:text-purple-main transition-colors"
                    onClick={() => handleSort('deactivationDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Deactivation Date</span>
                      <SortIcon field="deactivationDate" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                      No clients found matching your search
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white group-hover:text-purple-main transition-colors">
                          {record.clientName || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white/70">
                        {record.csGroup || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-coral-main/20 text-coral-main border border-coral-main/30">
                          {record.churnCategory || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/70">
                        {record.competitor || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-coral-main">
                        {formatMRR(record.lastInvoiceMRR)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white/70">
                        {formatDate(record.deactivationDate || '')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-white/60">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredRecords.length)} of {filteredRecords.length} clients
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || 
                             page === totalPages || 
                             Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, idx, arr) => {
                      // Add ellipsis if there's a gap
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && <span className="px-2 text-white/40">...</span>}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition-all font-medium ${
                              currentPage === page
                                ? 'bg-gradient-brand text-white'
                                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                // Export to CSV
                const headers = ['Account Name', 'CS Group', 'Churn Category', 'Competitor', 'Last Invoice MRR', 'Deactivation Date'];
                const csvContent = [
                  headers.join(','),
                  ...filteredRecords.map(r => [
                    `"${r.clientName || ''}"`,
                    `"${r.csGroup || ''}"`,
                    `"${r.churnCategory || ''}"`,
                    `"${r.competitor || ''}"`,
                    r.lastInvoiceMRR || '',
                    r.deactivationDate || ''
                  ].join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `churned-clients-${period}-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all flex items-center space-x-2 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export All ({filteredRecords.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurnClientList;

