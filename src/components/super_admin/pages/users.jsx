import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { Button } from 'primereact/button';
import { Input } from "antd";
import { CreateUser } from '../dashboard/createUser';
import { useUsers } from '../../../hooks/useUsers';
import { DynamicBreadcrumb } from '../../Breadcrumb/DynamicBreadcrumb';

const Users = () => {
  const { users, isLoading } = useUsers();
  const [visible, setVisible] = useState(false);
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

  const renderHeader = () => (
    <div className="flex items-end justify-end">
      <Input
        placeholder="Search"
        className="text-sm focus:ring-0 focus:outline-none w-full md:w-[20rem]"
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        prefix={<i className="pi pi-search text-gray-600" style={{ fontSize: '1rem' }}></i>}
      />
    </div>
  );

  const countBodyTemplate = (rowData) => users.indexOf(rowData) + 1;

  return (
    <div className="p-2 md:p-6">
      <DynamicBreadcrumb />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Users Lists</h2>
        <Button
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0 w-full md:w-auto"
          icon="pi pi-plus"
          label="Create School Admin"
          onClick={() => setVisible(true)}
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <DataTable
          value={users}
          responsiveLayout="scroll"
          className="p-2"
          paginator
          rows={10}
          tableStyle={{ minWidth: "40rem", fontSize: "14px" }}
          header={renderHeader}
          globalFilter={filters.global.value}
          emptyMessage={isLoading ? "Loading..." : "No user found."}
          filters={filters}
        >
          <Column field="id" header="ID" body={countBodyTemplate} />
          <Column field="username" header="Name" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" />
        </DataTable>
      </div>
      {visible && <CreateUser visible={visible} onClose={() => setVisible(false)} />}
    </div>
  )
}

export default Users