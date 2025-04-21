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
  ChevronDown,
  CircleDollarSign
} from 'lucide-react';
import { Logo } from '../layout/Logo';
import { useAuth } from '../../../hooks/useAuth';
const SaSidebarItem = ({ 
  icon, 
  label, 
  onClick,
  to, 
  active,
  hasDropdown, 
  isOpen,
  children }) => {
   const navigate = useNavigate()
   const location = useLocation();
    const isActive = (path) => {
      return location.pathname === path;
    };
    return(
    <div>
      <div 
        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors
        ${isActive(active) ? 'bg-white bg-opacity-10 text-white' : 'text-white/70 hover:bg-white/5'}`}
        onClick={()=>navigate(to)}
      >
        <div className='flex items-center gap-3' onClick={() => handleNavClick(`${label}`)}>{icon}
        <span className="text-sm font-medium flex-1">{label}</span>
        </div>
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
   const {authData} = useAuth();
    return (
      <div className="w-64 bg-blue-600 p-4 flex flex-col justify-between">
        <Logo onClick={onLogoClick} />
  
        <nav className="space-y-1 flex-1">
          <SaSidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            to="/sadmin"
            active={"/sadmin"}
          />
          <SaSidebarItem
            icon={<School size={20} />}
            label="Schools"
            to="/sadmin/schools"
            active={"/sadmin/schools"}
          />
          <SaSidebarItem
            icon={<Users size={20} />}
            label="Users"
            to="/sadmin/users"
            active={"/sadmin/users"}
          />
          <SaSidebarItem
            icon={<CreditCard size={20} />}
            label="Payment"
            to="/sadmin/payment"
            active={"/sadmin/payment"}
          />
          <SaSidebarItem
            icon={<CircleDollarSign size={20} />}
            label="Subscription"
            to="/sadmin/subscription"
            active={"/sadmin/subscription"}
          />
          <SaSidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            to="/sadmin/settings"
            active={"/sadmin/settings"}
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
            <div className="text-white text-sm font-medium">{authData?.username}</div>
            <div className="text-white/70 text-xs">{authData?.email}</div>
          </div>
        </div>
      </div>
    );
  };

export default SaSidebar;
