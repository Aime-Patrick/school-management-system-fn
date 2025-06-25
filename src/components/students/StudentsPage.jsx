import React, { useState } from "react";
import { EmptyState } from "./EmptyState";
import { StudentsList } from "./StudentsList";
import { StudentDetails } from "./StudentDetails";
import { ClassManagement } from "../school/dashboard/ClassManagement";
import { AddStudentModal } from "./AddStudentModal";
import { exportToExcel } from "../../utils";
import { useSchoolStudent } from "../../hooks/useSchoolStudent";

export const StudentsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [view, setView] = useState("list");

  const { students } = useSchoolStudent();

  const handleExport = () => {
    if (!students || students.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for export
    const exportData = students.map((student, index) => ({
      "#": index + 1,
      "First Name": student.firstName,
      "Last Name": student.lastName,
      Email: student.accountCredentails?.email || "N/A",
      Gender: student.gender || "N/A",
      "Date of Birth": student.dateOfBirth || "N/A",
      "Phone Number": student.phoneNumber || "N/A",
      Address: student.address || "N/A",
      City: student.city || "N/A",
      Class: student.class?.name || "No class assigned",
      "Enrollment Date": student.enrollmentDate || "N/A",
    }));

    // Call the export utility
    exportToExcel(exportData, "StudentsList", "Students");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Students</h1>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Export to Excel
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className=" px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Student
          </button>
        </div>
      </div>

      {students && students.length === 0 ? (
        <EmptyState onAddStudent={() => setShowAddModal(true)} />
      ) : view === "list" ? (
        <StudentsList students={students} onSelectStudent={setSelectedStudent} />
      ) : (
        <ClassManagement />
      )}

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {showAddModal && <AddStudentModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default StudentsPage;
