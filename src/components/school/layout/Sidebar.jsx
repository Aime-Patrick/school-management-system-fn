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
  Calendar,
  DollarSign
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

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [isClassOpen, setIsClassOpen] = useState(false);
  const [isAcademicOpen, setIsAcademicOpen] = useState(false);
  const [isFeesOpen, setIsFeesOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const { authData } = useAuth();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  useEffect(() => {
    // Open or close sidebar based on header toggle
    if (typeof sidebarOpen === "boolean") {
      setCollapsed(!sidebarOpen);
    }
  }, [sidebarOpen, setCollapsed]);

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
              onClick={() => {navigate('/school-admin'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
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
                onClick={() => {navigate('/school-admin/students'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
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
                onClick={() => {navigate('/school-admin/class'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                All class
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/timetables') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/timetables'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Timetables
              </div>
            </SidebarItem>
            <SidebarItem 
              icon={<UserCog size={20} />} 
              label="Teachers" 
              active={isActive('/school-admin/teachers')}
              onClick={() => {navigate('/school-admin/teachers'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
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
                onClick={() => {setActiveItem('academic-year'); navigate('/school-admin/academic-year'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Academic Year
              </div>
              <div 
                className={`text-white/70 hover:bg-white/5 py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/academic-term') ? 'bg-white/10 text-white' : ''
                }`}
                onClick={() => {setActiveItem('academic-term'); navigate('/school-admin/academic-term'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Academic Term
              </div>
            </SidebarItem>
            <SidebarItem 
              icon={<DollarSign size={20} />} 
              label="Fees Management" 
              hasDropdown
              isOpen={isFeesOpen}
              active={isActive('/school-admin/fees') || isActive('/school-admin/fees/categories') || isActive('/school-admin/fees/structures') || isActive('/school-admin/fees/assignments') || isActive('/school-admin/fees/payments') || isActive('/school-admin/fees/reports')}
              onClick={() => setIsFeesOpen(!isFeesOpen)}
            >
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/fees') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/fees'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Overview
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/fees/categories') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/fees/categories'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Categories
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/fees/structures') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/fees/structures'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Structures
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/fees/assignments') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/fees/assignments'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Assignments
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/fees/payments') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/fees/payments'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Payments
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/fees/reports') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/fees/reports'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Reports
              </div>
            </SidebarItem>

            <SidebarItem 
              icon={<Users size={20} />} 
              label="Staff Management" 
              active={isActive('/school-admin/staff')}
              onClick={() => {navigate('/school-admin/staff'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
            />

            <SidebarItem 
              icon={<BookOpen size={20} />} 
              label="Library Management" 
              hasDropdown
              isOpen={isLibraryOpen}
              active={isActive('/school-admin/library') || isActive('/school-admin/library/books') || isActive('/school-admin/library/members') || isActive('/school-admin/library/borrow') || isActive('/school-admin/library/reservations') || isActive('/school-admin/library/fines') || isActive('/school-admin/library/reports')}
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
            >
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Overview
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library/books') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library/books'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Books
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library/members') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library/members'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Members
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library/borrow') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library/borrow'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Borrowing
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library/reservations') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library/reservations'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Reservations
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library/fines') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library/fines'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Fines
              </div>
              <div 
                className={`py-2 px-4 rounded-lg cursor-pointer text-sm ${
                  isActive('/school-admin/library/reports') ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
                onClick={() => {navigate('/school-admin/library/reports'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
              >
                Reports
              </div>
            </SidebarItem>
            <SidebarItem 
              icon={<BookOpen size={20} />} 
              label="Courses" 
              active={isActive('/school-admin/courses')}
              onClick={() => {navigate('/school-admin/courses'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
            />
            <SidebarItem 
              icon={<MessageSquare size={20} />} 
              label="Messages" 
              active={isActive('/school-admin/messages')}
              onClick={() => {navigate('/school-admin/messages'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={isActive('/school-admin/settings')}
              onClick={() => {navigate('/school-admin/settings'); if(window.innerWidth < 1024) setSidebarOpen(false);}}
            />
          </nav>
        </div>
      </aside>
      <Overlay />
    </>
  );
};

export default Sidebar;