import React, { useState, useEffect } from "react";
import { LessonsList } from "./LessonsList";
import { CreateLessonModal } from "./modals/CreateLessonModal";
import { EditLessonModal } from "./modals/EditLessonModal";
import { DeleteLessonModal } from "./modals/DeleteLessonModal";
import { useCourses } from "../../hooks/useCourses";
import { exportToExcel } from "../../utils";
import { useTeacherBySchoolId } from "../../hooks/useTeacherBySchool";
import { AssignTeacherModal } from "./modals/AssignTeacherModal";
import { useAuth } from "../../hooks/useAuth";
export const CoursesPage = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
  const { authData } = useAuth();
  const { isLoading:teacherLoading, teachers } = useTeacherBySchoolId(authData.schoolId);
  const {
    courses,
    createCourseMutation,
    deleteCourseMutation,
    isLoading,
    updateCourseMutation,
    assignTeacherToCourseMutation,
    assignTeacherToCourseIsLoading,
    assignTeacherToCourseSuccess
  } = useCourses();

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

  const handleAssignTeachers = (courseId, teachers) => {
    // Logic to assign teachers to the course
    assignTeacherToCourseMutation.mutate({
      id: courseId,
      data:{ teachers },
    });
  };

  useEffect(() => {
    if (assignTeacherToCourseSuccess) {
      setShowAssignTeacherModal(false);
      assignTeacherToCourseMutation.reset();
    }
  }, [assignTeacherToCourseSuccess]);

  if (isLoading || teacherLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }
  if (!courses || courses.length === 0) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-gray-500">No lessons available.</p>
      </div>
    );
  }
  if (!teachers || teachers.length === 0) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-gray-500">No teachers available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lessons</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Export to Excel
          </button>
          <button
            onClick={() => setShowAssignTeacherModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Assign Teacher
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

      {showAssignTeacherModal && (
        <AssignTeacherModal
          courses={courses}
          teachers={teachers}
          onClose={() => setShowAssignTeacherModal(false)}
          onAssign={handleAssignTeachers}
          assignTeacherToCourseIsLoading={assignTeacherToCourseIsLoading}
        />
      )}

      {showCreateModal && (
        <CreateLessonModal onClose={() => setShowCreateModal(false)} />
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
