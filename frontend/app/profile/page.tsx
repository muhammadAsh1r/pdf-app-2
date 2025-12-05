'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileCard from '@/components/profile/ProfileCard';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';

export default function ProfilePage() {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <ProfileCard onChangePassword={() => setShowChangePassword(!showChangePassword)} />
          
          {showChangePassword && (
            <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}