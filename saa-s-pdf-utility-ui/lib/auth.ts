import { apiFetch } from "./api";

export async function login(email: string, password: string) {
  const res = await apiFetch("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }

  // backend sets cookies; nothing to return
  return true;
}

export async function getMe() {
  const res = await apiFetch("/api/auth/me/", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await apiFetch("/api/auth/logout/", {
    method: "POST",
  });
}
