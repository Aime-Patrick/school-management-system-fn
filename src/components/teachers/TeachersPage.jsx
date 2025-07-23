import React, { useEffect, useState } from "react";
import { TeachersList } from "./TeachersList";
import { TeacherProfile } from "./TeacherProfile";
import AddTeacher from "../school/dashboard/AddTeacher";
import DeleteTeacherModal from "./modals/DeleteTeacherModal";
import { useTeacherBySchoolId } from "../../hooks/useTeacherBySchool";
import { useCheckIfAdminHasSchool } from "../../hooks/useCheckIfAdminHasSchool";
import { Button } from "primereact/button";
import { useTeacher } from "../../hooks/useTeacher";
import { Dialog } from "primereact/dialog";

export const TeachersPage = () => {
  const { schoolId } = useCheckIfAdminHasSchool();
  const { teachers = [], isLoading } = useTeacherBySchoolId(schoolId);
  const { deleteTeacher, deleteTeacherLoading, deleteTeacherSuccess, resetTeacherPassword, resetPasswordLoading, resetPasswordSuccess } = useTeacher();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showDeleteTeacherModal, setShowDeleteTeacherModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [teacherToReset, setTeacherToReset] = useState(null);

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
    <div className="p-2 md:p-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-navy-800">Teachers</h1>
        <Button
          label="Add Teacher"
          icon="pi pi-plus"
          onClick={() => setShowAddTeacherModal(true)}
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0 w-full md:w-auto"
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
          setShowProfile(true);
        }}
      />

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <AddTeacher
          visible={showAddTeacherModal}
          onClose={() => setShowAddTeacherModal(false)}
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
          <div>
            <Button
              label="Cancel"
              className="p-button-text p-2"
              onClick={() => setShowResetPasswordModal(false)}
            />
            <Button
              label={resetPasswordLoading ? "Resetting..." : "Confirm"}
              className="bg-navy-800 text-white p-2"
              onClick={confirmResetPassword}
              disabled={resetPasswordLoading}
            />
          </div>
        }
        modal
        closable
      >
        <p>
          Are you sure you want to reset the password for{" "}
          <span className="font-semibold text-blue-700">
            {teacherToReset?.lastName} {teacherToReset?.firstName}
          </span>
          ?
        </p>
        {resetPasswordSuccess && (
          <div className="mt-4 text-green-600 font-medium">
            Password reset link sent to teacher's email!
          </div>
        )}
      </Dialog>
    </div>
  );
};
