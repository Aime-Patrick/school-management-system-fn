import React, {useEffect} from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useClasses } from '../../../hooks/useClasses';
export const DeleteClassModal = ({ className, onClose, classId }) => {
  const { deleteClass,deleteClassLoading, deleteClassSuccess  } = useClasses();

  const handleDelete = () => {
    deleteClass(classId);
  }

  useEffect(() => {
    if (deleteClassSuccess) {
      onClose();
    }
    // eslint-disable-next-line
  }, [deleteClassSuccess, onClose]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[400px]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Delete Class</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-center text-yellow-500 mb-4">
            <AlertTriangle size={48} />
          </div>

          <p className="text-center mb-6">
            Are you sure you want to delete <strong>{className}</strong>? This
            action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteClassLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              {deleteClassLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
