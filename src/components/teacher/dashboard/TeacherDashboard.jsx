import React from "react";
import { Calendar, Users, BookOpen, MessageSquare, TrendingUp, Bell } from "lucide-react";

const dashboardCards = [
  {
    icon: <Users size={28} className="text-blue-600" />,
    title: "My Classes",
    description: "View and manage your assigned classes.",
    link: "/teacher/classes",
  },
  {
    icon: <BookOpen size={28} className="text-blue-600" />,
    title: "Subjects",
    description: "See subjects you teach and related resources.",
    link: "/teacher/subjects",
  },
  {
    icon: <Calendar size={28} className="text-blue-600" />,
    title: "Timetable",
    description: "Check your teaching schedule and upcoming lessons.",
    link: "/teacher/timetable",
  },
  {
    icon: <MessageSquare size={28} className="text-blue-600" />,
    title: "Appeals",
    description: "Respond to student appeals and requests.",
    link: "/teacher/appeals",
  },
  {
    icon: <TrendingUp size={28} className="text-blue-600" />,
    title: "Performance",
    description: "Track student progress and your performance.",
    link: "/teacher/performance",
  },
  {
    icon: <Bell size={28} className="text-blue-600" />,
    title: "Announcements",
    description: "View important school announcements.",
    link: "/teacher/announcements",
  },
];

export const TeacherDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-800 mb-2 animate-fade-in-down">
            Welcome, Teacher!
          </h1>
          <p className="text-blue-700 text-lg animate-fade-in-down delay-100">
            Here’s your teaching overview and quick actions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, idx) => (
            <a
              href={card.link}
              key={card.title}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col gap-3 hover:shadow-lg transition group animate-fade-in-up"
              style={{ animationDelay: `${0.1 + idx * 0.07}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
                {card.icon}
              </div>
              <h2 className="text-lg font-semibold text-navy-800">{card.title}</h2>
              <p className="text-gray-500 text-sm">{card.description}</p>
              <span className="mt-auto text-blue-600 text-xs font-medium group-hover:underline">
                Go to {card.title}
              </span>
            </a>
          ))}
        </div>
      </div>
      <style>{`
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;