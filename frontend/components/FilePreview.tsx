"use client";

export default function FilePreview({
  file,
  loading,
  onConvert,
  onReset,
}: {
  file: File;
  loading: boolean;
  onConvert: () => void;
  onReset: () => void;
}) {
  const prettySize = (n: number) => {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
    return (n / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border rounded">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{prettySize(file.size)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onConvert}
            disabled={loading}
            className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Converting..." : "Convert"}
          </button>

          <button
            onClick={onReset}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
