import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from "./Sidebar";
import {Header} from "./Header";
const SchoolLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <div className="flex-1">
      <Header />
      <main className='flex-grow container mx-auto px-4 py-6'><Outlet /></main>
    </div>
  </div>
  )
}

export default SchoolLayout