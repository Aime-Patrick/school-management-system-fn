import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LibrarianSidebar } from "./LibrarianSidebar";
import { LibrarianHeader } from "./LibrarianHeader";

export const LibrarianLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar */}
      <LibrarianSidebar onLogoClick={() => navigate("/librarian/")} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <LibrarianHeader />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LibrarianLayout;
