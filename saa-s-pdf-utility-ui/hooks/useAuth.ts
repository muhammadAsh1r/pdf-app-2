"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api"; // <-- IMPORTANT

export function useAuth() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚫 don't check auth on login/register pages
    if (pathname === "/login" || pathname === "/register") {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadUser() {
      try {
        let res = await apiFetch("/api/auth/me/", {
          method: "GET",
          cache: "no-store",
        });

        // 🔁 Access expired → try refresh
        if (res.status === 401) {
          const refreshRes = await apiFetch("/api/auth/refresh/", {
            method: "POST",
            cache: "no-store",
          });

          if (!refreshRes.ok) {
            throw new Error("Refresh failed");
          }

          // 🔁 Retry /me after refresh
          res = await apiFetch("/api/auth/me/", {
            method: "GET",
            cache: "no-store",
          });
        }

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        if (mounted) setUser(data);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  return { user, loading, isAuthenticated: !!user };
}
