import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddSchool from "../../school/dashboard/AddSchool";
import { useSchools } from "../../../hooks/useSchool";
import { convertDate } from "../../../utils";
import { DynamicBreadcrumb } from "../../Breadcrumb/DynamicBreadcrumb";

const SchoolsList = () => {
  const { schools, isLoading } = useSchools();
  const [visible, setVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleDeleteClick = (school) => {
    setSelectedSchool(school);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Implement delete logic here
    setShowDeleteModal(false);
    setSelectedSchool(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedSchool(null);
  };

  const handleLockClick = (school) => {
    // Implement lock functionality here
    console.log(`Locking school: ${school.name}`);
  };

  // Custom body templates for DataTable
  const logoBody = (rowData) => (
    <img
      src={rowData.schoolLogo || "/logo192.png"}
      alt={`${rowData.schoolName} Logo`}
      className="w-12 h-12 rounded-full border-2 border-blue-100 shadow-sm object-cover"
    />
  );

  const adminBody = (rowData) => (
    <span className="font-medium text-blue-700">
      {rowData.schoolAdmin?.username}
    </span>
  );

  const statusBody = (rowData) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize
      ${
        rowData.status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {rowData.status}
    </span>
  );

  const actionsBody = (rowData) => (
    <div className="flex items-center justify-center gap-2">
      <button
        className="text-blue-500"
        onClick={() => console.log("Edit", rowData._id)}
      >
        <i className="pi pi-pencil"></i>
      </button>
      <button
        className="text-red-500"
        onClick={() => handleDeleteClick(rowData)}
      >
        <i className="pi pi-trash"></i>
      </button>
      <button
        className="text-yellow-500"
        onClick={() => handleLockClick(rowData)}
      >
        <i className="pi pi-lock"></i>
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i
          className="pi pi-spin pi-spinner text-blue-700"
          style={{ fontSize: "2rem" }}
        ></i>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-6">
      <DynamicBreadcrumb />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-navy-800">
          Schools List
        </h2>
        <button
          onClick={() => setVisible(true)}
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0 w-full md:w-auto flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-all duration-150"
        >
          <i className="pi pi-plus text-base"></i>
          <span>Add School</span>
        </button>
      </div>
      <div className="animate-fade-in-up overflow-x-auto bg-white rounded-2xl shadow border border-blue-100">
        <DataTable
          value={schools}
          paginator
          rows={10}
          responsiveLayout="scroll"
          className="p-datatable-sm"
          emptyMessage="No schools found."
          scrollable
          scrollHeight="60vh"
          tableStyle={{ minWidth: "40rem" }}
        >
          <Column header="Logo" body={logoBody} style={{ width: "90px" }} />
          <Column field="schoolCode" header="School Code" />
          <Column header="School Admin" body={adminBody} />
          <Column field="schoolName" header="School Name" />
          <Column
            header="School Email"
            body={(rowData) => rowData.email || rowData.schoolAdmin?.email}
          />
          <Column header="Status" body={statusBody} />
          <Column
            field="createdAt"
            header="Create Date"
            body={(rowData) => convertDate(rowData.createdAt)}
          />
          <Column
            header="Action"
            body={actionsBody}
            style={{ width: "120px" }}
          />
        </DataTable>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in-up">
            <h3 className="text-lg font-semibold text-red-700">
              Are you sure you want to delete this School?
            </h3>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {visible && (
        <AddSchool onClose={() => setVisible(false)} visible={visible} />
      )}

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default SchoolsList;
