import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Tooltip } from 'antd';
import { PlusOutlined, FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import { useFeeAssignments, useAutoAssignFees } from '../../hooks/useFees';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';
import AutoAssignModal from './modals/AutoAssignModal';
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from 'xlsx';

const { Search } = Input;
const { Option } = Select;

const FeeAssignmentsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    class: 'all',
  });
  const { authData } = useAuth();
  
  const { data: assignmentsResponse, isLoading } = useFeeAssignments();
  
  // Handle different API response structures
  const assignments = Array.isArray(assignmentsResponse) 
    ? assignmentsResponse 
    : assignmentsResponse?.data || [];
  const autoAssignMutation = useAutoAssignFees();

  const handleAutoAssign = () => {
    setIsModalVisible(true);
  };

  const handleModalSubmit = (values) => {
    autoAssignMutation.mutate(values);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleExport = () => {
    const exportData = filteredAssignments.map(assignment => ({
      'Student Name': assignment.student?.name || '',
      'Class': assignment.class?.name || '',
      'Fee Category': assignment.feeStructure?.category?.name || '',
      'Amount': assignment.feeStructure?.amount || 0,
      'Due Date': assignment.feeStructure?.dueDate ? dayjs(assignment.feeStructure.dueDate).format('MMM DD, YYYY') : '',
      'Status': assignment.status || '',
      'Assigned Date': assignment.assignedDate ? dayjs(assignment.assignedDate).format('MMM DD, YYYY') : '',
    }));

    const ws = xlsxUtils.json_to_sheet(exportData);
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, 'Fee Assignments');
    xlsxWriteFile(wb, 'fee-assignments.xlsx');
  };

  const filteredAssignments = (assignments || []).filter(assignment => {
    const matchesSearch = !filters.search || 
      assignment.student?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      assignment.feeStructure?.category?.name?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || assignment.status === filters.status;
    const matchesClass = filters.class === 'all' || assignment.class?.id === filters.class;

    return matchesSearch && matchesStatus && matchesClass;
  });

  const amountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.feeStructure?.amount || 0);
  };

  const dueDateBodyTemplate = (rowData) => {
    if (!rowData.feeStructure?.dueDate) return '-';
    return dayjs(rowData.feeStructure.dueDate).format('MMM DD, YYYY');
  };

  const assignedDateBodyTemplate = (rowData) => {
    if (!rowData.assignedDate) return '-';
    return dayjs(rowData.assignedDate).format('MMM DD, YYYY');
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    let color = 'default';
    
    switch (status) {
      case 'paid':
        color = 'green';
        break;
      case 'overdue':
        color = 'red';
        break;
      case 'pending':
        color = 'orange';
        break;
      default:
        color = 'default';
    }
    
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  // Get unique classes for filter
  const uniqueClasses = [...new Set(assignments.map(a => a.class?.id))].filter(Boolean);
  const classOptions = uniqueClasses.map(classId => {
    const classData = assignments.find(a => a.class?.id === classId)?.class;
    return { id: classId, name: classData?.name || classId };
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 fees-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Fee Assignments</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage fee assignments to students</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto fees-page-actions">
          {(authData.role === 'school-admin' || authData.role === 'system-admin') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAutoAssign}
              size="large"
              className="w-full sm:w-auto"
            >
              Auto Assign Fees
            </Button>
          )}
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            size="large"
            className="w-full sm:w-auto"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fees-filters">
          <Search
            placeholder="Search by student name or fee category"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            allowClear
            className="w-full"
          />
          <Select
            placeholder="Filter by status"
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            className="w-full"
          >
            <Option value="all">All Statuses</Option>
            <Option value="pending">Pending</Option>
            <Option value="paid">Paid</Option>
            <Option value="overdue">Overdue</Option>
          </Select>
          <Select
            placeholder="Filter by class"
            value={filters.class}
            onChange={(value) => setFilters({ ...filters, class: value })}
            className="w-full"
          >
            <Option value="all">All Classes</Option>
            {classOptions.map(cls => (
              <Option key={cls.id} value={cls.id}>{cls.name}</Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredAssignments || []}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          responsiveLayout="stack"
          className="p-2 sm:p-4 fees-datatable"
          scrollable
          scrollHeight="400px"
          showGridlines
          stripedRows
        >
          <Column field="student.name" header="Student Name" sortable style={{ minWidth: '140px' }} />
          <Column field="class.name" header="Class" sortable style={{ minWidth: '100px' }} />
          <Column field="feeStructure.category.name" header="Fee Category" sortable style={{ minWidth: '120px' }} />
          <Column field="feeStructure.amount" header="Amount" body={amountBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="feeStructure.dueDate" header="Due Date" body={dueDateBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="assignedDate" header="Assigned Date" body={assignedDateBodyTemplate} sortable style={{ minWidth: '120px' }} />
        </DataTable>
      </div>

      <AutoAssignModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        loading={autoAssignMutation.isPending}
      />
    </div>
  );
};

export default FeeAssignmentsPage;
