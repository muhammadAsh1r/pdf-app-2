"use client";

import { useState, useRef, useCallback } from "react";
import { CloudUpload } from "lucide-react";

type MessageState = {
  type: "success" | "error" | null;
  text: string | null;
};

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({
    type: null,
    text: null,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    if (!arr.length) return;

    // You can change this to append instead of replace if you want:
    // setFiles((prev) => [...prev, ...arr]);
    setFiles(arr);
    setMessage({ type: null, text: null });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
    // Reset input so same files can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!e.dataTransfer.files) return;
    handleFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const upload = async () => {
    if (!files.length || loading) return;

    setLoading(true);
    setMessage({ type: null, text: null });

    const formData = new FormData();

    // Adjust "files" to whatever your Django backend expects
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(
        // "http://127.0.0.1:8000/api/images-to-pdf/",
        "http://localhost:8000/api/images-to-pdf/", 
      {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Server failed to convert images.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      a.remove();

      setMessage({ type: "success", text: "Converted — download started." });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Images → PDF</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select or drop multiple images to combine them into a single PDF
            file.
          </p>
        </header>

        {/* Dropzone */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 md:p-8 transition bg-white dark:bg-gray-900 cursor-pointer ${
            dragging
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">{/* ... */}</div>

            <button
              type="button"
              onClick={openPicker}
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Processing…" : "Choose images"}
            </button>
          </div>
        </div>

        {/* Selected files list */}
        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                Selected files ({files.length})
              </p>
              <button
                type="button"
                className="text-xs text-red-500 hover:underline"
                onClick={() => setFiles([])}
                disabled={loading}
              >
                Clear
              </button>
            </div>
            <ul className="max-h-40 overflow-auto text-sm border border-gray-200 dark:border-gray-800 rounded-md divide-y divide-gray-100 dark:divide-gray-800">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="px-3 py-2 flex items-center justify-between"
                >
                  <span className="truncate max-w-[70%]">{file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={upload}
            disabled={!files.length || loading}
            className="w-full md:w-auto px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Converting…" : "Convert to PDF"}
          </button>

          {message.text && (
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-600"
                  : message.type === "error"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
