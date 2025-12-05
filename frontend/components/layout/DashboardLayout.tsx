"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User, RefreshCw, X } from "lucide-react";

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathnameRaw = usePathname();
  // ensure pathname is a string to avoid runtime errors
  const pathname = pathnameRaw ?? "";

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Converters", href: "/converters", icon: RefreshCw },
  ];

  const converterItems = [
    { name: "PDF to DOCX", href: "/converters/pdf-to-docx" },
    { name: "Word to PDF", href: "/converters/word-to-pdf" },
  ];

  // safe helper to close (only call if provided)
  const handleMaybeClose = () => {
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleMaybeClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
          <button
            onClick={handleMaybeClose}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close menu"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // active if path exactly equals or path starts with the href
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMaybeClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Converter submenu */}
          {pathname.startsWith("/converters") && (
            <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
              {converterItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMaybeClose}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
