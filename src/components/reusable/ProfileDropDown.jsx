import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Settings, LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

export const ProfileDropdown = ({
  imageUrl,
  onSettingsClick,
  onProfileClick,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { authData } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (callback) => {
    setIsOpen(false);
    callback();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 hover:bg-blue-50 p-1.5 rounded-full transition"
        aria-label="Open profile menu"
      >
        <img
          src={imageUrl}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-blue-200 object-cover"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, type: "spring" }}
            className="absolute z-50 right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[180px]"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-blue-900 truncate">
                {authData?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {authData?.email}
              </p>
            </div>
            <div className="py-1">
              <button
                type="button"
                onClick={() => handleItemClick(onProfileClick)}
                className="w-full px-4 py-2 text-sm text-blue-800 hover:bg-blue-50 flex items-center gap-2 transition"
              >
                <User size={16} />
                Profile
              </button>
              <button
                type="button"
                onClick={() => handleItemClick(onSettingsClick)}
                className="w-full px-4 py-2 text-sm text-blue-800 hover:bg-blue-50 flex items-center gap-2 transition"
              >
                <Settings size={16} />
                Account Settings
              </button>
              <button
                type="button"
                onClick={() => handleItemClick(handleLogout)}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ProfileDropdown.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
};
