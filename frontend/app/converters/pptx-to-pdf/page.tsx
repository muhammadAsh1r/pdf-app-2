'use client';

import { useCallback, useState } from 'react';
import { CloudUpload, FileText, Trash2 } from 'lucide-react';

type UploadState = 'idle' | 'uploading' | 'done' | 'error';

export default function PptxToPdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const MAX_SIZE = 80 * 1024 * 1024; // 80 MB

  const reset = () => {
    setFile(null);
    setUploadState('idle');
    setProgress(0);
    setError('');
    setDownloadUrl('');
  };

  const onFilePicked = (picked: File | null) => {
    setError('');
    setDownloadUrl('');
    if (!picked) {
      setFile(null);
      return;
    }
    if (!picked.name.toLowerCase().endsWith('.pptx')) {
      setError('Please upload a .pptx file.');
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError('File is too large. Max 80 MB.');
      return;
    }
    setFile(picked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilePicked(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFilePicked(e.dataTransfer.files?.[0] ?? null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const upload = useCallback(async () => {
    if (!file) {
      setError('Select a PPTX file first.');
      return;
    }

    setError('');
    setUploadState('uploading');
    setProgress(5);

    try {
      // Use fetch + ReadableStream to show progress is not trivial without server support.
      // We'll simulate progress locally while sending the file.
      const form = new FormData();
      form.append('file', file);

      // progressive UI simulation
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(90, p + Math.floor(Math.random() * 10) + 5));
      }, 250);

      const res = await fetch('/api/pptx-to-pdf/', {
        method: 'POST',
        body: form,
      });

      clearInterval(progressInterval);
      setProgress(95);

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Conversion failed on server.');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setUploadState('done');
      setProgress(100);
    } catch (err: any) {
      setUploadState('error');
      setError(err?.message || 'Upload/Conversion failed.');
      setProgress(0);
    }
  }, [file]);

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Dropzone / Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload PPTX</label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-dashed border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-300 transition-colors"
            role="button"
          >
            <CloudUpload className="w-10 h-10 text-gray-400 mb-3" />
            <div className="text-gray-700 font-semibold">
              Drag & drop your .pptx file here
            </div>
            <div className="text-sm text-gray-500 mt-2">or</div>

            <input
              type="file"
              accept=".pptx"
              onChange={handleInputChange}
              className="mt-3"
            />

            <div className="text-xs text-gray-500 mt-3">
              Max file size: 80MB — Only .pptx files accepted.
            </div>

            {file && (
              <div className="mt-4 w-full bg-gray-50 p-3 rounded flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>

                <button
                  onClick={reset}
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* error */}
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

          {/* actions */}
          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={upload}
              disabled={uploadState === 'uploading' || !file}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {uploadState === 'uploading' ? 'Converting...' : 'Convert to PDF'}
            </button>

            <button
              onClick={reset}
              type="button"
              className="inline-flex items-center px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          {/* progress */}
          <div className="mt-4">
            <div className="h-2 bg-gray-100 rounded overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{uploadState === 'uploading' ? `Progress: ${progress}%` : uploadState === 'done' ? 'Conversion completed' : ''}</div>
          </div>
        </div>

        {/* Right: Info / Result */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">About this converter</h3>
            <p className="text-sm text-gray-600 mt-2">
              Convert PowerPoint (.pptx) presentations to a high-quality single or multi-page PDF.
              The converted PDF will preserve formatting, images and layout.
            </p>

            <ul className="mt-4 text-sm text-gray-600 space-y-2">
              <li>• Preserves fonts and images</li>
              <li>• Fast server-side conversion</li>
              <li>• Supports up to 80 MB files</li>
            </ul>
          </div>

          <div className="mt-6">
            {downloadUrl ? (
              <div className="bg-gray-50 p-4 rounded border">
                <p className="text-sm text-gray-700">Your file is ready:</p>
                <a
                  href={downloadUrl}
                  download="converted.pdf"
                  className="mt-2 inline-block text-indigo-600 font-medium underline"
                >
                  Download converted.pdf
                </a>

                <button
                  onClick={() => {
                    // revoke object URL and reset (optional)
                    window.URL.revokeObjectURL(downloadUrl);
                    reset();
                  }}
                  className="ml-4 px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded border">
                <p className="text-sm text-gray-700">No converted file yet.</p>
                <p className="text-xs text-gray-500 mt-1">After conversion, a download link will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
