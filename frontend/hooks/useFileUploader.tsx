"use client";

import { useState } from "react";

export function useFileUploader(apiEndpoint: string, renameCallback: (fileName: string) => string) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string | null }>({
    type: null,
    text: null,
  });

  const upload = async (file: File) => {
    setLoading(true);
    setMessage({ type: null, text: null });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Server failed to convert file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = renameCallback(file.name);
      a.click();
      a.remove();

      setMessage({ type: "success", text: "Converted — download started." });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, message, setMessage };
}
