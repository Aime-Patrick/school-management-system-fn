import React from 'react'
import SaSidebar from '../layout/SaSidebar';
import { SaHeader } from '../layout/SaHeader';
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
  console.log("Payments:", payments);

  if (isLoading || studentsLoading || usersLoading || paymentLoading)
    return (
      <div className='p-6 flex justify-center items-center h-screen'>
        <i className="pi pi-spin pi-spinner text-navy-700" style={{ fontSize: '2rem' }}></i>
      </div>
    );

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-8 w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SaStatsCard
              title="Total Schools"
              value={`${schools?.length}`}
              change={15}
              icon={<School className="text-navy-600" />}
            />
            <SaStatsCard
              title="Total Students"
              value={`${students?.length}`}
              change={-1.9}
              icon={<Users className="text-navy-600" />}
            />
            <SaStatsCard
              title="Total Income"
              value={`$${payments?.totalPayment || 0}`}
              change={15}
              icon={<DollarSign className="text-navy-600" />}
            />
            <SaStatsCard
              title="Total Users"
              value={`${users?.length}`}
              change={15}
              icon={<UserCircle className="text-navy-600" />}
            />
          </div>
          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SaClaimsChart />
            </div>
            <div>
              <SaSchoolsStats />
            </div>
          </div>
          {/* Schools Table */}
          <div className="mb-8">
            <SaSchoolsTable />
          </div>
        </div>
      </div>
    </div>
  );
};