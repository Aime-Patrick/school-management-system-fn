import React,{useState} from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Input } from "antd";
export const TeachersList = ({
  teachers,
  onViewProfile,
  onViewRole,
  onEditRole,
  onDelete,
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
  const convertDate = (date) => {
    return new Date(date).toLocaleDateString();
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

      <div>
        <div className="rounded-lg shadow">
          <DataTable
            value={teachers}
            globalFilter={filters.global.value}
            emptytext="No Teacher found."
            filters={filters}
            tableClassName="text-[14px] white"
            tableStyle={{minWidth:"60rem"}}
            paginator
            rows={10}
          >
            <Column
            className="whitespace-nowrap"
              header="Name"
              style={{ width: "10%" }}
              body={(rowData) => (
                <div className="flex items-center">
                  <img
                    src={rowData.profileImage}
                    alt={rowData.lastName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>
                    {rowData.firstName} {rowData.lastName}
                  </span>
                </div>
              )}
            />
            <Column field="coursesTaught" header="Subject"  className="whitespace-nowrap"/>
            <Column field="accountCredentails.email" header="Email" className="whitespace-nowrap"/>
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
            <Column field="status" header="Status" className="whitespace-nowrap"/>
            <Column field="gender" header="Gender" className="whitespace-nowrap"/>
            <Column header="Actions" body={actionTemplate} />
          </DataTable>
        </div>
      </div>
    </div>
  );
};
