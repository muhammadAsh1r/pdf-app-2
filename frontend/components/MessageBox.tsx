"use client";

import { CheckCircle, AlertCircle } from "lucide-react";

export default function MessageBox({
  type,
  text,
}: {
  type: "success" | "error" | null | undefined;
  text: string | null | undefined;
}) {
  if (!type) return null;
  const success = type === "success";
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-md border ${
        success
          ? "bg-green-50 border-green-200 text-green-700"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <p className="text-sm">{text}</p>
    </div>
  );
}
