import React, { useState } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { CreateClassModal } from './modals/CreateClassModal';
import { AssignLessonsModal } from './modals/AssignLessonsModal';
import { AssignStudentsModal } from './modals/AssignStudentsModal';
import { DeleteClassModal } from './modals/DeleteClassModal';
import { EditClassModal } from './modals/EditClassModal';
import { useClasses } from '../../hooks/useClasses';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { Input } from "antd";
import { Tooltip } from 'primereact/tooltip';
import { useClassBySchoolId } from '../../hooks/useClassesBySchoolId';
import { useAuth } from '../../hooks/useAuth';
export const ClassManagement = () => {
  const { authData } = useAuth();
  const { classes, isLoading } = useClassBySchoolId(authData?.schoolId);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignLessonsModal, setShowAssignLessonsModal] = useState(false);
  const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
    const emptyCheck = (value) => value || 'None';

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }
  return (
   <><Tooltip target=".more-teachers" />
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="">
          <Input
              type="text"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Search ..."
              className="pl-4 pr-4 py-2 rounded-lg border w-[300px]"
              prefix={<i className="pi pi-search"></i>}
            />
          </div>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>

      <div>
      <DataTable value={classes} globalFilter={filters.global.value} filters={filters} paginator rows={10} className="bg-white rounded-lg shadow text-sm">
  <Column 
    header="#" 
    body={(rowData, { rowIndex }) => rowIndex + 1} 
    style={{ width: '3rem' }} 
  />
  <Column field="name" header="Class Name" />
  <Column field="assignedTeachers" header="Assigned teachers" 
  body={(rowData) => {
    const teachers = rowData?.assignedTeachers ?? [];

    if (teachers.length === 0) return 'None';

    const first = teachers[0];
    const others = teachers.slice(1).join(', ');

    return (
      <div className="flex items-center gap-2">
        <span>{first}</span>
        {teachers.length > 1 && (
          <Button
            icon="pi pi-ellipsis-h"
            className="p-button-text p-button-sm more-teachers"
            data-pr-tooltip={others}
            data-pr-position="top"
          />
        )}
      </div>
    );
  }} />
  <Column field="studentCount" header="Student No" body={(rowData)=> rowData?.students?.length} />
  <Column 
    header="Students" 
    body={() => (
      <button className="p-1 hover:bg-gray-100 rounded">
        <Eye size={16} className="text-gray-600" />
      </button>
    )}
    style={{ textAlign: 'center' }}
  />
  <Column 
    header="Class Grade" 
    field='grade'
    body={(rowData) => emptyCheck(rowData?.grade)}
  />
  <Column 
    header="Actions" 
    body={(rowData) => (
      <div className="flex justify-center gap-2">
        <button 
          onClick={() => {
            setSelectedClass(rowData);
            setShowEditModal(true);
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
        <button 
          onClick={() => {
            setSelectedClass(rowData);
            setShowDeleteModal(true);
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    )}
    style={{ textAlign: 'center' }}
  />
</DataTable>
      </div>

      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showAssignLessonsModal && selectedClass && (
        <AssignLessonsModal
          className={selectedClass.name}
          onClose={() => {
            setShowAssignLessonsModal(false);
            setSelectedClass(null);
          }}
          onSubmit={(lessons) => {
            console.log('Assigned lessons:', lessons);
            setShowAssignLessonsModal(false);
            setSelectedClass(null);
          }}
        />
      )}

      {showAssignStudentsModal && selectedClass && (
        <AssignStudentsModal
          onClose={() => {
            setShowAssignStudentsModal(false);
            setSelectedClass(null);
          }}
          onSubmit={(students) => {
            console.log('Assigned students:', students);
            setShowAssignStudentsModal(false);
            setSelectedClass(null);
          }}
        />
      )}

      {showDeleteModal && selectedClass && (
        <DeleteClassModal
          className={selectedClass.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedClass(null);
          }}
          onConfirm={() => {
            setClasses(classes.filter((c) => c.id !== selectedClass.id));
            setShowDeleteModal(false);
            setSelectedClass(null);
          }}
        />
      )}

      {showEditModal && selectedClass && (
        <EditClassModal
          classData={{
            name: selectedClass.name,
            headTeacher: selectedClass.headTeacher,
            studentCount: selectedClass.studentCount,
          }}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClass(null);
          }}
          onSubmit={(data) => {
            setClasses(
              classes.map((c) =>
                c.id === selectedClass.id
                  ? { ...c, ...data }
                  : c
              )
            );
            setShowEditModal(false);
            setSelectedClass(null);
          }}
        />
      )}
    </div></>
  );
};
  