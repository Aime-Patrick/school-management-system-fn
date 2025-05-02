import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentHeader } from './StudentHeader';

export const StudentLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar */}
      <StudentSidebar onLogoClick={() => navigate('/student/')} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <StudentHeader />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto container mx-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
