'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfileCard({ onChangePassword }) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="bg-indigo-100 p-3 rounded-full">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Username</p>
            <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="bg-purple-100 p-3 rounded-full">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="bg-green-100 p-3 rounded-full">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Account Status</p>
            <p className="text-lg font-semibold text-gray-900">Active</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
        <button
          onClick={onChangePassword}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}