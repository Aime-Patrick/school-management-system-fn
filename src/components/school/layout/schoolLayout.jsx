import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "./Sidebar";
import {Header} from "./Header";
const SchoolLayout = () => {
  return (
  <div className="flex bg-gray-50 h-screen">
       <Sidebar />
  
        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <Header />
          <main className="flex-1 overflow-y-auto container mx-auto p-2">
            <Outlet />
          </main>
        </div>
      </div>
  )
}

export default SchoolLayout