import React, { useState } from 'react';
import Sidebar from '../school/layout/Sidebar';
import { Header } from '../school/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

export const AccountSettings = () => {
  const { authData } = useAuth();
  const { updateProfile, updateProfileLoading, changePassword, changePasswordLoading } = useProfile();
  const [fullName, setFullName] = useState(authData.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Update name if changed
    if (fullName.trim() && fullName.trim() !== authData.username) {
      await new Promise((resolve) => updateProfile({ profileData: { username: fullName.trim() } }, resolve));
    }
    // Change password if both fields are filled
    if (currentPassword && newPassword) {
      await new Promise((resolve) => changePassword({ currentPassword, newPassword }, resolve));
      setCurrentPassword('');
      setNewPassword('');
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Account Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
          <form className="bg-white rounded-xl shadow-sm p-6 max-w-2xl" onSubmit={handleSave}>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    aria-label="Full Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={authData.email}
                    aria-label="Email Address"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Password</h2>
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    aria-label="Current Password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    aria-label="New Password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                disabled={saving || updateProfileLoading || changePasswordLoading}
              >
                {saving || updateProfileLoading || changePasswordLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};