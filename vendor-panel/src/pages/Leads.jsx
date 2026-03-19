import { useState, useEffect } from 'react';
import { api } from '../api/client';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/vendor/leads')
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Leads</h1>
        <p className="text-sm text-slate-500 mt-0.5">Inquiries from the user website (Contact Vendor)</p>
      </header>

      <main className="flex-1 p-6 max-w-5xl">
        {loading ? (
          <p className="text-slate-600">Loading leads...</p>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-600">No leads yet. Leads appear here when customers use &quot;Contact Vendor&quot; on your property listings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{lead.customerName}</p>
                    <p className="text-slate-600 mt-0.5">{lead.customerPhone}</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {lead.propertyId
                        ? (lead.propertyId.title || 'Property') +
                          (lead.propertyId.city ? ` · ${lead.propertyId.city}` : '') +
                          (lead.propertyId.price ? ` · ₹${Number(lead.propertyId.price).toLocaleString()}` : '')
                        : '—'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(lead.createdAt)}</p>
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
