import React, { useState } from 'react';
import { Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { CreateClassModal } from '../../students/modals/CreateClassModal';
import { AssignLessonsModal } from '../../students/modals/AssignLessonsModal';
import { AssignStudentsModal } from '../../students/modals/AssignStudentsModal';
import { DeleteClassModal } from '../../students/modals/DeleteClassModal';
import { EditClassModal } from '../../students/modals/EditClassModal';
import { useClasses } from '../../../hooks/useClasses';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from "primereact/api";
import { Input } from "antd";
import { Tooltip } from 'primereact/tooltip';
import { useClassBySchoolId } from '../../../hooks/useClassesBySchoolId';
import { useAuth } from '../../../hooks/useAuth';
import { AddCombinationModal } from './modals/AddCombinationModal';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

export const ClassManagement = () => {
  const { authData } = useAuth();
  const { classes, isLoading } = useClassBySchoolId(authData?.schoolId);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignLessonsModal, setShowAssignLessonsModal] = useState(false);
  const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCombinationModal, setShowCombinationModal] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedCombByClass, setSelectedCombByClass] = useState({});

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const emptyCheck = (value) => value || 'None';

  const handleToggleStudents = (rowData) => {
    const id = rowData?._id || rowData?.id;
    if (!id) return;

    const isExpanded = !!expandedRows[id];
    if (isExpanded) {
      const next = { ...expandedRows };
      delete next[id];
      setExpandedRows(next);
    } else {
      const next = { ...expandedRows, [id]: true };
      setExpandedRows(next);

      const combs = Array.isArray(rowData.combinations) ? rowData.combinations : [];
      if (combs.length === 1) {
        setSelectedCombByClass((prev) => ({ ...prev, [id]: combs[0].name }));
      }
    }
  };

  const formatDate = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  };

  const rowExpansionTemplate = (rowData) => {
    const classId = rowData?._id || rowData?.id;
    const combinations = Array.isArray(rowData?.combinations) ? rowData.combinations : [];
    const options = combinations.map((c) => ({ label: c.name, value: c.name }));
    const selected = selectedCombByClass[classId] ?? null;
    const selectedComb = combinations.find((c) => c.name === selected);

    // Normalize students for the nested DataTable
    const students = Array.isArray(selectedComb?.students) ? selectedComb.students : [];
    const studentRows = students.map((st, idx) => {
      if (typeof st === "string") {
        return {
          _id: `s-${idx}`,
          fullName: st,
        };
      }
      const fullName =
        st?.fullName ||
        [st?.firstName, st?.lastName].filter(Boolean).join(" ") ||
        st?.name ||
        `Student ${idx + 1}`;
      return {
        _id: st?._id || st?.id || `s-${idx}`,
        registrationNumber: st?.registrationNumber,
        fullName,
        gender: st?.gender,
        dateOfBirth: st?.dateOfBirth,
        phoneNumber: st?.phoneNumber,
        address: st?.address,
        city: st?.city,
        enrollmentDate: st?.enrollmentDate,
      };
    });

    return (
      <div className="p-4 bg-gray-50 rounded-md">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-700">Choose Combination</label>
          <Dropdown
            value={selected}
            options={options}
            onChange={(e) => setSelectedCombByClass((prev) => ({ ...prev, [classId]: e.value }))}
            placeholder="Select combination"
            className="w-full md:w-72"
          />
        </div>

        {!selected && <p className="text-sm text-gray-500">Select a combination to view students.</p>}

        {selected && (
          <>
            {studentRows.length > 0 ? (
              <div className="bg-white rounded-md border">
                <DataTable
                  value={studentRows}
                  dataKey="_id"
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  stripedRows
                  className="text-sm"
                  responsiveLayout="scroll"
                  emptyMessage="No students found."
                >
                  <Column
                    header="#"
                    body={(_, opts) => (opts?.rowIndex ?? 0) + 1}
                    style={{ width: "3rem" }}
                  />
                  <Column field="registrationNumber" header="Reg. No" />
                  <Column field="fullName" header="Full Name" />
                  <Column field="gender" header="Gender" style={{ width: "7rem" }} />
                  <Column
                    header="DOB"
                    body={(r) => formatDate(r.dateOfBirth)}
                    style={{ width: "8rem" }}
                  />
                  <Column field="phoneNumber" header="Phone" style={{ width: "10rem" }} />
                  <Column field="address" header="Address" />
                  <Column field="city" header="City" style={{ width: "8rem" }} />
                  <Column
                    header="Enrolled"
                    body={(r) => formatDate(r.enrollmentDate)}
                    style={{ width: "8rem" }}
                  />
                </DataTable>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No students in this combination.</p>
            )}
          </>
        )}
      </div>
    );
  };

  const handleSubmit = (data) => {
    
  };

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }
  return (
   <>
    <Tooltip target=".more-teachers" />
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
          className="bg-navy-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>

      <div>
        <DataTable
          value={classes}
          dataKey="_id"
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          globalFilter={filters.global.value}
          filters={filters}
          paginator
          rows={10}
          className="bg-white rounded-lg shadow text-sm"
          responsiveLayout="scroll"
        >
          <Column 
            header="#"
            body={(rowData, { rowIndex }) => rowIndex + 1}
            style={{ width: '3rem' }}
          />
          {/* Expander column (keeps PrimeReact expansion row working) */}
          <Column expander style={{ width: '3rem' }} />

          <Column field="name" header="Class Name" />

          <Column
            field="assignedTeachers"
            header="Assigned teachers"
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
            }}
          />

          <Column
            header="Student No"
            body={(rowData) => {
              if (!Array.isArray(rowData.combinations) || rowData.combinations.length === 0) return 0;
              return rowData.combinations.reduce(
                (total, comb) => total + (Array.isArray(comb.students) ? comb.students.length : 0),
                0
              );
            }}
          />

          <Column
            header="Students"
            body={(rowData) => (
              <button
                onClick={() => handleToggleStudents(rowData)}
                className="p-1 hover:bg-gray-100 rounded"
                title="View Students by Combination"
              >
                <Eye size={16} className="text-gray-600" />
              </button>
            )}
            style={{ textAlign: 'center' }}
          />

          <Column
            header="Class Grade"
            field="grade"
            body={(rowData) => emptyCheck(rowData?.grade)}
          />

          <Column
            header="Combinations"
            body={(rowData) =>
              Array.isArray(rowData.combinations) && rowData.combinations.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {rowData.combinations.map((comb, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold"
                    >
                      {comb.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 text-xs">None</span>
              )
            }
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
                  title="Edit Class"
                >
                  <Pencil size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setSelectedClass(rowData);
                    setShowDeleteModal(true);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Delete Class"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
                <button
                  onClick={() => {
                    setSelectedClass(rowData);
                    setShowCombinationModal(true);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Add Combination"
                >
                  <PlusCircle size={16} className="text-blue-600" />
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
          classId={selectedClass._id}
        />
      )}

      {showEditModal && selectedClass && (
        <EditClassModal
          // Pass the full class object so combinations/students are available
          classData={selectedClass}
          // Control visibility via isOpen
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClass(null);
          }}
          // If your modal supports submit, keep it; otherwise remove
          onSubmit={(data) => {
            handleSubmit(data);
          }}
        />
      )}

      {showCombinationModal && (
        <AddCombinationModal
          visible={showCombinationModal}
          onClose={() => {
            setShowCombinationModal(false);
            setSelectedClass(null);
          }}
          classId={selectedClass._id}
          className={selectedClass.name}
        />
      )}
    </div>
   </>
  );
};
