"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloudUpload, Image as ImageIcon, Trash2, CheckCircle, AlertCircle } from "lucide-react";

type UploadMessage = { type: "success" | "error" | null; text: string | null };

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<UploadMessage>({ type: null, text: null });
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // create object URLs for previews
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => {
      // revoke old ones
      prev.forEach((u) => URL.revokeObjectURL(u));
      return urls;
    });

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const resetMessage = () => setMessage({ type: null, text: null });

  const onFilesAdded = async (incoming: FileList | null) => {
    if (!incoming) return;
    const list = Array.from(incoming);

    // filter images only
    const imageFiles = list.filter((f) => /^image\//.test(f.type));
    if (imageFiles.length !== list.length) {
      setMessage({ type: "error", text: "Some files were not images and were skipped." });
    }

    // optional: limit total files (for safety)
    const MAX_FILES = 20;
    const combined = [...files, ...imageFiles].slice(0, MAX_FILES);
    if (combined.length > MAX_FILES) {
      setMessage({ type: "error", text: `Max ${MAX_FILES} images allowed. Extra files were ignored.` });
    }
    setFiles(combined);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    resetMessage();
    const f = e.target.files;
    await onFilesAdded(f);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      resetMessage();
      await onFilesAdded(e.dataTransfer.files);
    },
    [files] // eslint-disable-line
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
    resetMessage();
    inputRef.current?.click();
  };

  const removeFileAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearAll = () => {
    setFiles([]);
    resetMessage();
  };

  const prettySize = (n: number) => {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / (1024 * 1024)).toFixed(2) + " MB";
  };

  const uploadAndDownload = async () => {
    if (!files.length) {
      setMessage({ type: "error", text: "Add at least one image to convert." });
      return;
    }

    setLoading(true);
    resetMessage();

    const form = new FormData();
    // append multiple files under key 'files' (server expects files[] or files)
    files.forEach((f) => form.append("files", f));

    try {
      const resp = await fetch("http://127.0.0.1:8000/api/images-to-pdf/", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        const t = await resp.text().catch(() => "");
        throw new Error(t || "Server conversion failed");
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "Conversion successful — download started." });
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.message || "Conversion failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
            Images → PDF
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload one or more images (JPG, PNG, etc.) and download a single multi-page PDF. Files are sent to{" "}
            <code className="bg-gray-100 px-1 rounded">/api/images-to-pdf/</code>.
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
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-md bg-indigo-50 ${dragActive ? "ring-2 ring-indigo-400" : ""}`}>
                <CloudUpload className="w-7 h-7 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Drag & drop images here</p>
                <p className="text-sm text-gray-500">or click the button to choose files (multiple)</p>
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
                <span>{loading ? "Converting..." : "Choose files"}</span>
              </button>

              <button
                onClick={clearAll}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Accepted: images only (jpg, png, webp, gif). Max files/size depends on your backend.</p>
          </div>

          {/* previews */}
          {files.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {files.map((f, i) => (
                <div key={i} className="relative rounded-md bg-gray-50 border border-gray-100 p-2">
                  <img
                    src={previews[i]}
                    alt={f.name}
                    className="w-full h-36 object-cover rounded-sm"
                    draggable={false}
                  />
                  <div className="mt-2 text-xs text-gray-700 truncate">{f.name}</div>
                  <div className="text-xs text-gray-500">{prettySize(f.size)}</div>

                  <button
                    onClick={() => removeFileAt(i)}
                    type="button"
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-white border border-gray-100"
                    aria-label="Remove file"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* action bar */}
          <div className="mt-4 flex items-center justify-end gap-3">
            <div className="flex-1 text-sm text-gray-500">{files.length ? `${files.length} file(s) selected` : ""}</div>
            <button
              onClick={uploadAndDownload}
              disabled={loading || files.length === 0}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Converting…" : "Convert & Download PDF"}
            </button>
          </div>

          {/* inline message */}
          {message.type && (
            <div
              className={`mt-4 flex items-center gap-3 text-sm font-medium rounded-md p-3 ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-red-50 text-red-700 border border-red-100"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <div>{message.text}</div>
            </div>
          )}
        </div>

        <div className="mt-8 text-xs text-gray-400">
          <p>
            Tip: If you hit CORS errors or network issues, ensure your Django backend allows your frontend origin and the endpoint is
            correct (<code className="bg-gray-100 px-1 rounded">/api/images-to-pdf/</code>).
          </p>
        </div>
      </div>
    </div>
  );
}
