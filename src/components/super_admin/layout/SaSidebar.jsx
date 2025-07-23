import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  CreditCard,
  Settings,
  CircleDollarSign,
  Menu
} from 'lucide-react';
import { Logo } from '../layout/Logo';

const SaSidebarItem = ({
  icon,
  label,
  to,
  active,
  onClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === active;
  return (
    <div
      className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-colors
        ${isActive ? 'bg-white bg-opacity-10 text-white' : 'text-white/70 hover:bg-white/10'}`}
      onClick={() => {
        navigate(to);
        if (onClick) onClick();
      }}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};

const SaSidebar = ({ onLogoClick }) => {
  const [open, setOpen] = useState(false);

  // Responsive: show drawer on small screens, sidebar on md+
  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-navy-800 p-2 rounded-full text-white shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-navy-800 p-4 flex flex-col w-64 min-w-[200px] transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >
        <div className="mb-8">
          <Logo onClick={onLogoClick} />
        </div>
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <SaSidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            to="/sadmin"
            active="/sadmin"
            onClick={() => setOpen(false)}
          />
          <SaSidebarItem
            icon={<School size={20} />}
            label="Schools"
            to="/sadmin/schools"
            active="/sadmin/schools"
            onClick={() => setOpen(false)}
          />
          <SaSidebarItem
            icon={<Users size={20} />}
            label="Users"
            to="/sadmin/users"
            active="/sadmin/users"
            onClick={() => setOpen(false)}
          />
          <SaSidebarItem
            icon={<CreditCard size={20} />}
            label="Payment"
            to="/sadmin/payment"
            active="/sadmin/payment"
            onClick={() => setOpen(false)}
          />
          <SaSidebarItem
            icon={<CircleDollarSign size={20} />}
            label="Subscription"
            to="/sadmin/subscription"
            active="/sadmin/subscription"
            onClick={() => setOpen(false)}
          />
          <SaSidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            to="/sadmin/settings"
            active="/sadmin/settings"
            onClick={() => setOpen(false)}
          />
        </nav>
      </aside>
    </>
  );
};

export default SaSidebar;
