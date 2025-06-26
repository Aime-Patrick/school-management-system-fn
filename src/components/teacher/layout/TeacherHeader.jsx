import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Search, Bell, Menu as MenuIcon } from "lucide-react";
import { ProfileDropdown } from "../../reusable/ProfileDropDown";
import { motion, AnimatePresence } from "framer-motion";
import { TeacherProfile } from "../../teachers/TeacherProfile";
export const TeacherHeader = () => {
  const [profileVisible, setProfileVisible] = useState(false);
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/teacher/settings");
  };

  const handleProfileClick = () => {
    setProfileVisible(true);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 flex items-center gap-4 max-w-lg ml-14 lg:ml-4">
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
      <AnimatePresence>
        {profileVisible && (
          <motion.div
            key="profile-modal"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, type: "spring" }}
            className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
          >
            <TeacherProfile onClose={() => setProfileVisible(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

TeacherHeader.propTypes = {
  onSettingsClick: PropTypes.func,
  onProfileClick: PropTypes.func,
  onSidebarToggle: PropTypes.func,
};