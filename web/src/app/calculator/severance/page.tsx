"use client";

import { useState } from 'react';
import { ChevronsRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';
// Importing the navigation component with the correct relative path
import CalculatorNav from '../../../components/CalculatorNav';

interface Result {
  amount: number;
  rule: string;
  input: {
    monthlySalary: number;
    yearsOfService: number;
  };
}

export default function SeveranceCalculator() {
  const [state, setState] = useState('Delhi');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const salary = parseFloat(monthlySalary);
    const years = parseInt(yearsOfService, 10);

    if (isNaN(salary) || salary <= 0 || isNaN(years) || years < 1) {
      setError('Please enter a valid monthly salary (> ₹0) and years of service (> 0).');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/calculator/severance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          monthlySalary: salary,
          yearsOfService: years,
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
    <main className="flex flex-col items-center p-6 bg-gray-50 min-h-full">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg mt-10 p-8 border border-gray-200">
        
        {/* Local Navigation */}
        <CalculatorNav />
        
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 border-b pb-4">
          <IndianRupee className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Severance & Gratuity Estimator
          </h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Estimate the minimum compensation you are legally entitled to upon termination or resignation.
          Calculation based on simplified labor law rules (e.g., Industrial Disputes Act).
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State of Employment (for localized laws)
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white !text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka (Bengaluru)</option>
                <option value="Other">Other (Default Central Rules)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Current Monthly Basic Salary (₹)
              </label>
              <input
                id="salary"
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                required
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white !text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="years" className="block text-sm font-medium text-gray-700">
              Completed Years of Continuous Service
            </label>
            <input
              id="years"
              type="number"
              value={yearsOfService}
              onChange={(e) => setYearsOfService(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white !text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Calculating...' : (
              <>
                Calculate Severance <ChevronsRight className="w-5 h-5 ml-2" />
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
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Estimated Severance Pay
            </h2>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-xl font-medium text-blue-800">Minimum Estimated Payout:</span>
              <span className="text-3xl font-extrabold text-blue-900">
                {formatCurrency(result.amount)}
              </span>
            </div>

            <div className="mt-6 text-sm text-gray-700 space-y-3">
              <h3 className="font-semibold text-gray-900">Legal Basis:</h3>
              <p className="pl-4 border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded-md text-gray-800">
                {result.rule}
              </p>
              <p className="text-xs text-gray-500 pt-2">
                *Disclaimer: This is an estimate based on statutory minimums and does not account for company policy, contract terms, or pending litigation. Consult a legal professional for exact figures.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}