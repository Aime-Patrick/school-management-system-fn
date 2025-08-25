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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 animate-pulse">
            <i className="pi pi-spin pi-spinner text-blue-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Courses</h2>
          <p className="text-gray-600">Please wait while we fetch your course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Management</h1>
              <p className="text-gray-600 text-lg">Create and manage your school's courses and lessons</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {courses && courses.length > 0 && (
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <i className="pi pi-download"></i>
                  Export to Excel
                </button>
              )}
              {teachers && teachers.length > 0 && courses && courses.length > 0 && (
                <button
                  onClick={() => setShowAssignTeacherModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="pi pi-users"></i>
                  Assign Teacher
                </button>
              )}
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <i className="pi pi-plus"></i>
                Create New Course
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-800">{courses ? courses.length : 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <i className="pi pi-book text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Available Teachers</p>
                  <p className="text-3xl font-bold text-green-600">{teachers ? teachers.length : 0}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="pi pi-users text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Courses</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {courses ? courses.filter(course => course.status === 'active').length : 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <i className="pi pi-check-circle text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {!courses || courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <i className="pi pi-book text-gray-400 text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Courses Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't created any courses yet. Start by creating your first course to organize your school's curriculum.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <i className="pi pi-plus"></i>
              Create Your First Course
            </button>
          </div>
        ) : !teachers || teachers.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <i className="pi pi-users text-orange-400 text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Teachers Available</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You have courses but no teachers to assign to them. Please add teachers first before assigning them to courses.
            </p>
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Next Steps</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <i className="pi pi-check text-green-500"></i>
                  Add teachers to your school
                </li>
                <li className="flex items-center gap-2">
                  <i className="pi pi-check text-green-500"></i>
                  Then assign them to courses
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Course List</h3>
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
            </div>
          </div>
        )}
      </div>

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
