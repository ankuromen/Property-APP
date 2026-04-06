const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function api(path, init = {}, revalidateSeconds = 60) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    next: { revalidate: revalidateSeconds },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function formatPrice(value) {
  const n = Number(value || 0);
  if (n >= 10000000) return `Rs ${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `Rs ${(n / 100000).toFixed(2)} L`;
  return `Rs ${n.toLocaleString('en-IN')}`;
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
