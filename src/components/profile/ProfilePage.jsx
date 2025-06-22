import React, { useRef, useState } from 'react';
import Sidebar from '../school/layout/Sidebar';
import { Header } from '../school/layout/Header';
import { useAuth } from '../../hooks/useAuth';
import { Camera, X, Save, Edit3 } from 'lucide-react';
import { useCheckIfAdminHasSchool } from '../../hooks/useCheckIfAdminHasSchool';

export const ProfilePage = () => {
  const { authData } = useAuth();
  const { data: schoolData, isLoading: schoolLoading } = useCheckIfAdminHasSchool();

  const getProfileImage = () => {
    if (authData.profilePicture) return authData.profilePicture;
    return '';
  };

  const getInitials = () => {
    if (!authData.username) return '';
    return authData.username.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 bg-white">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-black">Profile</h1>
            <p className="text-gray-700">View your profile and school information</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block w-32 h-32 mx-auto mb-4">
                    {getProfileImage() ? (
                      <img
                        src={getProfileImage()}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow"
                      />
                    ) : (
                      <span className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-100 text-4xl text-blue-600 font-bold border-4 border-blue-400 shadow">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-black">{authData.username}</h2>
                  <p className="text-gray-700 capitalize">{authData.role}</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-black">{authData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <p className="font-medium capitalize text-black">{authData.role}</p>
                  </div>
                  {authData.phoneNumber && (
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium text-black">{authData.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-black">School Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">School Logo</label><br />
                    {schoolLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : schoolData?.schoolLogo ? (
                      <img src={schoolData.schoolLogo} alt="School Logo" className="w-24 h-24 object-contain rounded border border-blue-200" />
                    ) : (
                      <span className="text-gray-400">No logo</span>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">School Name</label>
                    <p className="font-medium text-black">{schoolData?.schoolName || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">School Code</label>
                    <p className="font-medium text-black">{schoolData?.schoolCode || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="font-medium text-black">{schoolData?.address || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Status</label>
                    <p className="font-medium capitalize text-black">{schoolData?.status || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Subscription Plan</label>
                    <p className="font-medium text-black">{schoolData?.subscriptionPlan || '-'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Subscription Start</label>
                      <p className="font-medium text-black">{schoolData?.subscriptionStart ? schoolData.subscriptionStart.slice(0,10) : '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Subscription End</label>
                      <p className="font-medium text-black">{schoolData?.subscriptionEnd ? schoolData.subscriptionEnd.slice(0,10) : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}; 