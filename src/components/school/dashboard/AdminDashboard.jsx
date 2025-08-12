import React from 'react';
import { StatsCard } from './StatsCard';
import { Users, BookOpen, DollarSign, UserCog } from 'lucide-react';
import { useSchoolStudent } from '../../../hooks/useSchoolStudent';
import { useAuth } from '../../../hooks/useAuth';
import { useTeacherBySchoolId } from '../../../hooks/useTeacherBySchool';
import { useClassBySchoolId } from '../../../hooks/useClassesBySchoolId';
import { useStudentPayment } from '../../../hooks/useStudentPayment';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const AdminDashboard = () => {
  // Auth for schoolId
  const { authData } = useAuth();
  const schoolId = authData?.schoolId;

  // Students
  const { students, isLoading: studentsLoading } = useSchoolStudent();
  // Teachers
  const { teachers, isLoading: teachersLoading } = useTeacherBySchoolId(schoolId);
  // Classes
  const { classes, isLoading: classesLoading } = useClassBySchoolId(schoolId);
  // Revenue
 const { data: payments, isLoading: paymentsLoading } = useStudentPayment();

  // Use real data if available, otherwise dumbdata
  const studentsData = students && students.length > 0 ? students : 0;
  const teachersData = teachers && teachers.length > 0 ? teachers : 0;
  const classesData = classes && classes.length > 0 ? classes : 0;
  const paymentsData = payments && payments.length > 0 ? payments : 0;

  // Stats array
  const stats = [
    {
      title: 'Total Students',
      value: studentsLoading ? <span className="animate-spin">...</span> : (students ? students.length : dumbStudents.length),
      change: 0,
      icon: <Users className="text-navy-600" />,
    },
    {
      title: 'Total Teachers',
      value: teachersLoading ? <span className="animate-spin">...</span> : (teachers ? teachers.length : dumbTeachers.length),
      change: 0,
      icon: <UserCog className="text-navy-600" />,
    },
    {
      title: 'Total Classes',
      value: classesLoading ? <span className="animate-spin">...</span> : (classes ? classes.length : dumbClasses.length),
      change: 0,
      icon: <BookOpen className="text-navy-600" />,
    },
    {
      title: 'Total Revenue',
      value: paymentsLoading ? <span className="animate-spin">...</span> : (payments && payments.length > 0 ? `$${payments.totalPayment}` : `$0`),
      change: 0,
      icon: <DollarSign className="text-navy-600" />,
    },
  ];

  // Helper for chart data by year
  const getChartDataByYear = (items, dateField, label, color, sumField) => {
    if (!items || items.length === 0 || !items[0][dateField]) return null;
    const countsByYear = {};
    items.forEach(item => {
      const year = new Date(item[dateField]).getFullYear();
      if (sumField) {
        countsByYear[year] = (countsByYear[year] || 0) + (item[sumField] || 0);
      } else {
        countsByYear[year] = (countsByYear[year] || 0) + 1;
      }
    });
    const labels = Object.keys(countsByYear).sort();
    const data = labels.map(year => countsByYear[year]);
    return {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          backgroundColor: color + '22',
          fill: true,
        },
      ],
    };
  };

  // Students chart
  let studentsChartContent;
  if (studentsLoading) {
    studentsChartContent = <div className="flex items-center justify-center h-[250px] text-gray-400">Loading chart...</div>;
  } else {
    const chartData = getChartDataByYear(studentsData, 'createdAt', 'Students Joined', '#3B82F6');
    studentsChartContent = chartData ? (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 md:p-4 h-[250px] md:h-[320px]">
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Student Enrollment Over Time' }
            },
            scales: { y: { beginAtZero: true } }
          }}
          data={chartData}
          height={320}
        />
      </div>
    ) : <div className="flex items-center justify-center h-[250px] text-gray-400">No student data for chart</div>;
  }

  // Teachers chart
  let teachersChartContent;
  if (teachersLoading) {
    teachersChartContent = <div className="flex items-center justify-center h-[250px] text-gray-400">Loading chart...</div>;
  } else {
    const chartData = getChartDataByYear(teachersData, 'createdAt', 'Teachers Joined', '#22C55E');
    teachersChartContent = chartData ? (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 md:p-4 h-[250px] md:h-[320px] flex items-center justify-center">
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false, // <-- Add this!
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Teacher Hiring Over Time' }
            },
            scales: { y: { beginAtZero: true } }
          }}
          data={chartData}
          height={320}
        />
      </div>
    ) : <div className="flex items-center justify-center h-[250px] text-gray-400">No teacher data for chart</div>;
  }

  // Table data: students list
  let studentsTableContent;
  if (studentsLoading) {
    studentsTableContent = <div className="flex items-center justify-center h-48 text-gray-400">Loading table...</div>;
  } else {
    studentsTableContent = (
      <div className="overflow-x-auto w-full">
        <div className="font-semibold text-navy-800 mb-1 sticky top-0 bg-white z-10">Students</div>
        <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
          <thead className="bg-gray-50 sticky top-6 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.slice(0, 10).map((student, idx) => (
              <tr key={student._id || idx} className="border-t border-gray-100">
                <td className="px-4 py-2">{student.firstName} {student.lastName}</td>
                <td className="px-4 py-2">{student.accountCredentails?.email || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {student.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Table data: teachers list
  let teachersTableContent;
  if (teachersLoading) {
    teachersTableContent = <div className="flex items-center justify-center h-48 text-gray-400">Loading table...</div>;
  } else {
    teachersTableContent = (
      <div className="overflow-x-auto w-full">
        <div className="font-semibold text-navy-800 mb-1 sticky top-0 bg-white z-10">Teachers</div>
        <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
          <thead className="bg-gray-50 sticky top-6 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {teachersData.slice(0, 10).map((teacher, idx) => (
              <tr key={teacher._id || idx} className="border-t border-gray-100">
                <td className="px-4 py-2">{teacher.firstName} {teacher.lastName}</td>
                <td className="px-4 py-2">{teacher.accountCredentails?.email || 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {teacher.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Table data: classes list
  let classesTableContent;
  if (classesLoading) {
    classesTableContent = <div className="flex items-center justify-center h-48 text-gray-400">Loading table...</div>;
  } else if (Array.isArray(classes) && classes.length > 0) {
    classesTableContent = (
      <div className="overflow-x-auto w-full">
        <div className="font-semibold text-navy-800 mb-1 sticky top-0 bg-white z-10">Classes</div>
        <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
          <thead className="bg-gray-50 sticky top-6 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Class Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Combinations</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Created At</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, idx) => (
              <tr key={cls._id || idx} className="border-t border-gray-100">
                <td className="px-4 py-2">{cls.name || 'N/A'}</td>
                <td className="px-4 py-2">
                  {Array.isArray(cls.combinations) && cls.combinations.length > 0
                    ? cls.combinations.map((comb) => comb.name).join(', ')
                    : <span className="text-gray-400">None</span>
                  }
                </td>
                <td className="px-4 py-2">{cls.createdAt ? new Date(cls.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    classesTableContent = (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No class data available.
      </div>
    );
  }

  // Table data: revenue/payments list
  let revenueTableContent;
  if (paymentsLoading) {
    revenueTableContent = <div className="flex items-center justify-center h-48 text-gray-400">Loading table...</div>;
  } else if (paymentsData && Array.isArray(paymentsData.payments) && paymentsData.payments.length > 0) {
    revenueTableContent = (
      <div className="overflow-x-auto w-full">
        <div className="font-semibold text-navy-800 mb-1 sticky top-0 bg-white z-10">Payments</div>
        <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
          <thead className="bg-gray-50 sticky top-6 z-10">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Amount</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentsData.payments.slice(0, 10).map((p, idx) => (
              <tr key={p._id || idx} className="border-t border-gray-100">
                <td className="px-4 py-2">${p.amount}</td>
                <td className="px-4 py-2">{p.date ? new Date(p.date).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    {p.status || 'Paid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    revenueTableContent = (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No payment data available.
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 w-full">
      {/* Welcome Message */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-navy-800 mb-0.5">
          Welcome to your dashboard{authData?.username ? `, ${authData.username}` : ''}!
        </h1>
        <p className="text-navy-800 text-base">
          Here you can monitor your school's key stats and activities.
        </p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
      {/* Analytics Section: Only show students/teachers charts, all tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        <div>
          {/* Students chart and table */}
          {studentsChartContent}
          <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-100 p-1 md:p-2 min-h-40 overflow-y-auto text-xs">
            {studentsTableContent}
          </div>
          {/* Classes table only */}
          <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-100 p-1 md:p-2 min-h-40 overflow-y-auto text-xs">
            {classesTableContent}
          </div>
        </div>
        <div>
          {/* Teachers chart and table */}
          {teachersChartContent}
          <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-100 p-1 md:p-2 min-h-40 overflow-y-auto text-xs">
            {teachersTableContent}
          </div>
          {/* Revenue table only */}
          <div className="mt-3 bg-white rounded-lg shadow-sm border border-gray-100 p-1 md:p-2 min-h-40 overflow-y-auto text-xs">
            {revenueTableContent}
          </div>
        </div>
      </div>
    </div>
  );
};