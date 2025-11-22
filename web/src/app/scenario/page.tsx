"use client";

import Link from 'next/link';
import { BookOpen, Briefcase, ShoppingCart, Home as HomeIcon, Car } from 'lucide-react';

export default function ScenarioHub() {
  // In the future, you can fetch this list from the API
  const scenarios = [
    {
      id: 1,
      title: "Salary Not Paid?",
      description: "Your employer hasn't paid you for 2 months. Learn how to file a complaint and demand your rights.",
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      difficulty: "Beginner",
    },
    {
      id: 2,
      title: "Defective Product",
      description: "Shopkeeper refusing a return? Learn how to use the Consumer Protection Act to get a replacement or refund.",
      icon: <ShoppingCart className="w-8 h-8 text-purple-600" />,
      difficulty: "Beginner",
    },
    {
      id: 3,
      title: "Traffic Challan Trouble",
      description: "Stopped without a license? Learn about DigiLocker validity and how to handle fines.",
      icon: <Car className="w-8 h-8 text-orange-600" />,
      difficulty: "Beginner",
    },
    // Placeholder for future scenarios
    {
      id: 4,
      title: "Landlord Trouble (Coming Soon)",
      description: "Eviction threats or deposit issues? Navigate the Rent Control Act.",
      icon: <HomeIcon className="w-8 h-8 text-gray-400" />,
      difficulty: "Intermediate",
      disabled: true,
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gray-50">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Learn by Doing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a real-life legal scenario and play through it. Make choices, see the consequences, and learn your rights along the way.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scenarios.map((scenario) => (
            <Link 
              key={scenario.id} 
              href={scenario.disabled ? "#" : `/scenario/${scenario.id}`}
              className={`block p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 ${
                scenario.disabled 
                  ? "opacity-60 cursor-not-allowed" 
                  : "hover:shadow-md hover:border-blue-300"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {scenario.icon}
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                  scenario.disabled 
                    ? "bg-gray-100 text-gray-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {scenario.disabled ? "Soon" : scenario.difficulty}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {scenario.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {scenario.description}
              </p>
              
              {!scenario.disabled && (
                <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm">
                  Start Scenario &rarr;
                </div>
              )}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}