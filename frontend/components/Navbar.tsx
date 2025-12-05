// frontend/app/components/Navbar.tsx
"use client";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">P</div>
        <div>
          <div className="text-sm font-semibold">PDF Utility</div>
          <div className="text-xs text-gray-500">All converters in one place</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="https://github.com/your-username/your-repo" target="_blank" className="text-sm text-gray-600 dark:text-gray-300">GitHub</Link>
        <ThemeToggle />
      </div>
    </div>
  );
}
