import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
        
        {/* Copyright */}
        <div className="text-gray-500 text-sm">
          © {new Date().getFullYear()} LokVidhi. All rights reserved.
        </div>
        
        {/* Footer Links */}
        <div className="flex gap-6 text-sm text-gray-600 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/scenario" className="hover:text-blue-600 transition-colors">
            Scenarios
          </Link>
          <Link href="/library" className="hover:text-blue-600 transition-colors">
            Library
          </Link>
          <Link href="/calculator" className="hover:text-blue-600 transition-colors">
            Calculators
          </Link>
        </div>
        
      </div>
    </footer>
  );
}