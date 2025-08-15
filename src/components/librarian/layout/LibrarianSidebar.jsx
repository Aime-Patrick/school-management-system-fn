import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Menu as MenuIcon,
  X as CloseIcon,
  Library,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Logo } from '../../layout/Logo';

const navItems = [
  {
    icon: <LayoutDashboard size={20} />,
    label: 'Dashboard',
    path: '/librarian'
  },
  {
    icon: <BookOpen size={20} />,
    label: 'Books',
    path: '/librarian/books'
  },
  {
    icon: <Users size={20} />,
    label: 'Members',
    path: '/librarian/members'
  },
  {
    icon: <Library size={20} />,
    label: 'Borrowing',
    path: '/librarian/borrow'
  },
  {
    icon: <Calendar size={20} />,
    label: 'Reservations',
    path: '/librarian/reservations'
  },
  {
    icon: <DollarSign size={20} />,
    label: 'Fines',
    path: '/librarian/fines'
  },
  {
    icon: <BarChart3 size={20} />,
    label: 'Reports',
    path: '/librarian/reports'
  }
];

export const LibrarianSidebar = ({ onLogoClick }) => {
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
        className="fixed top-4 left-4 z-[999] lg:hidden bg-navy-800 p-2 rounded-full shadow-lg text-white"
        onClick={() => setCollapsed(false)}
        aria-label="Open sidebar"
        style={{ display: collapsed ? 'block' : 'none' }}
      >
        <MenuIcon size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed z-40 top-0 left-0 h-full bg-navy-800 transition-all duration-300
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

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) setCollapsed(true);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-white w-full rounded-lg transition-colors
                  ${
                    isActive(item.path)
                      ? "bg-white bg-opacity-10 text-white"
                      : "text-white/70 hover:bg-white/5"
                  }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Settings */}
          <button
            onClick={() => {
              navigate("/librarian/settings");
              if (window.innerWidth < 1024) setCollapsed(true);
            }}
            className={`flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg mt-4
              ${isActive('/librarian/settings') ? 'bg-white/10' : ''}`}
          >
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>
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
