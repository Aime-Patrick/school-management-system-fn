import React, { useState } from 'react';
import { Search, Eye, Pencil, Trash2, Loader } from 'lucide-react';
import { useSchoolStudent } from '../../hooks/useSchoolStudent';
import { DeleteStudentModal } from './modals/DeleteStudentModal';
import { EditStudentModal } from './modals/EditStudentModal';

export const StudentsList = ({ students = [], onSelectStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const { deleteStudentLoading, deleteStudentMutation, updateStudentLoading, updateStudentMutation } = useSchoolStudent();

  const filteredStudents = students.filter((student) => {
    const firstName = student.firstName?.toLowerCase() || '';
    const lastName = student.lasttName?.toLowerCase() || '';
    const email = student.accountCredentails?.email?.toLowerCase() || '';
    return (
      firstName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      lastName.includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (studentToDelete) {
      setDeletingStudentId(studentToDelete._id);
      deleteStudentMutation.mutate(studentToDelete._id, {
        onSettled: () => {
          setDeletingStudentId(null);
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        },
      });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setStudentToEdit(null);
  };

  const saveEditedStudent = (studentReg, updatedData) => {
    updateStudentMutation.mutate({ regNumber: studentReg, data: updatedData }, {
      onSettled: () => {
        closeEditModal();
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button className="text-gray-600 px-4 py-2 rounded-lg border hover:bg-gray-50">
            Add filter
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for a student by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              className="pl-10 pr-4 py-2 rounded-lg border w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Reg number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Class</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Gender</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={student.profilePicture || 'https://via.placeholder.com/150'}
                        alt={student.firstName}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span>{student.firstName} {student.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{student.registrationNumber}</td>
                  <td className="px-6 py-4">{student?.class?.name}</td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye onClick={() => onSelectStudent(student)} size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        {updateStudentLoading && studentToEdit?._id === student._id ? (
                          <Loader size={16} className="text-gray-600 animate-spin" />
                        ) : (
                          <Pencil onClick={() => handleEditStudent(student)} size={16} className="text-gray-600" />
                        )}
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        {deleteStudentLoading && deletingStudentId === student._id ? (
                          <Loader size={16} className="text-red-600 animate-spin" />
                        ) : (
                          <Trash2
                            onClick={() => handleDeleteStudent(student)}
                            size={16}
                            className="text-red-600"
                          />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteStudentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteStudent}
        student={studentToDelete}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        student={studentToEdit}
        onSave={saveEditedStudent}
      />
    </div>
  );
};
