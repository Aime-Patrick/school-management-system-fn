import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { PlusCircle, X } from "lucide-react";
import { useClasses } from "../../../../hooks/useClasses";

export const AddCombinationModal = ({ visible, onClose, classId, className }) => {
  const { addCombinationIntoClass, addCombinationIntoClassLoading, addCombinationIntoClassSuccess } = useClasses();
  const [combinationName, setCombinationName] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!combinationName.trim()) {
      setError("Combination name is required");
      return;
    }
    addCombinationIntoClass({ classId, combination: {name: combinationName} });
  };

  const handleClose = () => {
    setCombinationName("");
    setError("");
    onClose();
  };

  useEffect(() => {
    if (addCombinationIntoClassSuccess) {
      handleClose();
    }
    // eslint-disable-next-line
  }, [addCombinationIntoClassSuccess]);

  return (
    <Dialog
      visible={visible}
      header={
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
            <PlusCircle size={22} className="text-blue-600" />
            Add Combination
          </div>
          {className && (
            <div className="text-xs text-blue-500 font-medium pl-7">
              For Class: <span className="font-semibold text-blue-700">{className}</span>
            </div>
          )}
        </div>
      }
      style={{ width: "95vw", maxWidth: 400, borderRadius: 18 }}
      onHide={handleClose}
      className="rounded-2xl"
      draggable={false}
      closable={false}
      footer={
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-semibold"
            onClick={handleClose}
            type="button"
            disabled={addCombinationIntoClassLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold flex items-center gap-2"
            onClick={handleSave}
            type="button"
            disabled={addCombinationIntoClassLoading}
          >
            {addCombinationIntoClassLoading && (
              <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            Save
          </button>
        </div>
      }
    >
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition"
        onClick={handleClose}
        type="button"
        aria-label="Close"
      >
        <X size={22} />
      </button>
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-semibold text-blue-900 mb-1">
          Combination Name
        </label>
        <input
          type="text"
          value={combinationName}
          onChange={e => {
            setCombinationName(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="e.g. MCE"
          maxLength={10}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 font-semibold bg-blue-50 placeholder:text-blue-300 transition"
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        <p className="text-xs text-gray-500 mt-1">
          Enter a short code for the combination (e.g. <span className="font-semibold text-blue-700">MCE</span>, <span className="font-semibold text-blue-700">PCM</span>).
        </p>
      </div>
      <style>{`
        @media (max-width: 500px) {
          .p-dialog {
            width: 98vw !important;
            min-width: unset !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </Dialog>
  );
};