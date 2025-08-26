import React, { useState } from "react";
import { PencilIcon, Plus, X, Loader } from "lucide-react";
import { useAcademic } from "../../hooks/useAcademic";
import { exportToExcel } from "../../utils/index";

export const AcademicTerm = () => {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const {
    academicTerms=[],
    academicYears=[],
    createAcademicTermsMutation,
    createAcademicTermsIsloading,
    updateAcademicTermsMutation,
    updateAcademicTermsIsloading
  } = useAcademic();

  const academicYearOptions = academicYears.map((year) => (
    <option key={year.id} value={year._id}>
      {year.name}
    </option>
  ));
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedTerm(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const academicYear = formData.get("academicYear");
    const name = formData.get("name");
    const startDate = formData.get("start");
    const endDate = formData.get("end");

    if (dialogMode === "create") {
      createAcademicTermsMutation.mutate(
        { academicYear, name, startDate, endDate },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            handleDialogClose();
          },
        }
      );
    } else {
      updateAcademicTermsMutation.mutate(
        { id: selectedTerm._id, academicYear, name, startDate, endDate },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            handleDialogClose();
          },
        }
      );
    }
  };

  const handleConvertDate = (date) => {
    const options = { year: "numeric", month: "long" };
    return new Date(date).toLocaleDateString("en-US", options);
  }

  const handleExport = () => {
      if (!academicTerms || academicTerms.length === 0) {
        alert("No data available to export.");
        return;
      }
  
      // Prepare data for export
      const exportData = academicTerms.map((year, index) => ({
        "#": index + 1,
        AcademicYear: year.academicYear.name,
        Name: year.name,
        Start: year.startDate,
        End: year.endDate,
      }));
  
      // Call the export utility
      exportToExcel(exportData, "academicTerms", "Academic Terms");
    };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Academic Term</h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
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
            Create Academic Term
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Academic Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Edit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {academicTerms.length > 0 ? (
              academicTerms.map((term, index) => (
                <tr key={term.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {term.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {term.academicYear?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {handleConvertDate(term.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {handleConvertDate(term.endDate)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => {
                        setDialogMode("edit");
                        setSelectedTerm(term);
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
                  No academic terms found.
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
                  ? "Create Academic Term"
                  : "Edit Academic Term"}
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
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  required
                  defaultValue={
                    dialogMode === "edit" && selectedTerm && selectedTerm.academicYear ? selectedTerm.academicYear._id : ""
                  }
                  className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select academic year</option>
                  {academicYearOptions}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={dialogMode === "edit" ? selectedTerm.name : ""}
                  placeholder="e.g., First Term"
                  className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="month"
                  name="start"
                  defaultValue={
                    dialogMode === "edit" && selectedTerm
                      ? selectedTerm.startDate.slice(0, 7)
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
                  defaultValue={
                    dialogMode === "edit" && selectedTerm ? selectedTerm.endDate.slice(0, 7) : ""
                  }
                  className="w-full p-2 border border-gray-200 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-navy-800 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={createAcademicTermsIsloading || updateAcademicTermsIsloading}
              >
                {createAcademicTermsIsloading || updateAcademicTermsIsloading ? (
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
