import React, {useState} from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { Button } from 'primereact/button';
import { Input } from "antd";
import { CreateUser } from '../dashboard/createUser';
import { useUsers } from '../../../hooks/useUsers';
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

      console.log(users)

    const renderHeader = () => {
        return (
          <div className="flex items-end justify-end">
            <Input
              placeholder="Search"
              className="text-sm focus:ring-0 focus:outline-none w-[20rem]"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              prefix={<i className="pi pi-search text-gray-600" style={{ fontSize: '1rem' }}></i>}
            />
          </div>
        );
      };

      const countBodyTemplate = (rowData) => {
        return users.indexOf(rowData) + 1;
      };
  return (
    <div className="p-6">
        <div className='flex justify-between mb-4'>
            <h2 className="text-2xl font-bold">Users Lists</h2>
            <Button className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0" icon="pi pi-plus" label='create school admin' onClick={() => setVisible(true)} />
        </div>
        <div className="overflow-x-auto bg-white">
            <DataTable value={users} responsive={true} className="p-4" paginator rows={10} tableStyle={{ minWidth: "50rem", fontSize: "14px" }} 
            header={renderHeader}
            globalFilter={filters.global.value}
            emptyText="No user found."
            filters={filters}
            owClassName={(index) => {
                return {
                  "bg-gray-100": index + (1 % 2) === 0,
                };
              }}>
                <Column field="id" header="ID" body={countBodyTemplate}/>
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