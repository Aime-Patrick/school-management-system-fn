import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCheckSchool } from '../../hooks/useCheckSchool';
import { Mail, Phone, User, School, ShieldCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { authData } = useAuth();
  const { data: schoolData, isLoading: schoolLoading } = useCheckSchool();

  const getProfileImage = () => {
    if (authData.profilePicture) return authData.profilePicture;
    return '';
  };

  const getInitials = () => {
    if (!authData.username) return '';
    return authData.username.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy-800">My Profile</h1>
              <p className="text-blue-700 text-lg">View and manage your profile and school information</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col items-center animate-fade-in-up">
                  <div className="relative w-32 h-32 mb-4">
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
                  <h2 className="text-2xl font-bold text-navy-800 mb-1 flex items-center gap-2">
                    <User size={20} className="text-blue-400" />
                    {authData.username}
                  </h2>
                  <p className="text-blue-600 capitalize mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-400" />
                    {authData.role}
                  </p>
                  <div className="w-full space-y-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-400" />
                      <span className="font-medium text-blue-800 break-all">{authData.email}</span>
                    </div>
                    {authData.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-blue-400" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="font-medium text-blue-800">{authData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* School Info Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 animate-fade-in-up delay-200">
                  <div className="mb-6 flex items-center gap-3">
                    <School size={28} className="text-blue-400" />
                    <h2 className="text-xl font-bold text-navy-800">School Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center md:items-start">
                      <label className="text-sm text-gray-600 mb-1">School Logo</label>
                      {schoolLoading ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : schoolData?.schoolLogo ? (
                        <img
                          src={schoolData.schoolLogo}
                          alt="School Logo"
                          className="w-24 h-24 object-contain rounded border border-blue-200 bg-white"
                        />
                      ) : (
                        <span className="text-gray-400">No logo</span>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">School Name</label>
                      <p className="font-medium text-navy-800">{schoolData?.schoolName || '-'}</p>
                      <label className="text-sm text-gray-600 mt-3 block">School Code</label>
                      <p className="font-medium text-navy-800">{schoolData?.schoolCode || '-'}</p>
                      <label className="text-sm text-gray-600 mt-3 block">Address</label>
                      <p className="font-medium text-navy-800">{schoolData?.address || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <p className={`font-medium capitalize ${schoolData?.status === "active" ? "text-green-700" : "text-red-700"}`}>
                        {schoolData?.status || '-'}
                      </p>
                      <label className="text-sm text-gray-600 mt-3 block">Subscription Plan</label>
                      <p className="font-medium text-navy-800">{schoolData?.subscriptionPlan || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Subscription Start</label>
                        <p className="font-medium text-navy-800">
                          {schoolData?.subscriptionStart ? schoolData.subscriptionStart.slice(0, 10) : '-'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Subscription End</label>
                        <p className="font-medium text-navy-800">
                          {schoolData?.subscriptionEnd ? schoolData.subscriptionEnd.slice(0, 10) : '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-200 { animation-delay: 0.2s; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};