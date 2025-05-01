import React from 'react';
import  Sidebar  from '../school/layout/Sidebar';
import { Header } from '../school/layout/Header';
import { ClaimsChart } from '../school/dashboard/ClaimsChart';
import { SchoolsStats } from '../school/dashboard/SchoolsStats';
import { useAuth } from '../../hooks/useAuth';
export const ProfilePage = () => {
  const { authData } = useAuth();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
            <p className="text-gray-600">View and manage your profile</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces"
                    alt="Profile"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold">{authData.username}</h2>
                  <p className="text-gray-600 capitalize">{authData.role}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{authData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <p className="font-medium">{authData.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Phone</label>
                    <p className="font-medium">{authData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid gap-6">
                <ClaimsChart />
                <SchoolsStats />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
