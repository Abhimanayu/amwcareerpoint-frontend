'use client';

import { useState } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  pagination?: { page: number; totalPages: number; total: number };
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  searchable?: boolean;
  searchKeys?: string[];
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  emptyMessage = 'No items found',
  searchable = true,
  searchKeys,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filteredData = search.trim()
    ? data.filter((item) => {
        const keys = searchKeys || columns.map((c) => c.key);
        return keys.some((key) => {
          const val = item[key];
          if (typeof val === 'string') return val.toLowerCase().includes(search.toLowerCase());
          if (typeof val === 'number') return String(val).includes(search);
          return false;
        });
      })
    : data;
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-8 h-8 border-2 border-[#F26419] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500 mt-3">Loading...</p>
      </div>
    );
  }

  if (!filteredData.length && !search) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Search bar */}
      {searchable && data.length > 0 && (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
            />
          </div>
        </div>
      )}

      {/* Mobile card view */}
      <div className="block lg:hidden divide-y divide-gray-100">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No matching results</div>
        ) : filteredData.map((item, i) => (
          <div key={i} className="p-4 space-y-2">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start gap-3">
                <span className="text-xs text-gray-500 font-medium shrink-0">{col.label}</span>
                <span className="text-sm text-gray-900 text-right">
                  {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                </span>
              </div>
            ))}
            {(onEdit || onDelete) && (
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {onEdit && (
                  <button onClick={() => onEdit(item)} className="flex-1 text-sm py-1.5 px-3 bg-[#F26419]/10 text-[#F26419] rounded-lg font-medium">
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(item)} className="flex-1 text-sm py-1.5 px-3 bg-red-50 text-red-600 rounded-lg font-medium">
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr><td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-sm text-gray-500">No matching results</td></tr>
            ) : filteredData.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''}`}>
                    {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right space-x-2">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="text-[#F26419] hover:text-[#FF8040] text-sm font-medium">Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
