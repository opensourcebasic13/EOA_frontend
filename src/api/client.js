const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export const hasBackend = Boolean(BASE);

export async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}
