import React, { useState } from "react";
import { PencilIcon, Plus, X, Loader } from "lucide-react";
import { useAcademic } from "../../hooks/useAcademic";
import { exportToExcel } from "../../utils/index";

export const AcademicYear = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { academicYears = [], createAcademicYearMutation, updateAcademicYearMutation } = useAcademic(); // Ensure academicYears is always an array

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedYear(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const startDate = formData.get("start");
    const endDate = formData.get("end");

    if (dialogMode === "create") {
      createAcademicYearMutation.mutate(
        { startDate, endDate },
        {
          onSuccess: () => {
            setIsSubmitting(false);
            setIsDialogOpen(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
        }
      );
    } else {
      updateAcademicYearMutation.mutate(
        { id: selectedYear._id, startDate, endDate },
        {
          onSuccess: () => {
            setIsSubmitting(false);
            setIsDialogOpen(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
        }
      );
    }
  };

  const handleConvertDate = (date) => {
    const options = { year: "numeric", month: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleExport = () => {
    if (!academicYears || academicYears.length === 0) {
      alert("No data available to export.");
      return;
    }

    const exportData = academicYears.map((year, index) => ({
      "#": index + 1,
      Name: year.name,
      Start: year.startDate,
      End: year.endDate,
    }));

    exportToExcel(exportData, "AcademicYears", "Academic Years");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Academic Year</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
          >
            Export to Excel
          </button>
          <button
            onClick={() => {
              setDialogMode("create");
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-navy-800 text-white rounded hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Academic Year
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {academicYears.length > 0 ? (
              academicYears.map((year, index) => (
                <tr key={year.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{year.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {handleConvertDate(year.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {handleConvertDate(year.endDate)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => {
                        setDialogMode("edit");
                        setSelectedYear(year);
                        setIsDialogOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-sm text-center text-gray-500"
                >
                  No academic years found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {dialogMode === "create"
                  ? "Create Academic Year"
                  : "Edit Academic Year"}
              </h2>
              <button
                onClick={handleDialogClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="month"
                  name="start"
                  required
                  defaultValue={
                    dialogMode === "edit" && selectedYear
                      ? selectedYear.startDate.slice(0, 7)
                      : ""
                  }
                  className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="month"
                  name="end"
                  required
                  defaultValue={
                    dialogMode === "edit" && selectedYear
                      ? selectedYear.endDate.slice(0, 7)
                      : ""
                  }
                  className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-navy-800 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : dialogMode === "create" ? (
                  "Create"
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
