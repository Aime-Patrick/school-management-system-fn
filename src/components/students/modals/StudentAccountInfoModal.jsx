import React from "react";
import { X } from "lucide-react";

export const StudentAccountInfoModal = ({ onClose, username, password }) => {
  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Student Account Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Student account created successfully! Please provide the following credentials to the student:
          </p>
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Username:</p>
            <p className="text-lg font-semibold text-gray-800 break-all">{username}</p>
          </div>
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium text-gray-600">Password:</p>
            <p className="text-lg font-semibold text-gray-800 break-all">{password}</p>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-navy-800 text-white rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAccountInfoModal;
