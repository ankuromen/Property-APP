const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function api(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export function listProperties(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') sp.set(k, v);
  });
  const q = sp.toString();
  return api(`/api/website/properties${q ? `?${q}` : ''}`);
}

export function getProperty(id) {
  return api(`/api/website/properties/${id}`);
}

export function createLead(body) {
  return api('/api/website/leads', { method: 'POST', body: JSON.stringify(body) });
}
