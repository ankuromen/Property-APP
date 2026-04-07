const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STORAGE_KEY = 'admin_token';

export function getAdminToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(STORAGE_KEY, token);
  else localStorage.removeItem(STORAGE_KEY);
}

/**
 * Authenticated admin API call — Bearer JWT from sign-in only (`POST /api/admin/auth/login`).
 */
export async function adminFetch(path, options = {}) {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    setAdminToken(null);
    const err = new Error(data.message || 'Unauthorized');
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    throw new Error(data.message || res.statusText || 'Request failed');
  }

  return data;
}

export async function adminLogin(loginId, password) {
  const res = await fetch(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}
