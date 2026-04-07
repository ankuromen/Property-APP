import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch } from '../api/adminClient';
import { useAdminAuth } from '../context/AdminAuthContext';

const BASE = '/api/admin/plans';

const CYCLES = [
  { value: 'none', label: 'None (free)' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half_yearly', label: 'Half-yearly' },
  { value: 'yearly', label: 'Yearly' },
];

const emptyForm = {
  code: '',
  name: '',
  description: '',
  priceAmount: 0,
  billingCycle: 'monthly',
  leadCapPerListing: 5,
  profileQuota: 0,
  sortOrder: 0,
  isActive: true,
  showOnWebsite: true,
};

export default function PlansPage() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const handleErr = useCallback(
    (e) => {
      if (e.status === 401) {
        logout();
        navigate('/login', { replace: true });
        return;
      }
      setErr(e.message || 'Error');
    },
    [logout, navigate]
  );

  const load = useCallback(() => {
    setErr('');
    setLoading(true);
    adminFetch(BASE)
      .then((d) => setPlans(d.plans || []))
      .catch(handleErr)
      .finally(() => setLoading(false));
  }, [handleErr]);

  useEffect(() => {
    load();
  }, [load]);

  function startCreate() {
    setEditingId('new');
    setForm(emptyForm);
  }

  function startEdit(p) {
    setEditingId(p._id);
    setForm({
      code: p.code || '',
      name: p.name || '',
      description: p.description || '',
      priceAmount: p.priceAmount ?? 0,
      billingCycle: p.billingCycle || 'monthly',
      leadCapPerListing: p.leadCapPerListing ?? 5,
      profileQuota: p.profileQuota ?? 0,
      sortOrder: p.sortOrder ?? 0,
      isActive: !!p.isActive,
      showOnWebsite: p.showOnWebsite !== false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(e) {
    e.preventDefault();
    setErr('');
    const payload = {
      ...form,
      code: form.code.trim().toLowerCase(),
      name: form.name.trim(),
      priceAmount: Number(form.priceAmount) || 0,
      leadCapPerListing: parseInt(form.leadCapPerListing, 10),
      profileQuota: parseInt(form.profileQuota, 10) || 0,
      sortOrder: parseInt(form.sortOrder, 10) || 0,
    };
    if (!payload.code || !payload.name) {
      setErr('Code and name are required');
      return;
    }
    try {
      if (editingId === 'new') {
        await adminFetch(`${BASE}/`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await adminFetch(`${BASE}/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      }
      cancelEdit();
      load();
    } catch (e) {
      handleErr(e);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this plan?')) return;
    setErr('');
    try {
      await adminFetch(`${BASE}/${id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      handleErr(e);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Plans</h1>
        <p className="mt-1 text-slate-600">
          Configure subscription tiers (codes align with account <code className="text-sm">subscriptionPlanId</code>).
          Shown on the website when &quot;Show on website&quot; is on.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startCreate}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
        >
          Add plan
        </button>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {err}
        </div>
      )}

      {editingId && (
        <form
          onSubmit={save}
          className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId === 'new' ? 'New plan' : 'Edit plan'}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Code</span>
              <input
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. bronze"
                disabled={editingId !== 'new'}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-slate-700">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Price (INR / period)</span>
              <input
                type="number"
                min={0}
                value={form.priceAmount}
                onChange={(e) => setForm((f) => ({ ...f, priceAmount: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Billing cycle</span>
              <select
                value={form.billingCycle}
                onChange={(e) => setForm((f) => ({ ...f, billingCycle: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {CYCLES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Lead cap / listing (−1 = unlimited)</span>
              <input
                type="number"
                value={form.leadCapPerListing}
                onChange={(e) => setForm((f) => ({ ...f, leadCapPerListing: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Profile quota (brokers)</span>
              <input
                type="number"
                min={0}
                value={form.profileQuota}
                onChange={(e) => setForm((f) => ({ ...f, profileQuota: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.showOnWebsite}
                  onChange={(e) => setForm((f) => ({ ...f, showOnWebsite: e.target.checked }))}
                />
                Show on website
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-slate-600">Loading…</p>}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Cycle</th>
              <th className="px-4 py-3">Website</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plans.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3 text-slate-600">{p.sortOrder}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-800">{p.code}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                <td className="px-4 py-3">{p.priceAmount === 0 ? '—' : `₹${Number(p.priceAmount).toLocaleString('en-IN')}`}</td>
                <td className="px-4 py-3 text-slate-600">{p.billingCycle}</td>
                <td className="px-4 py-3">{p.showOnWebsite ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="mr-3 text-teal-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && plans.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-500">
            No plans yet. Run <code className="text-xs">npm run seed:plans</code> in <code className="text-xs">server/</code> or
            add one above.
          </p>
        )}
      </div>
    </div>
  );
}
