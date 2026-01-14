"use client";
export const dynamic = 'force-dynamic';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export default function VerifySuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch(`${API_BASE}/api/auth/verify-email/?token=${token}`, {
      credentials: "include",
    })
      .then(() => {
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/verify-email");
      });
  }, [token, router]);

  return null;
}
