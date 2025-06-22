import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Search, Bell, Menu as MenuIcon } from "lucide-react";
import { ProfileDropdown } from "../../reusable/ProfileDropDown";
import AddSchool from '../dashboard/AddSchool';
import { useCheckIfAdminHasSchool } from "../../../hooks/useCheckIfAdminHasSchool";
import { motion, AnimatePresence } from "framer-motion";

export const Header = ({ onSidebarToggle }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { data: isSchoolAdminHasSchool } = useCheckIfAdminHasSchool();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0 z-10">
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden flex items-center justify-center p-2 rounded-full text-white bg-blue-700 hover:bg-blue-800 transition"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <MenuIcon size={24} />
      </button>
      {/* Search */}
      <div className="flex-1 flex items-center gap-4 max-w-lg ml-0 lg:ml-4">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-900 placeholder:text-blue-300"
          />
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4 ml-4">
        {!isSchoolAdminHasSchool?.isSchoolExist && (
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="text-blue-700 bg-white px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 font-semibold transition"
          >
            Register School
          </button>
        )}
        <motion.button
          type="button"
          className="p-2 rounded-lg hover:bg-blue-700 transition relative"
          aria-label="Notifications"
          whileTap={{ scale: 0.95 }}
        >
          <Bell size={20} className="text-gray-300" />
          {/* Example notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>
        <AnimatePresence>
          <ProfileDropdown
            imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
            onSettingsClick={handleSettingsClick}
            onProfileClick={handleProfileClick}
            dropdownAnimationProps={{
              as: motion.div,
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -10 },
              transition: { duration: 0.18, type: "spring" }
            }}
          />
        </AnimatePresence>
      </div>
      {visible && (
        <AddSchool visible={visible} onClose={() => setVisible(false)} />
      )}
    </header>
  );
};

Header.propTypes = {
  onSettingsClick: PropTypes.func,
  onProfileClick: PropTypes.func,
  onSidebarToggle: PropTypes.func,
};
