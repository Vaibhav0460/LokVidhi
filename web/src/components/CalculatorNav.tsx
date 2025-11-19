"use client";

import Link from 'next/link';
import { IndianRupee, Home } from 'lucide-react';

export default function CalculatorNav() {
  return (
    <div className="flex justify-start items-center space-x-4 border-b border-gray-200 pb-4 mb-8">
        <Link href="/calculator" className="text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md transition-colors">
          &larr; Back to Hub
        </Link>
        <Link href="/calculator/severance" className="text-sm font-medium flex items-center space-x-1 text-green-600 hover:text-green-700">
            <IndianRupee className="w-4 h-4"/> <span>Severance</span>
        </Link>
        <Link href="/calculator/rent" className="text-sm font-medium flex items-center space-x-1 text-blue-600 hover:text-blue-700">
            <Home className="w-4 h-4"/> <span>Rent Deposit</span>
        </Link>
    </div>
  );
}