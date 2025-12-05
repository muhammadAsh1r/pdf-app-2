'use client';

import React from 'react';
import { Shield } from 'lucide-react';

const dummyData = [
  { id: 1, title: 'Secret Project Alpha', description: 'Top secret research initiative', status: 'Active' },
  { id: 2, title: 'Confidential Report Q4', description: 'Financial projections and analysis', status: 'Completed' },
  { id: 3, title: 'VIP Client Data', description: 'Premium customer information', status: 'Active' },
  { id: 4, title: 'Strategic Planning Docs', description: 'Future roadmap and objectives', status: 'Active' },
  { id: 5, title: 'Market Research Analysis', description: 'Competitive intelligence report', status: 'Active' },
  { id: 6, title: 'Security Audit Report', description: 'Internal security assessment', status: 'Completed' },
];

export default function ProtectedDataGrid() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Protected Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyData.map((item) => (
          <div 
            key={item.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              <span>Protected Resource</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}