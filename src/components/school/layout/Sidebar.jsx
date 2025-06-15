import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  School, 
  Users, 
  UserCog,
  CreditCard,
  BookOpen,
  Settings,
  ChevronDown,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Logo } from '../../layout/Logo';
import { useAuth } from '../../../hooks/useAuth';

const isActive = (path) => {
  return location.pathname === path;
};
const SidebarItem = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  hasDropdown, 
  isOpen,
  children 
}) => (
  <div>
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
      ${isActive(active) ? 'bg-white bg-opacity-10 text-white' : 'text-white/70 hover:bg-white/5'}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium flex-1">{label}</span>
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
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [activeItem,setActiveItem] = useState('');
  const { authData } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };
  return (
    <div className="w-64 bg-blue-600 min-h-screen p-4 flex flex-col">
      <Logo />

      <nav className="space-y-1 flex-1">
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard"  
          active={'/school-admin'}
          onClick={() => navigate('/school-admin')} 
        />  
        <SidebarItem 
          icon={<Users size={20} />} 
          label="Students" 
          hasDropdown
          isOpen={isStudentsOpen}
          active={'/school-admin/students'}
          onClick={() => setIsStudentsOpen(!isStudentsOpen)}
        >
          <div 
            className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
              isActive('/school-admin/students') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
            onClick={() => navigate('/school-admin/students')}
          >
            All Students
          </div>
          {/* <div 
            className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
              isActive('/school-admin/students') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
            onClick={() => navigate('/students')}
            // navigate('/dashboard/students/admission')}
          >
            Admission Form
          </div>
          <div 
            className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
              isActive('/school-admin/students') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
            onClick={() => navigate('/students')}
            // navigate('/dashboard/students/promotion')}
          >
            Student Promotion
          </div> */}
        </SidebarItem>
        <SidebarItem 
          icon={<UserCog size={20} />} 
          label="Class" 
          onClick={() => setIsClassOpen(!isClassOpen)}
          hasDropdown
          isOpen={isClassOpen}
        >
          <div 
            className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
              isActive('/school-admin/class') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
            onClick={() => navigate('/school-admin/class')}
          >
            All class
          </div>
          <div 
            className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
              isActive('/school-admin/timetable') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
            }`}
            onClick={() => navigate('/school-admin/timetables')}
          >
            Timetables
          </div>
        </SidebarItem>
        <SidebarItem 
          icon={<UserCog size={20} />} 
          label="Teachers" 
          active={'/school-admin/teachers'}
          onClick={() => navigate('/school-admin/teachers')} 
        />
          <SidebarItem 
          icon={<Calendar size={20} />} 
          label="Academic" 
          hasDropdown 
          isOpen={isAcademicOpen} 
          onClick={() => setIsAcademicOpen(!isAcademicOpen)}
        >
          <div 
            className={`text-white/70 hover:bg-white/5 py-2 px-4 rounded-lg cursor-pointer text-sm ${
              activeItem === 'academic-year' ? 'bg-white/10' : ''
            }`}
            onClick={() => {
              setActiveItem('academic-year');
              navigate('/school-admin/academic-year');
            }}
          >
            Academic Year
          </div>
          <div 
            className={`text-white/70 hover:bg-white/5 py-2 px-4 rounded-lg cursor-pointer text-sm ${
              activeItem === 'academic-term' ? 'bg-white/10' : ''
            }`}
            onClick={() => {
              setActiveItem('academic-term');
              navigate('/school-admin/academic-term');
            }}
          >
            Academic Term
          </div>
        </SidebarItem>

        <SidebarItem 
          icon={<CreditCard size={20} />} 
          label="Payment" 
          onClick={() => navigate('/school-admin/payment')} 
          // navigate('/dashboard/payment')} 
        />
        <SidebarItem 
          icon={<BookOpen size={20} />} 
          label="Courses" 
          onClick={() => navigate('/school-admin/courses')} 
        />
        <SidebarItem 
          icon={<MessageSquare size={20} />} 
          label="Messages" 
          onClick={() => navigate('/school-admin/messages')} 
        />
        <SidebarItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          onClick={() => navigate('/settings')} 
        />
      </nav>
    </div>
  );
};

export default Sidebar;