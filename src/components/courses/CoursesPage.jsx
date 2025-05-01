import React, { useState } from "react";
import { LessonsList } from "./LessonsList";
import { CreateLessonModal } from "./modals/CreateLessonModal";
import { EditLessonModal } from "./modals/EditLessonModal";
import { DeleteLessonModal } from "./modals/DeleteLessonModal";
import { useCourses } from "../../hooks/useCourses";
import { exportToExcel } from "../../utils";
export const CoursesPage = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { courses, createCourseMutation, deleteCourseMutation, isLoading, updateCourseMutation } =useCourses();

  const handleExport = () => {
        if (!courses || courses.length === 0) {
          alert("No data available to export.");
          return;
        }
    
        const exportData = courses.map((lesson, index) => ({
          "#": index + 1,
          Name: lesson.name,
          "Course code": lesson.courseCode,
          Department: lesson.department,
          Credits: lesson.credits,
          Description: lesson.description,
          Status: lesson.status,
          Tearchers: lesson.teacherIds.map((teacher) => teacher.name).join(", "),
          Students: lesson.studentIds.map((student) => student.name).join(", "),
        }));
    
        exportToExcel(exportData, "courses", "Courses");
      };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lessons</h1>
        <div className="flex gap-3">
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
            Export to Excel
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create new lesson
          </button>
        </div>
      </div>

      <LessonsList
        lessons={courses}
        onEdit={(lesson) => {
          setSelectedLesson(lesson);
          setShowEditModal(true);
        }}
        onDelete={(lesson) => {
          setSelectedLesson(lesson);
          setShowDeleteModal(true);
        }}
      />

      {showCreateModal && (
        <CreateLessonModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && selectedLesson && (
        <EditLessonModal
          lesson={selectedLesson}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLesson(null);
          }}
        />
      )}

      {showDeleteModal && selectedLesson && (
        <DeleteLessonModal
          lesson={selectedLesson}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedLesson(null);
          }}
        />
      )}
    </div>
  );
};

export default CoursesPage;
