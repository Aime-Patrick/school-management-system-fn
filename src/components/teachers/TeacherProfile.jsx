import React from 'react';
import { Mail, Phone, MessageCircle, BookOpen, School } from 'lucide-react';
import dayjs from 'dayjs';

export const TeacherProfile = ({ onClose, teacher }) => {

  if (!teacher) {
    return (
      <div className="fixed z-50 right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex items-center justify-center animate-fade-in-up">
        <span className="text-navy-600 font-semibold">Loading...</span>
      </div>
    );
  }
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    address,
    city,
    hiredDate,
    status,
    department,
    coursesTaught = [],
    school,
    accountCredentails,
  } = teacher;

  const fullName = `${firstName} ${lastName}`;
  const avatar =
    teacher.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`;

  return (
    <div className="fixed z-50 right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl p-6 overflow-y-auto animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-navy-800">Teacher Profile</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-blue-600 text-2xl font-bold">
          ×
        </button>
      </div>

      <div className="text-center mb-6">
        <img
          src={avatar}
          alt={fullName}
          className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-blue-100 object-cover"
        />
        <h2 className="text-2xl font-semibold text-navy-800">{fullName}</h2>
        <p className="text-blue-600">{department} Department</p>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize
          ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </span>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <a href={`mailto:${accountCredentails?.email}`} className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition" title="Email">
          <Mail size={20} className="text-blue-600" />
        </a>
        <a href={`tel:${accountCredentails?.phoneNumber}`} className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition" title="Phone">
          <Phone size={20} className="text-blue-600" />
        </a>
        <button className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition" title="Message">
          <MessageCircle size={20} className="text-blue-600" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">About</h3>
          <p className="text-sm text-gray-700">
            {fullName} is an experienced teacher in the {department} department. Dedicated to fostering a positive learning environment and helping students achieve their full potential.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Gender</h3>
            <p className="text-navy-800">{gender}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Age</h3>
            <p className="text-navy-800">
              {dateOfBirth ? Math.max(0, new Date().getFullYear() - new Date(dateOfBirth).getFullYear()) : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Email</h3>
            <p className="text-navy-800 break-all">{accountCredentails?.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Phone</h3>
            <p className="text-navy-800">{accountCredentails?.phoneNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Address</h3>
            <p className="text-navy-800">{city}, {address}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Hired Date</h3>
            <p className="text-navy-800">{hiredDate ? dayjs(hiredDate).format("MMMM D, YYYY") : "N/A"}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <BookOpen size={16} /> Courses Taught
          </h3>
          {coursesTaught.length > 0 ? (
            <ul className="space-y-1">
              {coursesTaught.map((course) => (
                <li key={course._id} className="flex items-center gap-2 text-blue-800 text-sm">
                  <span className="font-semibold">{course.name}</span>
                  <span className="text-xs text-gray-500">({course.courseCode})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No courses assigned.</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <School size={16} /> School Info
          </h3>
          <div className="flex items-center gap-3">
            <img src={school?.schoolLogo} alt={school?.schoolName} className="w-8 h-8 rounded-full border" />
            <div>
              <div className="font-semibold text-navy-800">{school?.schoolName}</div>
              <div className="text-xs text-gray-500">{school?.address}</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};
