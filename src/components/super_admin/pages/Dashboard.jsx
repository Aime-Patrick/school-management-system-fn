import React from 'react'
import { SaStatsCard } from '../dashboard/SaStatsCard';
import { SaSchoolsTable } from "../dashboard/SaSchoolsTable";
import { SaSchoolsStats } from "../dashboard/SaSchoolsStats";
import { School, Users, DollarSign, UserCircle } from "lucide-react";
import { SaClaimsChart } from "../dashboard/SaClaimsChart";
import { useSchools } from '../../../hooks/useSchool';
import { useStudents } from '../../../hooks/useStudent';
import { useUsers } from '../../../hooks/useUsers';
import { usePayment } from '../../../hooks/usePayment';

export const SaDashboardHome = () => {
  const { schools, isLoading } = useSchools();
  const { students, isLoading: studentsLoading } = useStudents();
  const { users, isLoading: usersLoading } = useUsers();
  const { payments, isLoading: paymentLoading } = usePayment();

  if (isLoading || studentsLoading || usersLoading || paymentLoading)
    return (
      <div className='p-6 flex justify-center items-center h-screen'>
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: '2rem' }}></i>
      </div>
    );

  return (
    <div className="p-0 md:p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen w-full overflow-x-hidden">
      <div className="mb-8 px-4 md:px-0">
        <h1 className="text-3xl font-bold text-blue-900 mb-1 animate-fade-in-down">
          Welcome Back, Super Admin!
        </h1>
        <p className="text-blue-700 text-lg animate-fade-in-down delay-100">
          Enjoy World's No.1 Education Software
        </p>
      </div>

      {/* Stats Cards with subtle scroll animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 px-4 md:px-0">
        <div className="animate-slide-in-up delay-100">
          <SaStatsCard
            title="Total Schools"
            value={`${schools?.length}`}
            change={15}
            icon={<School className="text-blue-600" />}
          />
        </div>
        <div className="animate-slide-in-up delay-200">
          <SaStatsCard
            title="Total Students"
            value={`${students?.length}`}
            change={-1.9}
            icon={<Users className="text-blue-600" />}
          />
        </div>
        <div className="animate-slide-in-up delay-300">
          <SaStatsCard
            title="Total Income"
            value={`${payments?.totalPayment || 0}`}
            change={15}
            icon={<DollarSign className="text-blue-600" />}
          />
        </div>
        <div className="animate-slide-in-up delay-400">
          <SaStatsCard
            title="Total Users"
            value={`${users?.length}`}
            change={15}
            icon={<UserCircle className="text-blue-600" />}
          />
        </div>
      </div>

      {/* Schools Table with fade-in animation */}
      <div className="animate-fade-in-up delay-500 px-4 md:px-0">
        <SaSchoolsTable />
      </div>

      {/* Charts and Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 px-4 md:px-0">
        <div className="lg:col-span-2 animate-fade-in-up delay-700">
          <SaClaimsChart />
        </div>
        <div className="animate-fade-in-up delay-900">
          <SaSchoolsStats />
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-900 { animation-delay: 0.9s; }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(60px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};