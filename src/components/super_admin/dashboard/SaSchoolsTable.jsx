import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MoreVertical } from "lucide-react";
import { useSchools } from "../../../hooks/useSchool";
import { Empty, Tooltip } from "antd";


export const SaSchoolsTable = () => {
  const { isLoading, schools } = useSchools();
  const sortedSchools = [...schools]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const schoolAdmin = (school) => school.schoolAdmin.username;

  // Custom body templates
  const logoBody = (rowData) => (
    <img
      src={rowData.schoolLogo || "/logo192.png"}
      alt={`${rowData.schoolName} logo`}
      className="w-10 h-10 rounded-full border-2 border-blue-100 shadow-sm object-cover"
    />
  );

  const adminBody = (rowData) => (
    <Tooltip title={rowData.schoolAdmin.email}>
      {schoolAdmin(rowData)}
    </Tooltip>
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

  const actionsBody = () => (
    <button
      type="button"
      className="p-2 hover:bg-blue-100 rounded-full transition"
      aria-label="More options"
    >
      <MoreVertical size={18} className="text-blue-400" />
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy-800">Recently Joined Schools</h2>
        <span className="text-xs text-gray-400">{sortedSchools.length} total</span>
      </div>
      <div className="p-4">
        <DataTable
          value={sortedSchools}
          paginator
          rows={8}
          emptyMessage={<Empty description="No schools available" />}
          className="p-datatable-sm"
          responsiveLayout="scroll"
        >
          <Column header="Logo" body={logoBody} style={{ width: "80px" }} />
          <Column header="School Admin" body={adminBody} />
          <Column field="schoolName" header="School Name" />
          <Column
            header="School Email"
            body={(rowData) => rowData.email || rowData.schoolAdmin.email}
          />
          <Column header="Status" body={statusBody} />
          <Column body={actionsBody} style={{ width: "60px" }} />
        </DataTable>
      </div>
    </div>
  );
};
