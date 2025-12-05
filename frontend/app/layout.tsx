import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "PDF Utility App",
  description: "All PDF & document converters in one dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen bg-gray-100 dark:bg-gray-800 p-6">
          <div className="flex justify-end mb-3">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}
