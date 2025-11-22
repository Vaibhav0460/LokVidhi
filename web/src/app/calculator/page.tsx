"use client";

import { Home, IndianRupee, Clock, ChevronsRight } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorHub() {
  return (
    <main className="flex flex-col items-center p-6 bg-gray-50 flex-1 w-full">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg mt-10 p-8 border border-gray-200">
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Interactive Calculators
        </h1>
        <p className="text-xl text-gray-600 mb-10 border-b pb-6">
          Quickly estimate your legal rights and financial liability.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Card 1: Severance Calculator */}
          <Link href="/calculator/severance" className="group block p-6 border border-gray-200 rounded-xl hover:shadow-xl hover:border-blue-400 transition-all duration-200 bg-white">
            <div className="flex items-center space-x-4 mb-4">
              <IndianRupee className="w-8 h-8 text-green-600 group-hover:text-green-700 transition-colors" />
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-700">
                Salary & Severance Pay
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Determine the minimum gratuity and notice pay you are legally entitled to upon job termination or resignation.
            </p>
            <div className="flex items-center text-green-600 font-medium">
              Start Calculation <ChevronsRight className="w-5 h-5 ml-1" />
            </div>
          </Link>

          {/* Card 2: Rent Calculator */}
          <Link href="/calculator/rent" className="group block p-6 border border-gray-200 rounded-xl hover:shadow-xl hover:border-blue-400 transition-all duration-200 bg-white">
            <div className="flex items-center space-x-4 mb-4">
              <Home className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700">
                Rent Deposit & Notice
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Verify if your security deposit amount is within the legal state limits and check the minimum required notice period.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              Start Analysis <ChevronsRight className="w-5 h-5 ml-1" />
            </div>
          </Link>
          
        </div>
        
        
      </div>
    </main>
  );
}