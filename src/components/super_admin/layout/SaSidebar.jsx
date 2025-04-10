import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  UserCog,
  CreditCard,
  BookOpen,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Logo } from './logo';

const SaSidebarItem = ({ 
  icon, 
  label, 
  onClick,
  to, 
  active,
  hasDropdown, 
  isOpen,
  children }) => {
   
    return(
    <div>
      <div 
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors
        ${active ? 'bg-white bg-opacity-10 text-white' : 'text-white/70 hover:bg-white/5'}`}
        onClick={onClick}
      >
        <Link to={to} className='flex items-center gap-3' onClick={() => handleNavClick(`${label}`)}>{icon}
        <span className="text-sm font-medium flex-1">{label}</span>
        </Link>
        {hasDropdown && (
          <ChevronDown 
            size={16} 
            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </div>
      {isOpen && children && (
        <div className="ml-6 space-y-1 mt-1">
          {children}
        </div>
      )}
    </div>)
  }
  const SaSidebar = ({ onLogoClick }) => {
    const location = useLocation(); // Get the current route
    const navigate = useNavigate();
  
    return (
      <div className="w-64 bg-blue-600 min-h-screen p-4 flex flex-col">
        <Logo onClick={onLogoClick} />
  
        <nav className="space-y-1 flex-1">
          <SaSidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            to="/sadmin/"
            active={location.pathname === "/sadmin"}
          />
          <SaSidebarItem
            icon={<School size={20} />}
            label="Schools"
            to="/sadmin/schools"
            active={location.pathname.startsWith("/sadmin/schools")}
          />
          <SaSidebarItem
            icon={<Users size={20} />}
            label="Users"
            to="/sadmin/users"
            active={location.pathname.startsWith("/sadmin/users")}
          />
          <SaSidebarItem
            icon={<CreditCard size={20} />}
            label="Payment"
            to="/sadmin/payment"
            active={location.pathname.startsWith("/sadmin/payment")}
          />
          <SaSidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            to="/sadmin/settings"
            active={location.pathname.startsWith("/sadmin/settings")}
          />
        </nav>
  
        <div className="mt-auto">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces"
                alt="Profile"
                className="rounded-full"
              />
            </div>
            <div className="text-white text-sm font-medium">Anna Karin</div>
            <div className="text-white/70 text-xs">anna@email.com</div>
          </div>
        </div>
      </div>
    );
  };

export default SaSidebar;
