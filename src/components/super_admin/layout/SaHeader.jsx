import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Search, Bell, Menu } from "lucide-react";
import { ProfileDropdown } from "../../reusable/ProfileDropDown";
import AddSchool from "../../school/dashboard/AddSchool";
export const SaHeader = ({ onSidebarToggle }) => {
  const [visible, setVisible] = useState(false);
  const handleAddSchoolClick = () => {
    setVisible(true);
  };
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/sadmin/settings");
  };

  const handleProfileClick = () => {
    navigate("/sadmin/profile");
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden mr-2 p-2 rounded-lg hover:bg-blue-50 text-blue-600"
        onClick={onSidebarToggle}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 ml-2">
        <button
          type="button"
          onClick={handleAddSchoolClick}
          aria-label="Add new school"
          className="hidden sm:inline-block text-navy-600 px-4 py-2 rounded-lg border border-navy-600 hover:bg-navy-50"
        >
          Add new school account
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-gray-600" />
        </button>
        <ProfileDropdown
          imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces"
          onSettingsClick={handleSettingsClick}
          onProfileClick={handleProfileClick}
        />
      </div>
      {visible && (
        <AddSchool onClose={() => setVisible(false)} visible={visible} />
      )}
    </div>
  );
};

SaHeader.propTypes = {
  onSettingsClick: PropTypes.func,
  onProfileClick: PropTypes.func,
  onSidebarToggle: PropTypes.func,
};
