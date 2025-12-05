"use client";

import { CloudUpload } from "lucide-react";
import { useRef, useState, useCallback } from "react";

export default function FileDropzone({
  onFileSelect,
  accept,
  loading,
}: {
  onFileSelect: (f: File) => void;
  accept: string;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      className={`border-2 border-dashed p-6 rounded-lg bg-white dark:bg-gray-800 transition ${
        dragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-300 dark:border-gray-700"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={onFileChange}
      />

      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-900">
            <CloudUpload className="w-7 h-7 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Drag & drop your file here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">or click choose file</p>
          </div>
        </div>

        <button
          disabled={loading}
          onClick={openPicker}
          className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Processing…" : "Choose file"}
        </button>
      </div>
    </div>
  );
}
