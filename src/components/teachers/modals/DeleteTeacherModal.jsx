import React from "react";
import { X, Loader } from "lucide-react";

const DeleteTeacherModal = ({
  onClose,
  onDelete,
  teacher,
  deleteTeacherLoading,
}) => {
  console.log(teacher);
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Delete Teacher</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p>
            Are you sure you want to delete {teacher.firstName}{" "}
            {teacher.lastName}?
          </p>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
              disabled={deleteTeacherLoading}
            >
              {deleteTeacherLoading ? (
                <span>
                  <Loader className="animate-spin" size={16} />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTeacherModal;
