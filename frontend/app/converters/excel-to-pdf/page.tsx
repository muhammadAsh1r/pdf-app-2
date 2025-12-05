"use client";

import { useRef, useState } from "react";
import { FileText, CloudUpload, CheckCircle, AlertCircle } from "lucide-react";

export default function ExcelToPdfPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string | null }>({
    type: null,
    text: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const reset = () => setMessage({ type: null, text: null });

  const handleFile = async (f: File | null) => {
    reset();
    if (!f) return;
    const name = (f.name || "").toLowerCase();
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
      setMessage({ type: "error", text: "Please select an .xlsx or .xls file." });
      return;
    }
    setFile(f);
    await uploadAndDownload(f);
  };

  const uploadAndDownload = async (f: File) => {
    setLoading(true);
    reset();
    const form = new FormData();
    form.append("file", f);
    // choose backend: soffice for fidelity; change to "reportlab" if soffice not available on server
    form.append("backend", "soffice");
    form.append("page_size", "A4");
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/excel-to-pdf/", {
        method: "POST",
        body: form,
      });
      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        throw new Error(t || "Conversion failed");
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.name.replace(/\.(xlsx|xls)$/i, ".pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage({ type: "success", text: "Converted — download should begin." });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.message || "Conversion error." });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    await handleFile(f || null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            Excel → PDF
          </h1>
          <p className="mt-1 text-sm text-gray-600">Upload an Excel file (.xls/.xlsx) and download a PDF.</p>
        </div>

        <div className="rounded-lg border-dashed border-2 border-gray-200 bg-white p-6 shadow-sm">
          <input ref={inputRef} type="file" accept=".xls,.xlsx" onChange={onFileChange} className="hidden" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-indigo-50">
                <CloudUpload className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Upload Excel file</p>
                <p className="text-sm text-gray-500">Supports .xlsx and .xls</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                {loading ? "Converting..." : "Choose file"}
              </button>
              <button onClick={() => { setFile(null); reset(); }} className="px-3 py-2 rounded-md border">
                Reset
              </button>
            </div>
          </div>

          {file && (
            <div className="mt-4 p-3 border rounded-md bg-gray-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / (1024*1024)).toFixed(2)} MB</div>
              </div>
              <div>
                <button onClick={() => uploadAndDownload(file)} disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded-md">
                  {loading ? "Converting…" : "Convert now"}
                </button>
              </div>
            </div>
          )}

          {message.type && (
            <div className={`mt-4 p-3 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
