import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { TeacherSidebar } from "./TeacherSidebar";
import { TeacherHeader } from "./TeacherHeader";
import TeacherAccountSettings from "./components/teacher/pages/TeacherAccountSettings";

export const TeacherLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar */}
      <TeacherSidebar onLogoClick={() => navigate("/teacher/")} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <TeacherHeader />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto container mx-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
