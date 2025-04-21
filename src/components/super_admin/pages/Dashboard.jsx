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
  const {payments, isLoading:paymentLoading} = usePayment();

  if (isLoading || studentsLoading || usersLoading || paymentLoading) return <div className='p-6 flex justify-center items-center h-screen'>
    <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: '2rem' }}></i>
  </div>;
  return (
    <div className="p-6">
        <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome Back, Super Admin!
        </h1>
        <p className="text-gray-600">Enjoy World's No.1 Education Software</p>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <SaStatsCard
          title="Total Schools"
          value={`${schools?.length}`}
          change={15}
          icon={<School className="text-blue-600" />}
        />
        <SaStatsCard
          title="Total Students"
          value={`${students?.length}`}
          change={-1.9}
          icon={<Users className="text-blue-600" />}
        />
        <SaStatsCard
          title="Total Income"
          value={`${payments?.totalPayment || 0}`}
          change={15}
          icon={<DollarSign className="text-blue-600" />}
        />
        <SaStatsCard
          title="Total Users"
          value={`${users?.length}`}
          change={15}
          icon={<UserCircle className="text-blue-600" />}
        />
      </div>
  
      <SaSchoolsTable />
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <SaClaimsChart />
        </div>
        <SaSchoolsStats />
      </div>
    </div>
  )
}