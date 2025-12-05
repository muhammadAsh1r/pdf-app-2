'use client';

import React, { useState } from 'react';
import { Upload, FileText, Download, Loader, CheckCircle, XCircle } from 'lucide-react';

export default function WordToPdfConverter() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (droppedFile && validTypes.includes(droppedFile.type)) {
      setFile(droppedFile);
      setError('');
      setSuccess(false);
    } else {
      setError('Please upload a valid Word document (.doc or .docx)');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
    } else {
      setError('Please select a valid Word document (.doc or .docx)');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a Word document first');
      return;
    }

    setConverting(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/convert-word/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Conversion failed');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(docx?|DOCX?)$/, '.pdf');
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to convert Word document');
    } finally {
      setConverting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError('');
    setSuccess(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Word to PDF Converter</h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        {!file ? (
          <div className="space-y-4">
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drag & drop your Word document here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 mr-2" />
                Browse Files
                <input
                  type="file"
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">Supported formats: DOC, DOCX</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 bg-white p-4 rounded-lg border border-gray-200">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="text-left flex-1">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={handleConvert}
              disabled={converting}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {converting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Convert to PDF</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <span>Word document converted successfully! Download started.</span>
        </div>
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          How it works
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 ml-7">
          <li>• Upload a Word document using drag & drop or file browser</li>
          <li>• Click "Convert to PDF" to start the conversion</li>
          <li>• Your converted PDF file will download automatically</li>
          <li>• All conversions are processed securely on the server</li>
        </ul>
      </div>
    </div>
  );
}