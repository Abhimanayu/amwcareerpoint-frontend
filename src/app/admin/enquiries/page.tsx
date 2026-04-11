'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import { getEnquiries, updateEnquiry } from '@/lib/enquiries';
import { handleApiError } from '@/lib/handleApiError';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 15, sort: '-createdAt' };
      if (statusFilter) params.status = statusFilter;
      const res = await getEnquiries(params);
      const items = Array.isArray(res.data) ? res.data : res.data?.enquiries || res.enquiries || [];
      setEnquiries(items);
      const total = res.total ?? res.data?.total ?? res.pagination?.total ?? items.length;
      const resLimit = res.limit ?? res.data?.limit ?? 15;
      const pg = res.page ?? res.data?.page ?? res.pagination?.page ?? page;
      setPagination({ page: pg, totalPages: Math.ceil(total / resLimit) || 1, total });
    } catch {
      // silent
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(true);
    try {
      await updateEnquiry(id, { status });
      fetchData(pagination.page);
      if (selected && (selected._id as string) === id) {
        setSelected({ ...selected, status });
      }
    } catch (err) {
      alert(handleApiError(err));
    }
    setUpdating(false);
  };

  const handleNotesUpdate = async (id: string, notes: string) => {
    try {
      await updateEnquiry(id, { notes });
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-8 h-8 border-2 border-[#F26419] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-sm text-gray-500">No enquiries found</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Enquiry list */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {enquiries.map((enq) => (
                  <button
                    key={enq._id as string}
                    onClick={() => setSelected(enq)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors ${selected?._id === enq._id ? 'bg-[#F26419]/5 border-l-2 border-l-[#F26419]' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F26419]/10 flex items-center justify-center text-[#F26419] text-sm font-bold shrink-0">
                      {(enq.name as string)?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">{enq.name as string}</span>
                        <StatusBadge status={enq.status as string} />
                      </div>
                      <div className="text-xs text-gray-500 truncate">{String(enq.email ?? '')} • {String(enq.phone ?? '')}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {enq.source ? <span className="mr-2">{String(enq.source)}</span> : null}
                        {enq.createdAt ? new Date(enq.createdAt as string).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
                  <div className="flex gap-1">
                    <button onClick={() => fetchData(pagination.page - 1)} disabled={pagination.page <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Prev</button>
                    <button onClick={() => fetchData(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              )}
            </div>

            {/* Detail panel */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {selected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-[#F26419]/10 flex items-center justify-center text-[#F26419] text-lg font-bold">
                      {(selected.name as string)?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selected.name as string}</div>
                      <StatusBadge status={selected.status as string} />
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div><span className="text-gray-500 block text-xs mb-0.5">Email</span>{String(selected.email ?? '')}</div>
                    <div><span className="text-gray-500 block text-xs mb-0.5">Phone</span>{String(selected.phone ?? '')}</div>
                    {selected.interestedCountry ? <div><span className="text-gray-500 block text-xs mb-0.5">Interested Country</span>{String(selected.interestedCountry)}</div> : null}
                    {selected.source ? <div><span className="text-gray-500 block text-xs mb-0.5">Source</span>{String(selected.source)}</div> : null}
                    {selected.message ? <div><span className="text-gray-500 block text-xs mb-0.5">Message</span><p className="text-gray-700">{String(selected.message)}</p></div> : null}
                    <div><span className="text-gray-500 block text-xs mb-0.5">Date</span>{selected.createdAt ? new Date(selected.createdAt as string).toLocaleString() : '—'}</div>
                  </div>

                  {/* Status update */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="block text-xs text-gray-500 mb-1.5">Update Status</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {['new', 'contacted', 'converted', 'closed'].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(selected._id as string, s)}
                          disabled={updating || selected.status === s}
                          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                            selected.status === s
                              ? 'bg-[#F26419] text-white'
                              : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                          } disabled:opacity-50`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="pt-3 border-t border-gray-100">
                    <label className="block text-xs text-gray-500 mb-1.5">Notes</label>
                    <textarea
                      rows={3}
                      defaultValue={(selected.notes as string) || ''}
                      onBlur={(e) => handleNotesUpdate(selected._id as string, e.target.value)}
                      placeholder="Add notes about this enquiry..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-gray-400 py-12">
                  Select an enquiry to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
