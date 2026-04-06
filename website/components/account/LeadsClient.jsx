'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function LeadsClient() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient('/api/broker/leads')
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Leads</h1>
        <p className="mt-0.5 text-sm text-slate-500">Inquiries from the public site</p>
      </header>

      <main className="max-w-5xl flex-1 p-6">
        {loading ? (
          <p className="text-slate-600">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              No leads yet. Leads appear here when customers contact you from your property listings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{lead.customerName}</p>
                    <p className="mt-0.5 text-slate-600">{lead.customerPhone}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {lead.propertyId
                        ? (lead.propertyId.title || 'Property') +
                          (lead.propertyId.city ? ` · ${lead.propertyId.city}` : '') +
                          (lead.propertyId.price ? ` · ₹${Number(lead.propertyId.price).toLocaleString()}` : '')
                        : '—'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
