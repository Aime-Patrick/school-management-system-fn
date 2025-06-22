import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bell,
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  Settings,
  Menu as MenuIcon,
  X as CloseIcon,
} from 'lucide-react';
import { Logo } from '../../layout/Logo';

const navItems = [
  {
    icon: <LayoutDashboard size={20} />,
    label: 'Dashboard',
    path: '/teacher'
  },
  {
    icon: <FileText size={20} />,
    label: 'Classes',
    path: '/teacher/classes'
  },
  {
    icon: <MessageSquare size={20} />,
    label: 'Appeals',
    path: '/teacher/appeals'
  },
  {
    icon: <TrendingUp size={20} />,
    label: 'Performance',
    path: '/teacher/performance'
  },
  {
    icon: <Bell size={20} />,
    label: 'Announcements',
    path: '/teacher/announcements'
  },
  {
    icon: <Users size={20} />,
    label: 'Parent Meetings',
    path: '/teacher/parent-meetings'
  },
  {
    icon: <Bell size={20} />,
    label: 'Notifications',
    path: '/teacher/notifications'
  }
];

export const TeacherSidebar = ({ onLogoClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

  // Handle window resize for responsiveness
  React.useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile/Tablet Hamburger */}
      <button
        className="fixed top-4 left-4 z-[999] lg:hidden bg-blue-600 p-2 rounded-full shadow-lg text-white"
        onClick={() => setCollapsed(false)}
        aria-label="Open sidebar"
        style={{ display: collapsed ? 'block' : 'none' }}
      >
        <MenuIcon size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full bg-blue-600 transition-all duration-300
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          w-64 lg:static lg:translate-x-0 lg:flex
        `}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-4">
            <Logo onClick={onLogoClick} />
            <button
              className="lg:hidden text-white"
              onClick={() => setCollapsed(true)}
              aria-label="Close sidebar"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-white w-full rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-white/10 font-semibold'
                    : 'hover:bg-white/5'
                  }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => {
              navigate('/teacher/settings');
              if (window.innerWidth < 1024) setCollapsed(true);
            }}
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg mt-4"
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>

          <div className="mt-4 bg-white/10 rounded-xl p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces"
                alt="Profile"
                className="rounded-full"
              />
            </div>
            <div className="text-white text-sm font-medium">Anna Karin</div>
            <div className="text-white/70 text-xs">annakarin@gmail.com</div>
          </div>
        </div>
      </aside>
      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
};
