"use client";

import Link from "next/link";
import { FileText, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full mb-8">
            <FileText className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-800">PDF Converter Toolkit</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            Convert PDF to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Anything
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Instantly convert PDFs to DOCX, Excel, JPG, PPTX, TXT. Drag & drop. No signup. Free.
          </p>
          
          <Link
            href="/converters/pdf-to-docs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-all"
          >
            Start Converting
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          <Link href="/converters/pdf-to-docs" className="group p-4 rounded-lg bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all">
            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">PDF → DOCX</span>
          </Link>
          <Link href="/converters/pdf-to-excel" className="group p-4 rounded-lg bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all">
            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">PDF → Excel</span>
          </Link>
          <Link href="/converters/pdf-to-jpg" className="group p-4 rounded-lg bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all">
            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">PDF → JPG</span>
          </Link>
          <Link href="/converters/pdf-to-pptx" className="group p-4 rounded-lg bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all">
            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">PDF → PPTX</span>
          </Link>
          <Link href="/converters/pdf-to-txt" className="group p-4 rounded-lg bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 transition-all">
            <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">PDF → TXT</span>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>No signup required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Instant results</span>
          </div>
        </div>
      </div>
    </div>
  );
}
