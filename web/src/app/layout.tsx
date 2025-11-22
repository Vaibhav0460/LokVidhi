import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Standard relative import
import AuthProvider from "../components/AuthProvider"; // Explicit relative path
import Navbar from "../components/Navbar"; // Explicit relative path
import Footer from "../components/Footer"; // 1. Import Footer
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
            <div className="flex-1 flex flex-col h-full overflow=hidden">
              {children}
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}