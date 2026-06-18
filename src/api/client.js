const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export const hasBackend = Boolean(BASE);

function authHeaders() {
  const token = localStorage.getItem("eoa_token");
  return token ? { Authorization: `Token ${token}` } : {};
}

export async function get(path) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

export async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw Object.assign(new Error(res.status), { data });
  }
  return res.json();
}

export async function del(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(res.status);
  return res.status === 204 ? null : res.json();
}
