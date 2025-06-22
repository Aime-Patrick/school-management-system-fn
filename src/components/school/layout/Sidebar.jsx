import React, { useState, useEffect } from 'react';
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

import { motion, AnimatePresence } from "framer-motion";

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
      ${active ? 'bg-white bg-opacity-10 text-white' : 'text-white/70 hover:bg-white/5'}`}
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
    <AnimatePresence initial={false}>
      {isOpen && children && (
        <motion.div
          className="ml-6 space-y-1 mt-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const { authData } = useAuth();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Overlay for mobile
  const Overlay = () =>
    !collapsed ? (
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
        onClick={() => setCollapsed(true)}
      />
    ) : null;

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 p-2 rounded-full shadow-lg text-white"
        onClick={() => setCollapsed(false)}
        aria-label="Open sidebar"
        style={{ display: collapsed ? 'block' : 'none' }}
      >
        <svg width={24} height={24} fill="none" stroke="currentColor"><rect width={24} height={4} y={4} rx={2}/><rect width={24} height={4} y={10} rx={2}/><rect width={24} height={4} y={16} rx={2}/></svg>
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
            <Logo />
            <button
              className="lg:hidden text-white"
              onClick={() => setCollapsed(true)}
              aria-label="Close sidebar"
            >
              <svg width={24} height={24} fill="none" stroke="currentColor"><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
            </button>
          </div>
          <nav className="space-y-1 flex-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard"  
              active={isActive('/school-admin')}
              onClick={() => {navigate('/school-admin'); if(window.innerWidth < 1024) setCollapsed(true);}}
            />  
            <SidebarItem 
              icon={<Users size={20} />} 
              label="Students" 
              hasDropdown
              isOpen={isStudentsOpen}
              active={isActive('/school-admin/students')}
              onClick={() => setIsStudentsOpen(!isStudentsOpen)}
            >
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/students') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/students'); if(window.innerWidth < 1024) setCollapsed(true);}}
              >
                All Students
              </div>
            </SidebarItem>
            <SidebarItem 
              icon={<UserCog size={20} />} 
              label="Class" 
              hasDropdown
              isOpen={isClassOpen}
              active={isActive('/school-admin/class')}
              onClick={() => setIsClassOpen(!isClassOpen)}
            >
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/class') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/class'); if(window.innerWidth < 1024) setCollapsed(true);}}
              >
                All class
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/timetables') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/timetables'); if(window.innerWidth < 1024) setCollapsed(true);}}
              >
                Timetables
              </div>
            </SidebarItem>
            <SidebarItem 
              icon={<UserCog size={20} />} 
              label="Teachers" 
              active={isActive('/school-admin/teachers')}
              onClick={() => {navigate('/school-admin/teachers'); if(window.innerWidth < 1024) setCollapsed(true);}}
            />
            <SidebarItem 
              icon={<Calendar size={20} />} 
              label="Academic" 
              hasDropdown 
              isOpen={isAcademicOpen} 
              active={isActive('/school-admin/academic-year') || isActive('/school-admin/academic-term')}
              onClick={() => setIsAcademicOpen(!isAcademicOpen)}
            >
              <div 
                className={`text-white/70 hover:bg-white/5 py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/academic-year') ? 'bg-white/10 text-white' : ''
                }`}
                onClick={() => {setActiveItem('academic-year'); navigate('/school-admin/academic-year'); if(window.innerWidth < 1024) setCollapsed(true);}}
              >
                Academic Year
              </div>
              <div 
                className={`text-white/70 hover:bg-white/5 py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/academic-term') ? 'bg-white/10 text-white' : ''
                }`}
                onClick={() => {setActiveItem('academic-term'); navigate('/school-admin/academic-term'); if(window.innerWidth < 1024) setCollapsed(true);}}
              >
                Academic Term
              </div>
            </SidebarItem>
            <SidebarItem 
              icon={<CreditCard size={20} />} 
              label="Payment" 
              active={isActive('/school-admin/payment')}
              onClick={() => {navigate('/school-admin/payment'); if(window.innerWidth < 1024) setCollapsed(true);}}
            />
            <SidebarItem 
              icon={<BookOpen size={20} />} 
              label="Courses" 
              active={isActive('/school-admin/courses')}
              onClick={() => {navigate('/school-admin/courses'); if(window.innerWidth < 1024) setCollapsed(true);}}
            />
            <SidebarItem 
              icon={<MessageSquare size={20} />} 
              label="Messages" 
              active={isActive('/school-admin/messages')}
              onClick={() => {navigate('/school-admin/messages'); if(window.innerWidth < 1024) setCollapsed(true);}}
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={isActive('/settings')}
              onClick={() => {navigate('/settings'); if(window.innerWidth < 1024) setCollapsed(true);}}
            />
          </nav>
        </div>
      </aside>
      <Overlay />
    </>
  );
};

export default Sidebar;