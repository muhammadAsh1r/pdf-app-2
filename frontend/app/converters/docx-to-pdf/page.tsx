"use client";

import { useState, useRef, useCallback } from "react";
import { CloudUpload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function DocxToPdfPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string | null }>({
    type: null,
    text: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const resetMessages = () => setMessage({ type: null, text: null });

  const uploadAndDownload = async (file: File) => {
    setLoading(true);
    resetMessages();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/docx-to-pdf/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text().catch(() => "");
        throw new Error(txt || "Conversion failed on server");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      // prefer original name base; ensure .pdf
      a.download = file.name.replace(/\.(docx|doc)$/i, ".pdf");
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

    const name = (file.name || "").toLowerCase();
    if (!name.endsWith(".docx") && !name.endsWith(".doc")) {
      setMessage({ type: "error", text: "Please select a .docx or .doc file." });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    await uploadAndDownload(file);
    // clear input so same file can be reselected if needed
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const name = (file.name || "").toLowerCase();
      if (!name.endsWith(".docx") && !name.endsWith(".doc")) {
        setMessage({ type: "error", text: "Please drop a .docx or .doc file." });
        return;
      }

      setSelectedFile(file);
      await uploadAndDownload(file);
    },
    [] /* eslint-disable-line */
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
            <FileText className="w-6 h-6 text-indigo-600" />
            DOCX → PDF
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload a Word document and download a converted PDF. Files are sent to your backend at{" "}
            <code className="bg-gray-100 px-1 rounded">/api/docx-to-pdf/</code>.
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
          <input
            ref={inputRef}
            type="file"
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-md bg-indigo-50 ${
                  dragActive ? "ring-2 ring-indigo-400" : ""
                }`}
              >
                <CloudUpload className="w-7 h-7 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Drag & drop your DOCX/DOC here</p>
                <p className="text-sm text-gray-500">or click the button to choose a file</p>
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
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="opacity-100"
                    />
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

          {/* Visual drop hint */}
          <div className="mt-6 text-sm text-gray-500">
            <p>Accepted: .docx, .doc. Max file size: depends on your backend.</p>
          </div>

          {/* Selected file preview */}
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

          {/* inline messages */}
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
            Tip: If you run into CORS or network errors, make sure your Django server allows requests from your
            frontend origin and that the endpoint is correct.
          </p>
        </div>
      </div>
    </div>
  );
}
