const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

const AUTH_FREE_ENDPOINTS = [
  "/api/auth/login/",
  "/api/auth/register/",
  "/api/auth/refresh/",
];

export async function apiFetch(url: string, options: RequestInit = {}) {
  const makeRequest = () =>
    fetch(`${API_BASE}${url}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

  let res = await makeRequest();

  // ✅ Auth-free endpoints NEVER trigger refresh
  if (AUTH_FREE_ENDPOINTS.some((p) => url.startsWith(p))) {
    return res;
  }

  // ✅ Access token expired
  if (res.status === 401) {
    console.log("calling refresh");
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include",
    });
    console.log("refresh done");

    // ❌ Refresh expired → force login
    if (!refreshRes.ok) {
      window.location.href = "/login";
      throw new Error("SESSION_EXPIRED");
    }

    // 🔁 Retry original request ONCE
    res = await makeRequest();
  }

  return res;
}
