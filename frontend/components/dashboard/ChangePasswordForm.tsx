'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ChangePasswordForm({ isVisible, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { changePassword } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    try {
      await changePassword(oldPassword, newPassword);
      setSuccess('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="space-y-4">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="flex space-x-3">
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Update Password
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}