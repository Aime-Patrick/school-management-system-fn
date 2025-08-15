import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { AuthPage } from "./components/AuthPage";
import { AccountSettings } from "./components/settings/AccountSettings";
import { ProfilePage } from "./components/profile/ProfilePage";
import Messaging from "./components/messageComponents/messaging";
import { AcademicTerm } from "./components/academic/AcademicTerm";
import { AcademicYear } from "./components/academic/AcademicYear";
import LandingPage from "./components/LandingPage";
import StudentsPage from "./components/students/StudentsPage";
import { ClassManagement } from "./components/school/dashboard/ClassManagement";
import { TeachersPage } from "./components/teachers/TeachersPage";
import CoursesPage from "./components/courses/CoursesPage";
import { StudentLayout } from "./components/student/layout/StudentLayout";
import { StudentDashboard } from "./components/student/dashboard/StudentDashboard";
import { ReportCards } from "./components/student/pages/ReportCards";
import { ParentMeetings } from "./components/student/pages/ParentMeetings";
import { Announcements } from "./components/student/dashboard/Announcements";
import { Appeals } from "./components/student/pages/Appeals";
import { Timetable } from "./components/student/pages/Timetable";
import { Performance } from "./components/student/pages/Perfomance";
import { Notifications } from "./components/student/pages/Notification";
import SchoolsList from "./components/super_admin/pages/SchoolsList";
import { SaProfilePage } from "./components/super_admin/profile/SaProfilePage";
import { SaAccountSettings } from "./components/super_admin/settings/SaAccountSettings";
import { AppealsTeacher } from "./components/teacher/pages/AppealsTeacher";
import { TeacherLayout } from "./components/teacher/layout/TeacherLayout";
import { Classes } from "./components/teacher/pages/Classes";
import { AdminDashboard } from "./components/school/dashboard/AdminDashboard";
import ProtectedRoute from "./utils/protectedRoute";
import { SaDashboardHome } from "./components/super_admin/pages/Dashboard";
import SchoolLayout from "./components/school/layout/schoolLayout";
import Users from "./components/super_admin/pages/users";
import { SuperPayments } from "./components/super_admin/pages/superPayments";
import { SubscriptionPlan } from "./components/super_admin/pages/subscriptionPlan";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { Payment } from "./components/school/dashboard/payment";
import { Timetables } from "./components/school/dashboard/Timetables";
import ResetPassword from "./components/ResetPassword";
import TeacherDashboard from "./components/teacher/dashboard/TeacherDashboard";
import { SaDashboardLayout } from "./components/super_admin/layout/Layout";
import FeesManagementPage from "./components/fees/FeesManagementPage";
import FeeCategoriesPage from "./components/fees/FeeCategoriesPage";
import FeeStructuresPage from "./components/fees/FeeStructuresPage";
import FeeAssignmentsPage from "./components/fees/FeeAssignmentsPage";
import FeePaymentsPage from "./components/fees/FeePaymentsPage";
import FeeReportsPage from "./components/fees/FeeReportsPage";
import { 
  BooksPage, 
  MembersPage, 
  BorrowPage, 
  ReservationsPage, 
  FinesPage, 
  ReportsPage 
} from "./pages/library";
import LibrarianLayout from "./components/librarian/layout/LibrarianLayout";
import LibrarianDashboard from "./components/librarian/dashboard/LibrarianDashboard";
import { SchoolStaffPage } from "./modules/users";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/student" element={<StudentLayout />}>
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route index element={<StudentDashboard />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="report-cards" element={<ReportCards />} />
            <Route path="parent-meetings" element={<ParentMeetings />} />
            <Route path="appeals" element={<Appeals />} />
            <Route path="performance" element={<Performance />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="library" element={<BooksPage />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="classes" element={<Classes />} />
              <Route path="appeals" element={<AppealsTeacher />} />
              <Route path="library" element={<BooksPage />} />
              <Route path="settings" element={<AccountSettings />} />
            <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route>
          <Route path="/librarian" element={<LibrarianLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["librarian"]} />}>
              <Route index element={<LibrarianDashboard />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="borrow" element={<BorrowPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="fines" element={<FinesPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route>
          <Route path="/sadmin" element={<SaDashboardLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["system-admin"]} />}>
              <Route index element={<SaDashboardHome />} />
              <Route path="schools" element={<SchoolsList />} />
              <Route path="users" element={<Users />} />
              <Route path="payment" element={<SuperPayments />} />
              <Route path="subscription" element={<SubscriptionPlan />} />
              <Route path="settings" element={<SaAccountSettings />} />
            <Route path="profile" element={<SaProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route>
          <Route path="/school-admin" element={<SchoolLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["school-admin"]} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="class" element={<ClassManagement />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="academic-year" element={<AcademicYear />} />
              <Route path="academic-term" element={<AcademicTerm />} />
              <Route path="teachers" element={<TeachersPage />} />
              <Route path="messages" element={<Messaging />} />
              <Route path="fees" element={<FeesManagementPage />} />
              <Route path="fees/categories" element={<FeeCategoriesPage />} />
              <Route path="fees/structures" element={<FeeStructuresPage />} />
              <Route path="fees/assignments" element={<FeeAssignmentsPage />} />
              <Route path="fees/payments" element={<FeePaymentsPage />} />
              <Route path="fees/reports" element={<FeeReportsPage />} />
              <Route path="staff" element={<SchoolStaffPage />} />
              <Route path="library" element={<BooksPage />} />
              <Route path="library/books" element={<BooksPage />} />
              <Route path="library/members" element={<MembersPage />} />
              <Route path="library/borrow" element={<BorrowPage />} />
              <Route path="library/reservations" element={<ReservationsPage />} />
              <Route path="library/fines" element={<FinesPage />} />
              <Route path="library/reports" element={<ReportsPage />} />
              <Route path="timetables" element={<Timetables />} />
              <Route path="settings" element={<AccountSettings />} />
            <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/subscription-required" element={<SubscriptionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
