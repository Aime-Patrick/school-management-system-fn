import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "./Sidebar";
import { Header } from "./Header";

const SchoolLayout = () => {
  // State to control sidebar visibility (for mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 h-screen">
      {/* Sidebar: pass open state and toggle handler */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header: pass toggle handler */}
        <Header onSidebarToggle={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SchoolLayout