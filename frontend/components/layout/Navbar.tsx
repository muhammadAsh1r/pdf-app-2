"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pdfDropdown, setPdfDropdown] = useState(false);
  const [fromDropdown, setFromDropdown] = useState(false);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Brand */}
          <Link href="/" className="flex items-center text-indigo-600 font-extrabold text-xl">
            PDF Converters
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-4">
            <li>
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
              >
                Home
              </Link>
            </li>

            {/* PDF TO Dropdown */}
            <li className="relative">
              <button
                onClick={() => setPdfDropdown(!pdfDropdown)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition"
              >
                PDF → Other
                <ChevronDown className="w-4 h-4" />
              </button>

              {pdfDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md w-40 py-2 z-50">
                  <DropdownLink href="/converters/pdf-to-docs" label="PDF → DOCX" />
                  <DropdownLink href="/converters/pdf-to-excel" label="PDF → Excel" />
                  <DropdownLink href="/converters/pdf-to-jpg" label="PDF → JPG" />
                  <DropdownLink href="/converters/pdf-to-pptx" label="PDF → PPTX" />
                  <DropdownLink href="/converters/pdf-to-txt" label="PDF → TXT" />
                </div>
              )}
            </li>

            {/* FROM → PDF Dropdown */}
            <li className="relative">
              <button
                onClick={() => setFromDropdown(!fromDropdown)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition"
              >
                Other → PDF
                <ChevronDown className="w-4 h-4" />
              </button>

              {fromDropdown && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-md w-40 py-2 z-50">
                  <DropdownLink href="/converters/docx-to-pdf" label="DOCX → PDF" />
                  <DropdownLink href="/converters/pptx-to-pdf" label="PPTX → PDF" />
                  <DropdownLink href="/converters/images-to-pdf" label="Images → PDF" />
                  <DropdownLink href="/converters/txt-to-pdf" label="TXT → PDF" />
                  <DropdownLink href="/converters/excel-to-pdf" label="Excel → PDF" />
                </div>
              )}
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-3">

          <MobileLink href="/" label="Home" close={() => setMobileMenuOpen(false)} />

          {/* Mobile PDF TO Dropdown */}
          <MobileDropdown title="PDF → Other">
            <MobileDropdownLink href="/converters/pdf-to-docs" label="PDF → DOCX" />
            <MobileDropdownLink href="/converters/pdf-to-excel" label="PDF → Excel" />
            <MobileDropdownLink href="/converters/pdf-to-jpg" label="PDF → JPG" />
            <MobileDropdownLink href="/converters/pdf-to-pptx" label="PDF → PPTX" />
            <MobileDropdownLink href="/converters/pdf-to-txt" label="PDF → TXT" />
          </MobileDropdown>

          {/* Mobile OTHER TO PDF Dropdown */}
          <MobileDropdown title="Other → PDF">
            <MobileDropdownLink href="/converters/docx-to-pdf" label="DOCX → PDF" />
            <MobileDropdownLink href="/converters/pptx-to-pdf" label="PPTX → PDF" />
            <MobileDropdownLink href="/converters/images-to-pdf" label="Images → PDF" />
            <MobileDropdownLink href="/converters/txt-to-pdf" label="TXT → PDF" />
            <MobileDropdownLink href="/converters/excel-to-pdf" label="Excel → PDF" />
          </MobileDropdown>
        </div>
      )}
    </nav>
  );
}

/* --- Components --- */

function DropdownLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
    >
      {label}
    </Link>
  );
}

function MobileLink({ href, label, close }: any) {
  return (
    <Link
      href={href}
      onClick={close}
      className="block text-base font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md"
    >
      {label}
    </Link>
  );
}

function MobileDropdown({ title, children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transform transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && <div className="pl-6 mt-1 space-y-1">{children}</div>}
    </div>
  );
}

function MobileDropdownLink({ href, label }: any) {
  return (
    <Link
      href={href}
      className="block text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-md transition"
    >
      {label}
    </Link>
  );
}
