import React from 'react';
import { StudentStats } from './StudentStats';
import { LatestMarks } from './LatestMarks';
import { PerformanceGraph } from './PerformanceGraph';
import { Announcements } from './Announcements';
import { useStudentById } from '../../../hooks/useStudentById';
import { useAuth } from '../../../hooks/useAuth';
export const StudentDashboard = () => {
  const { authData } = useAuth();
  const { data, isLoading, error, } = useStudentById(authData?.userId);
  if (isLoading) return <div>Loading...</div>;
  const studentData = {
    name: `${data?.firstName} ${data?.lastName}`,
    currentClass: data?.class.name,
    disciplineCases: 12,
    previousTermImprovement: 89,
    currentTermProgress: 89,
  };

  return (
    <div className="p-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back, <span className='text-lg text-gray-500'>{studentData.name}</span></h1>
        <p className="text-gray-600">You are the student of the year!!!</p>
      </div>

      <StudentStats data={studentData} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Latest Marks</h2>
        <LatestMarks />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <PerformanceGraph />
        </div>
        <div>
          <Announcements />
        </div>
      </div>
    </div>
  );
};
