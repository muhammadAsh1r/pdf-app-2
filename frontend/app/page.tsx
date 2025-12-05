// frontend/app/page.tsx
"use client";

import Link from "next/link";
import { FileText, Image, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentConversions, clearRecentConversions } from "@/utils/recent";

const groups = [
  {
    title: "PDF Tools",
    items: [
      { title: "PDF → DOCX", href: "/converters/pdf-to-docx", icon: FileText },
      { title: "PDF → JPG", href: "/converters/pdf-to-jpg", icon: FileText },
      { title: "PDF → EXCEL", href: "/converters/pdf-to-excel", icon: FileText },
      { title: "PDF → PPTX", href: "/converters/pdf-to-pptx", icon: FileText },
      { title: "PDF → TXT", href: "/converters/pdf-to-txt", icon: FileText },
    ],
  },
  {
    title: "Office Tools",
    items: [
      { title: "DOCX → PDF", href: "/converters/docx-to-pdf", icon: Layers },
      { title: "EXCEL → PDF", href: "/converters/excel-to-pdf", icon: Layers },
      { title: "PPTX → PDF", href: "/converters/pptx-to-pdf", icon: Layers },
      { title: "TXT → PDF", href: "/converters/txt-to-pdf", icon: Layers },
    ],
  },
  {
    title: "Image Tools",
    items: [{ title: "Images → PDF", href: "/converters/images-to-pdf", icon: Image }],
  },
];

export default function Home() {
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    setRecent(getRecentConversions());
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-extrabold">Dashboard</h2>
        <p className="text-sm text-gray-500">Quick access to all conversion tools.</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6 mb-8">
        {groups.map((g) => (
          <div key={g.title} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-3">{g.title}</h3>
            <div className="space-y-2">
              {g.items.map((it) => {
                const Icon = it.icon;
                return (
                  <Link key={it.href} href={it.href} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded">
                      <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div className="text-sm">{it.title}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent conversions</h3>
          <button onClick={() => { clearRecentConversions(); setRecent([]); }} className="text-xs text-gray-500">Clear</button>
        </div>

        {recent.length === 0 ? (
          <div className="text-sm text-gray-500">No recent conversions yet — upload a file to get started.</div>
        ) : (
          <div className="space-y-2">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <div>
                  <div className="text-sm font-medium">{r.fileName}</div>
                  <div className="text-xs text-gray-500">{r.converter} • {new Date(r.time).toLocaleString()}</div>
                </div>
                <a className="text-indigo-600" href={r.downloadUrl}>Download</a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
