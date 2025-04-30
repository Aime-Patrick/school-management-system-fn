import React from 'react';
import { Mail, Phone } from 'lucide-react';

export const StudentDetails = ({ student, onClose }) => {
  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="fixed z-50 right-0 top-0 h-full w-96 bg-white shadow-xl p-6">
      <div className="text-right mb-6">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>

      <div className="text-center mb-6">
        <img
          src={student.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.firstName}`}
          alt={student.lastName}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold">{student.firstName} {student.lastName}</h2>
        <p className="text-gray-600">{student.class?.name || "No class assigned"}</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <Mail size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <Phone size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Age</h3>
            <p>{calculateAge(student.dateOfBirth)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Gender</h3>
            <p>{student.gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Email</h3>
            <p>{student.accountCredentails?.email || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Phone</h3>
            <p>{student.phoneNumber || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
