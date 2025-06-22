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
  onViewRole,
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
  const actionTemplate = (rowData) => {
    return (
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onViewProfile(rowData)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Eye size={16} className="text-gray-600" />
        </button>
        <button onClick={() => onResetPassword(rowData)}>
          <i className="pi pi-key"></i>
        </button>
        <button
          onClick={() => onEditRole(rowData)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(rowData)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    );
  };
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="text"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search for a teacher by name or email"
              className="pl-4 pr-4 py-2 rounded-lg border w-[300px]"
              prefix={<i className="pi pi-search"></i>}
            />
          </div>
        </div>
      </div>

      <div className=" bg-white mt-2 rounded-md shadow-md overflow-x-auto max-w-6xl">
        <div>
          <DataTable
            value={teachers}
            globalFilter={filters.global.value}
            emptytext="No Teacher found."
            filters={filters}
            tableClassName="text-[14px] white"
            tableStyle={{ minWidth: "60rem" }}
            paginator
            rows={10}
          >
            <Column
              className="whitespace-nowrap"
              header="Name"
              style={{ width: "10%" }}
              body={(rowData) => (
                <div className="flex items-center">
                  {rowData.profilePicture && rowData.profilePicture != "null" ? (
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
              className="whitespace-nowrap"
              body={(rowData) => (
                <div className="flex items-center">
                  {rowData.coursesTaught.length > 0 ? (
                    rowData.coursesTaught.map((course, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded"
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
              className="whitespace-nowrap"
            />
            <Column
              field="address"
              header="Address"
              body={(rowData) => `${rowData.city}, ${rowData.address}`}
              className="whitespace-nowrap"
            />
            <Column
              field="hiredDate"
              header="Hired Date"
              className="whitespace-nowrap"
              body={(rowData) => convertDate(rowData.hiredDate)}
            />
            <Column
              field="status"
              header="Status"
              className="whitespace-nowrap"
              body={(rowData) => (
                <span
                  className={` capitalize px-4 py-2 rounded-full text-xs font-semibold ${
                    rowData.status === "active"
                      ? "text-green-600 bg-green-600/10"
                      : "text-red-600 :bg-red-600/10"
                  }`}
                >
                  {rowData.status}
                </span>
              )}
            />
            <Column
              field="gender"
              header="Gender"
              className="whitespace-nowrap"
            />
            <Column header="Actions" body={actionTemplate} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
