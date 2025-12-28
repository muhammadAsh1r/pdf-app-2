const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: "include", // always send cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
}
