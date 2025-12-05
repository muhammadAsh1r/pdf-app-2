import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/ClientProviders';
import Navbar from '@/components/layout/Navbar'; // Adjust path as needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Django Auth App',
  description: 'Next.js authentication with Django backend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
          <main className="pt-16">{children}</main> {/* pt-16 matches navbar height */}
        </ClientProviders>
      </body>
    </html>
  );
}
