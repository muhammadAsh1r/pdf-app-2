"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCode,
  FileDown,
  FileUp,
  Image,
  BookOpen,
  Layers,
} from "lucide-react";

const groups = [
  {
    title: "PDF Tools",
    icon: FileText,
    links: [
      { label: "PDF → DOCX", href: "/converters/pdf-to-docx" },
      { label: "PDF → JPG", href: "/converters/pdf-to-jpg" },
      { label: "PDF → EXCEL", href: "/converters/pdf-to-excel" },
      { label: "PDF → PPTX", href: "/converters/pdf-to-pptx" },
      { label: "PDF → TXT", href: "/converters/pdf-to-txt" },
    ],
  },
  {
    title: "Office Tools",
    icon: Layers,
    links: [
      { label: "DOCX → PDF", href: "/converters/docx-to-pdf" },
      { label: "EXCEL → PDF", href: "/converters/excel-to-pdf" },
      { label: "PPTX → PDF", href: "/converters/pptx-to-pdf" },
      { label: "TXT → PDF", href: "/converters/txt-to-pdf" },
    ],
  },
  {
    title: "Image Tools",
    icon: Image,
    links: [{ label: "Images → PDF", href: "/converters/images-to-pdf" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-5 overflow-y-auto">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
        PDF Utility
      </h1>

      <div className="space-y-8">
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.title}>
              <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300 font-semibold">
                <Icon className="w-5 h-5" />
                {group.title}
              </div>

              <nav className="flex flex-col pl-2 border-l border-gray-300 dark:border-gray-700 space-y-1">
                {group.links.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm transition ${
                        active
                          ? "bg-indigo-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
