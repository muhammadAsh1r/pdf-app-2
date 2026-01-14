"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const res = await apiFetch("/api/auth/me/", {
          method: "GET",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          if (mounted) setUser(data);
        } else {
          if (mounted) setUser(null);
        }
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
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}
