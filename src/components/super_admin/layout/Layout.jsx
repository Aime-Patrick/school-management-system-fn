import React from 'react';
import { Outlet } from 'react-router-dom';
import SaSidebar from './SaSidebar';
import { SaHeader } from './SaHeader';

export const SaDashboardLayout = () => (
  <div className="flex !bg-gray-50 h-screen overflow-hidden">
    <SaSidebar />
    <div className="flex-1 flex flex-col h-screen">
      <SaHeader />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);