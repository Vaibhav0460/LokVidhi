"use client";

import { useState } from 'react';
import { Home, IndianRupee, Clock, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
// Use relative path to ensure we find the component we just created
import CalculatorNav from '../../../components/CalculatorNav'; 

interface Result {
  totalDeposit: number;
  refundLiability: number;
  isDepositLegal: boolean;
  noticePeriodDays: number;
  state: string;
  legalRule: string;
  depositCap: number;
  message: string;
  initialDepositMonths: number;
}

export default function RentCalculator() {
  const [state, setState] = useState('DELHI');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [initialDepositMonths, setInitialDepositMonths] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const rent = parseFloat(monthlyRent);
    const depositMonths = parseInt(initialDepositMonths, 10);

    if (isNaN(rent) || rent <= 0 || isNaN(depositMonths) || depositMonths < 0) {
      setError('Please enter valid monthly rent and deposit months.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/api/calculator/rent/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          monthlyRent: rent,
          initialDepositMonths: depositMonths,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Calculation failed due to a server error.');
      }
    } catch (err) {
      setError('Could not connect to the calculation service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg mt-10 p-8 border border-gray-200">
        
        {/* Navigation */}
        <CalculatorNav />

        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 border-b pb-4">
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Rent Deposit & Notice Calculator
          </h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Check the legal limits on security deposits and the minimum notice period for eviction or vacation, based on state laws.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Selection */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State of Tenancy
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="DELHI">Delhi</option>
                <option value="MAHARASHTRA">Maharashtra (Mumbai)</option>
                <option value="KARNATAKA">Karnataka (Bengaluru)</option>
                <option value="OTHER">Other (Default Rules)</option>
              </select>
            </div>
            
            {/* Monthly Rent */}
            <div>
              <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
                Monthly Rent Amount (₹)
              </label>
              <input
                id="rent"
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Initial Deposit Months */}
          <div>
            <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">
              Initial Deposit (in number of months)
            </label>
            <input
              id="deposit"
              type="number"
              value={initialDepositMonths}
              onChange={(e) => setInitialDepositMonths(e.target.value)}
              required
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Calculating...' : (
              <>
                Analyze Rent Terms <ChevronsRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Analysis for {result.state}
            </h2>

            {/* Deposit Legality */}
            <div className={`p-4 rounded-lg border ${result.isDepositLegal ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <h3 className="font-semibold flex items-center text-lg mb-1 !text-gray-900">
                <IndianRupee className="w-5 h-5 mr-2" /> Deposit Legality Check
              </h3>
              <p className="text-sm !text-gray-900">
                Your initial deposit was <strong>{result.initialDepositMonths} months</strong> (Total: {formatCurrency(result.totalDeposit)}).
                The legal cap in {result.state} is <strong>{result.depositCap} months</strong>.
              </p>
              <strong className={`block mt-2 ${result.isDepositLegal ? 'text-green-700' : 'text-red-700'} !text-gray-900`}>
                {result.isDepositLegal 
                  ? "Status: Legal, within the state cap." 
                  : `Status: Possibly Illegal. Your deposit exceeds the ${result.depositCap}-month limit.`}
              </strong>
            </div>

            {/* Notice Period */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
              <h3 className="font-semibold flex items-center text-lg mb-1 !text-gray-900">
                <Clock className="w-5 h-5 mr-2" /> Minimum Notice Period
              </h3>
              <p className="text-sm !text-gray-900">
                Under the prevailing {result.legalRule}, the minimum notice period for either party to vacate/evict is typically <strong>{result.noticePeriodDays} days</strong>.
              </p>
            </div>

            <p className="text-xs text-gray-500 pt-2">
              *Disclaimer: This calculator relies on statutory caps and should not replace advice on your specific contract (rent agreement).
            </p>
          </div>
        )}

      </div>
    </main>
  );
}