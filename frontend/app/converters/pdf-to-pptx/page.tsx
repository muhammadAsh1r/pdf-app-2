"use client";

import { useState, useRef, useCallback } from "react";
import { CloudUpload, Sliders, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function PdfToPptxPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string | null }>({
    type: null,
    text: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [dpi, setDpi] = useState<number>(150);

  const resetMessages = () => setMessage({ type: null, text: null });

  const getFilenameFromContentDisposition = (cd: string | null) => {
    if (!cd) return null;
    const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/.exec(cd);
    if (match && match[1]) return decodeURIComponent(match[1]);
    return null;
  };

  const uploadAndDownload = async (file: File) => {
    setLoading(true);
    resetMessages();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("dpi", String(dpi));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/pdf-to-pptx/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errText = "";
        try {
          const j = await response.json();
          errText = j?.detail || JSON.stringify(j);
        } catch {
          errText = await response.text().catch(() => "");
        }
        throw new Error(errText || "Conversion failed on server");
      }

      const contentDisposition = response.headers.get("content-disposition");
      const headerName = getFilenameFromContentDisposition(contentDisposition);
      const outFilename = headerName || file.name.replace(/\.pdf$/i, ".pptx");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = outFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "Converted — download started." });
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setMessage({ type: "error", text: "Please select a PDF file." });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setSelectedFile(file);
    await uploadAndDownload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".pdf")) {
        setMessage({ type: "error", text: "Please drop a PDF file." });
        return;
      }

      setSelectedFile(file);
      await uploadAndDownload(file);
    },
    []
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFilePicker = () => {
    resetMessages();
    inputRef.current?.click();
  };

  const prettySize = (n: number) => {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Sliders className="w-6 h-6 text-indigo-600" />
            PDF → PPTX
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload a PDF and download a PowerPoint (.pptx). Each PDF page becomes a slide (rendered as an image).
            Files are sent to your backend at{" "}
            <code className="bg-gray-100 px-1 rounded">/api/pdf-to-pptx/</code>.
          </p>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`relative rounded-lg border-2 p-6 transition-colors bg-white shadow-sm ${
            dragActive ? "border-indigo-400 bg-indigo-50" : "border-dashed border-gray-200"
          }`}
        >
          <input ref={inputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />

          <div className="flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-md bg-indigo-50 ${dragActive ? "ring-2 ring-indigo-400" : ""}`}>
                <CloudUpload className="w-7 h-7 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Drag & drop your PDF here</p>
                <p className="text-sm text-gray-500">or click the button to choose a file</p>

                <div className="mt-3 flex items-center gap-3">
                  <label className="text-xs text-gray-600">DPI</label>
                  <input
                    type="number"
                    min={72}
                    max={400}
                    value={dpi}
                    onChange={(e) => setDpi(Math.max(72, Math.min(400, Number(e.target.value) || 150)))}
                    className="ml-2 w-24 px-2 py-1 border rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openFilePicker}
                type="button"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-100" />
                  </svg>
                ) : (
                  <CloudUpload className="w-4 h-4" />
                )}
                <span>{loading ? "Converting..." : "Choose file"}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  resetMessages();
                }}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Accepted: PDF files only. Max file size depends on your backend. Poppler must be installed on the server for rendering.</p>
          </div>

          {selectedFile && (
            <div className="mt-4 p-3 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-700" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">{prettySize(selectedFile.size)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => uploadAndDownload(selectedFile)}
                  disabled={loading}
                  className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? "Converting…" : "Convert now"}
                </button>
              </div>
            </div>
          )}

          {message.type && (
            <div
              className={`mt-4 flex items-center gap-3 text-sm font-medium rounded-md p-3 ${
                message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <div>{message.text}</div>
            </div>
          )}
        </div>

        <div className="mt-8 text-xs text-gray-400">
          <p>
            Tip: If you hit CORS or network errors, ensure your Django server allows requests from the frontend origin and that the endpoint is correct.
          </p>
        </div>
      </div>
    </div>
  );
}
