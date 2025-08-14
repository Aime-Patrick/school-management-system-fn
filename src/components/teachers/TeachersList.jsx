import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Input } from "antd";
import { convertDate } from "../../utils";

export const TeachersList = ({
  teachers,
  onViewProfile,
  onEditRole,
  onDelete,
  onResetPassword,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const actionTemplate = (rowData) => (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => onViewProfile(rowData)}
        className="p-1 hover:bg-blue-50 rounded text-blue-600"
        title="View Profile"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => onResetPassword(rowData)}
        className="p-1 hover:bg-blue-50 rounded text-blue-600"
        title="Reset Password"
      >
        <i className="pi pi-key" />
      </button>
      <button
        onClick={() => onEditRole(rowData)}
        className="p-1 hover:bg-yellow-50 rounded text-yellow-600"
        title="Edit"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => onDelete(rowData)}
        className="p-1 hover:bg-red-50 rounded text-red-600"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  // Hide less important columns on mobile for a no-horizontal-scroll experience
  return (
    <div className="w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Input
          type="text"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search for a teacher by name or email"
          className="pl-4 pr-4 py-2 rounded-lg border w-full sm:w-[300px]"
          prefix={<i className="pi pi-search"></i>}
        />
      </div>
      <div className="bg-white mt-2 rounded-xl shadow-md w-full">
        <DataTable
          value={teachers}
          globalFilter={filters.global.value}
          filters={filters}
          emptyMessage="No Teacher found."
          tableClassName="text-[14px] bg-white"
          tableStyle={{ width: "100%" }}
          paginator
          rows={10}
          responsiveLayout="stack"
          breakpoint="768px"
          scrollable={false}
        >
          <Column
            header="#"
            body={(_, { rowIndex }) => (
              <div className="font-semibold text-gray-500 md:text-gray-700">
                {rowIndex + 1}
              </div>
            )}
            className="w-8"
          />
          <Column
            header="Name"
            body={(rowData) => (
              <div className="flex items-center">
                {rowData.profilePicture && rowData.profilePicture !== "null" ? (
                  <img
                    src={rowData.profilePicture}
                    alt={rowData.lastName}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full mr-2 bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm uppercase">
                    {rowData.firstName?.[0] || ""}
                    {rowData.lastName?.[0] || ""}
                  </div>
                )}
                <span className="capitalize text-gray-700">
                  {rowData.firstName} {rowData.lastName}
                </span>
              </div>
            )}
          />
          <Column
            field="coursesTaught"
            header="Subject"
            body={(rowData) => (
              <div className="flex flex-wrap items-center gap-1">
                {rowData.coursesTaught.length > 0 ? (
                  rowData.coursesTaught.map((course, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {course.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No Subject Assigned</span>
                )}
              </div>
            )}
          />
          <Column
            field="accountCredentails.email"
            header="Email"
            body={(rowData) => (
              <div>
                {rowData.accountCredentails?.email}
              </div>
            )}
          />
          <Column
            field="address"
            header="Address"
            body={(rowData) => (
              <div>
                {rowData.city}, {rowData.address}
              </div>
            )}
          />
          <Column
            field="hiredDate"
            header="Hired Date"
            body={(rowData) => (
              <div>
                {convertDate(rowData.hiredDate)}
              </div>
            )}
          />
          <Column
            field="status"
            header="Status"
            body={(rowData) => (
              <div>
                <span
                  className={`capitalize px-4 py-2 rounded-full text-xs font-semibold ${
                    rowData.status === "active"
                      ? "text-green-600 bg-green-600/10"
                      : "text-red-600 bg-red-600/10"
                  }`}
                >
                  {rowData.status}
                </span>
              </div>
            )}
          />
          <Column
            field="gender"
            header="Gender"
            body={(rowData) => (
              <div>
                {rowData.gender}
              </div>
            )}
          />
          <Column
            header="Actions"
            body={(rowData) => (
              <div>
                {actionTemplate(rowData)}
              </div>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};
