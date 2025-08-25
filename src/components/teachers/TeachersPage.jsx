import React, { useEffect, useState } from "react";
import { TeachersList } from "./TeachersList";
import { TeacherProfile } from "./TeacherProfile";
import AddTeacher from "../school/dashboard/AddTeacher";
import DeleteTeacherModal from "./modals/DeleteTeacherModal";
import EditTeacherModal from "./modals/EditTeacherModal";
import { useTeacherBySchoolId } from "../../hooks/useTeacherBySchool";
import { Button } from "primereact/button";
import { useTeacher } from "../../hooks/useTeacher";
import { Dialog } from "primereact/dialog";
import { useAuth } from "../../hooks/useAuth";
export const TeachersPage = () => {
  const { authData } = useAuth();
  const { teachers = [], isLoading } = useTeacherBySchoolId(authData?.schoolId);
  const { deleteTeacher, deleteTeacherLoading, deleteTeacherSuccess, resetTeacherPassword, resetPasswordLoading, resetPasswordSuccess } = useTeacher();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showDeleteTeacherModal, setShowDeleteTeacherModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [teacherToReset, setTeacherToReset] = useState(null);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);

  const handleDeleteTeacher = (teacher) => {
    deleteTeacher({ id: teacher._id });
  };

  const handleResetPassword = (teacher) => {
    setTeacherToReset(teacher);
    setShowResetPasswordModal(true);
  };

  const confirmResetPassword = () => {
    resetTeacherPassword(teacherToReset._id );
  };

  useEffect(() => {
    if (deleteTeacherSuccess) {
      setShowDeleteTeacherModal(false);
      setTeacherToDelete(null);
    }
    if (resetPasswordSuccess) {
      setShowResetPasswordModal(false);
      setTeacherToReset(null);
    }
  }, [deleteTeacherSuccess, resetPasswordSuccess]);

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Teachers</h1>
        <Button
          label="Add Teacher"
          icon="pi pi-plus"
          onClick={() => setShowAddTeacherModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out w-full sm:w-auto"
        />
      </div>
      <TeachersList
        teachers={teachers}
        onViewProfile={(teacher) => {
          setSelectedTeacher(teacher);
          setShowProfile(true);
        }}
        onDelete={(teacher) => {
          setTeacherToDelete(teacher);
          setShowDeleteTeacherModal(true);
        }}
        onResetPassword={handleResetPassword}
        onEditRole={(teacher) => {
          setSelectedTeacher(teacher);
          setShowEditTeacherModal(true);
        }}
      />

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <AddTeacher
          visible={showAddTeacherModal}
          onClose={() => setShowAddTeacherModal(false)}
        />
      )}

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && selectedTeacher && (
        <EditTeacherModal
          visible={showEditTeacherModal}
          onClose={() => {
            setShowEditTeacherModal(false);
            setSelectedTeacher(null);
          }}
          teacher={selectedTeacher}
        />
      )}

      {/* Teacher Profile Modal */}
      {showProfile && selectedTeacher && (
        <TeacherProfile
          teacher={selectedTeacher}
          onClose={() => {
            setShowProfile(false);
            setSelectedTeacher(null);
          }}
        />
      )}

      {/* Delete Teacher Modal */}
      {showDeleteTeacherModal && (
        <DeleteTeacherModal
          onClose={() => setShowDeleteTeacherModal(false)}
          onDelete={() => handleDeleteTeacher(teacherToDelete)}
          teacher={teacherToDelete}
          deleteTeacherLoading={deleteTeacherLoading}
        />
      )}

      {/* Reset Password Modal */}
      <Dialog
        header="Reset Password"
        visible={showResetPasswordModal}
        onHide={() => setShowResetPasswordModal(false)}
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-2 p-4 border-t border-gray-200">
            <Button
              label="Cancel"
              className="p-button-text text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg transition duration-300 ease-in-out"
              onClick={() => setShowResetPasswordModal(false)}
            />
            <Button
              label={resetPasswordLoading ? "Resetting..." : "Confirm"}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out"
              onClick={confirmResetPassword}
              disabled={resetPasswordLoading}
            />
          </div>
        }
        modal
        closable
        className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3"
      >
        <p className="text-base text-gray-700 mb-4">
          Are you sure you want to reset the password for{" "}
          <span className="font-semibold text-blue-700">
            {teacherToReset?.lastName} {teacherToReset?.firstName}
          </span>
          ?
        </p>
        {resetPasswordSuccess && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
            Password reset link sent to teacher's email!
          </div>
        )}
      </Dialog>
    </div>
  );
};
