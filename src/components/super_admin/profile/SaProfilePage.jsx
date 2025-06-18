import React from 'react';
import { SaClaimsChart } from '../dashboard/SaClaimsChart';
import { SaSchoolsStats } from '../dashboard/SaSchoolsStats';
import { useAuth } from '../../../hooks/useAuth';
export const SaProfilePage = ({ onBack }) => {
  const { authData } = useAuth();
  console.log(authData);
  // Example user data, replace with real user data from context or props
  const user = {
    name: authData.username,
    email: authData.email,
    role: authData.role,
    joined: "January 2024",
    avatar: authData.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=faces"
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="flex-1">
        <main className="p-6">
          <div className="mb-8 animate-fade-in-down">
            <h1 className="text-3xl font-bold text-blue-900">My Profile</h1>
            <p className="text-blue-700 text-lg">View and manage your profile information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1 animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4 border-4 border-blue-100 shadow"
                />
                <h2 className="text-2xl font-bold text-blue-900 mb-1">{user.name}</h2>
                <p className="text-blue-600 mb-4">{user.role}</p>
                <div className="w-full space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-blue-800">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <p className="font-medium text-blue-800">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Member Since</label>
                    <p className="font-medium text-blue-800">{user.joined}</p>
                  </div>
                </div>
                <button
                  className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                  onClick={onBack}
                >
                  Back
                </button>
              </div>
            </div>
            {/* Profile Details/Charts */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up delay-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Activity Overview</h3>
                <SaClaimsChart />
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in-up delay-400">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">School Stats</h3>
                <SaSchoolsStats />
              </div>
            </div>
          </div>
          <style>{`
            .animate-fade-in-down {
              animation: fadeInDown 0.7s cubic-bezier(.4,0,.2,1) both;
            }
            .animate-fade-in-up {
              animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
            }
            .delay-200 { animation-delay: 0.2s; }
            .delay-400 { animation-delay: 0.4s; }
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-30px);}
              to { opacity: 1; transform: translateY(0);}
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px);}
              to { opacity: 1; transform: translateY(0);}
            }
          `}</style>
        </main>
      </div>
    </div>
  );
};
