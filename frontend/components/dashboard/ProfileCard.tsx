'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileCard({ onChangePassword }) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Username</p>
          <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={onChangePassword}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Change Password
      </button>
    </div>
  );
}