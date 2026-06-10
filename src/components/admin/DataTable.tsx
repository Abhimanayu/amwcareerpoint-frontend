'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
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
  const actionCount = Number(Boolean(onEdit)) + Number(Boolean(onDelete));

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

  const renderCell = (item: T, col: Column<T>) => col.render ? col.render(item) : String(item[col.key] ?? '-');

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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {searchable && data.length > 0 && (
        <div className="px-3 py-3 sm:px-4 border-b border-gray-100">
          <div className="relative max-w-full sm:max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
            />
          </div>
        </div>
      )}

      <div className="block lg:hidden bg-gray-50/70 p-3 space-y-3">
        {filteredData.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-200 p-8 text-center text-sm text-gray-500">No matching results</div>
        ) : filteredData.map((item, i) => (
          <article key={i} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            {columns[0] && (
              <div className="min-w-0 pb-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  {columns[0].label}
                </div>
                <div className="min-w-0 text-sm font-medium text-gray-950">
                  {renderCell(item, columns[0])}
                </div>
              </div>
            )}

            {columns.length > 1 && (
              <dl className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-3 sm:grid-cols-2">
                {columns.slice(1).map((col) => (
                  <div key={col.key} className="min-w-0 rounded-lg bg-gray-50 px-3 py-2">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {col.label}
                    </dt>
                    <dd className="mt-1 min-w-0 text-sm font-medium text-gray-900">
                      {renderCell(item, col)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {(onEdit || onDelete) && (
              <div className={`grid gap-2 pt-3 mt-3 border-t border-gray-100 ${actionCount === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {onEdit && (
                  <button onClick={() => onEdit(item)} className="text-sm py-2.5 px-3 bg-[#F26419]/10 text-[#F26419] rounded-lg font-semibold hover:bg-[#F26419]/15 transition-colors">
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(item)} className="text-sm py-2.5 px-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[760px] table-auto">
          <colgroup>
            {columns.map((col, i) => (
              <col key={col.key} style={{ width: i === 0 ? '44%' : `${Math.max(14, Math.floor(44 / Math.max(columns.length - 1, 1)))}%` }} />
            ))}
            {(onEdit || onDelete) && <col style={{ width: actionCount === 2 ? '140px' : '92px' }} />}
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-sm text-gray-500">
                  No matching results
                </td>
              </tr>
            ) : filteredData.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={col.key} className={`px-4 py-3 align-middle text-sm text-gray-700 ${colIdx === 0 ? 'min-w-[260px]' : 'max-w-[190px]'} ${col.className || ''}`}>
                    <div className={`min-w-0 ${colIdx === 0 ? '' : 'truncate'}`}>
                      {renderCell(item, col)}
                    </div>
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="rounded-lg px-2.5 py-1.5 text-[#F26419] hover:bg-[#F26419]/10 text-sm font-semibold whitespace-nowrap transition-colors">Edit</button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className="rounded-lg px-2.5 py-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 text-sm font-semibold whitespace-nowrap transition-colors">Delete</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 px-4 py-3 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
