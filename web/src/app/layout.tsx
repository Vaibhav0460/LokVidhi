import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Standard relative import
import AuthProvider from "../components/AuthProvider"; // Explicit relative path
import Navbar from "../components/Navbar"; // Explicit relative path

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LokVidhi",
  description: "Indian Law Simplified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}