import React, { useEffect, useState } from "react";
import { TeachersList } from "./TeachersList";
import { TeacherProfile } from "./TeacherProfile";
import AddTeacher from "../school/dashboard/AddTeacher";
import DeleteTeacherModal from "./modals/DeleteTeacherModal";
import { useTeacherBySchoolId } from "../../hooks/useTeacherBySchool";
import { useCheckIfAdminHasSchool } from "../../hooks/useCheckIfAdminHasSchool";
import { Button } from "primereact/button";
import { useTeacher } from "../../hooks/useTeacher";
export const TeachersPage = () => {
  const { schoolId, data } = useCheckIfAdminHasSchool();
  const { teachers = [], isLoading } = useTeacherBySchoolId(schoolId);
  const { deleteTeacher, deleteTeacherLoading, deleteTeacherSuccess } = useTeacher();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showDeleteTeacherModal, setShowDeleteTeacherModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const handleAddTeacher = (newTeacher) => {
    console.log("New Teacher:", newTeacher);
    setShowAddTeacherModal(false);
  };

  const handleDeleteTeacher = (teacher) => {
    deleteTeacher({ id: teacher._id });
  };

  useEffect(() => {
    if (deleteTeacherSuccess) {
      setShowDeleteTeacherModal(false);
      setTeacherToDelete(null);
    }
  }
  , [deleteTeacherSuccess]);
  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }

  return (
    // <div >
    //   <div className="flex justify-between items-center mb-4">
    //     <h1 className="text-2xl font-semibold">Teachers</h1>
    //     <button
    //
    //       className="px-4 py-2 bg-blue-600 btn text-white rounded-lg hover:bg-blue-700"
    //     >
    //       Add Teacher
    //     </button>
    //   </div>

    //   {teachers?.length === 0 ? (
    //     <div>No teachers available</div>
    //   ) : (
    //     <TeachersList
    //       teachers={teachers}
    //       onViewProfile={(teacher) => {
    //         setSelectedTeacher(teacher);
    //         setShowProfile(true);
    //       }}
    //     />
    //   )}

   
    // </div>
    <>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-400">Teachers</h1>
        <Button
          label="Add Teacher"
          icon="pi pi-plus"
          onClick={() => setShowAddTeacherModal(true)}
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
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
        
      />
      {showAddTeacherModal && (
        <AddTeacher
          visible={showAddTeacherModal}
          onClose={() => setShowAddTeacherModal(false)}
        />
      )}
      {showProfile && selectedTeacher && (
        <TeacherProfile
          teacher={selectedTeacher}
          onClose={() => {
            setShowProfile(false);
            setSelectedTeacher(null);
          }}
        />
      )}
   {showDeleteTeacherModal && (
     <DeleteTeacherModal
       onClose={() => setShowDeleteTeacherModal(false)}
       onDelete={() => handleDeleteTeacher(teacherToDelete)}
       teacher={teacherToDelete}
      deleteTeacherLoading={deleteTeacherLoading}
     />
   )}
    </>
  );
};
