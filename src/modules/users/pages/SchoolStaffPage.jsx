import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, message } from 'antd';
import { PlusOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import { useSchoolStaff, useCreateLibrarian, useCreateAccountant } from '../api/users.api';
import StaffFormModal from '../components/StaffFormModal';
import { useAuth } from '../../../hooks/useAuth';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const SchoolStaffPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { user } = useAuth();
  const { data: staff = [], isLoading, error } = useSchoolStaff();
  const createLibrarianMutation = useCreateLibrarian();
  const createAccountantMutation = useCreateAccountant();

  const handleAddLibrarian = () => {
    setSelectedRole('librarian');
    setIsModalVisible(true);
  };

  const handleAddAccountant = () => {
    setSelectedRole('accountant');
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedRole(null);
  };

  const handleModalSubmit = async (values) => {
    try {
      if (selectedRole === 'librarian') {
        await createLibrarianMutation.mutateAsync(values);
        message.success('Librarian added successfully');
      } else if (selectedRole === 'accountant') {
        await createAccountantMutation.mutateAsync(values);
        message.success('Accountant added successfully');
      }
      setIsModalVisible(false);
      setSelectedRole(null);
    } catch (error) {
      message.error(`Failed to add ${selectedRole}. ${error.message || 'Please try again.'}`);
    }
  };

  // Filter staff based on search and filters
  const filteredStaff = Array.isArray(staff) ? staff.filter(member => {
    const matchesSearch = !searchQuery || 
      member.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) : [];

  // Body templates for DataTable
  const nameBodyTemplate = (rowData) => (
    <div>
      <div className="font-medium">{`${rowData.firstName || ''} ${rowData.lastName || ''}`}</div>
      <div className="text-xs text-gray-500">{rowData.username}</div>
    </div>
  );

  const roleBodyTemplate = (rowData) => {
    const roleColors = {
      librarian: 'blue',
      accountant: 'green',
      teacher: 'orange',
      admin: 'red'
    };
    
    return (
      <Tag color={roleColors[rowData.role] || 'default'}>
        {rowData.role?.toUpperCase() || 'UNKNOWN'}
      </Tag>
    );
  };

  const employmentTypeBodyTemplate = (rowData) => {
    const typeColors = {
      'full-time': 'green',
      'part-time': 'blue',
      'contract': 'orange'
    };
    
    return (
      <Tag color={typeColors[rowData.employmentType] || 'default'}>
        {rowData.employmentType?.replace('-', ' ').toUpperCase() || 'UNKNOWN'}
      </Tag>
    );
  };

  const startDateBodyTemplate = (rowData) => (
    <div className="text-sm">
      {rowData.startDate ? dayjs(rowData.startDate).format('MMM DD, YYYY') : 'N/A'}
    </div>
  );

  const contactBodyTemplate = (rowData) => (
    <div className="text-sm">
      <div>{rowData.email || 'N/A'}</div>
      <div className="text-gray-500">{rowData.phoneNumber || 'N/A'}</div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading staff data</div>
          <div className="text-gray-600">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 staff-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 staff-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">School Staff Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage librarians, accountants, and other school staff</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddLibrarian}
            size="large"
            className="w-full sm:w-auto staff-page-actions"
          >
            Add Librarian
          </Button>
          <Button
            type="default"
            icon={<UserAddOutlined />}
            onClick={handleAddAccountant}
            size="large"
            className="w-full sm:w-auto staff-page-actions"
          >
            Add Accountant
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 staff-summary-cards">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{filteredStaff.length}</div>
          <div className="text-gray-600">Total Staff</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredStaff.filter(member => member.role === 'librarian').length}
          </div>
          <div className="text-gray-600">Librarians</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">
            {filteredStaff.filter(member => member.role === 'accountant').length}
          </div>
          <div className="text-gray-600">Accountants</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">
            {filteredStaff.filter(member => member.employmentType === 'full-time').length}
          </div>
          <div className="text-gray-600">Full-time</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 staff-filters">
          <Search
            placeholder="Search by name, email, or department"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full"
          />
          <Select
            placeholder="Filter by role"
            value={roleFilter}
            onChange={setRoleFilter}
            className="w-full"
          >
            <Option value="all">All Roles</Option>
            <Option value="librarian">Librarian</Option>
            <Option value="accountant">Accountant</Option>
            <Option value="teacher">Teacher</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredStaff}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          responsiveLayout="stack"
          className="p-2 sm:p-4 staff-datatable"
          scrollable
          scrollHeight="400px"
          showGridlines
          stripedRows
        >
          <Column field="name" header="Name" body={nameBodyTemplate} sortable style={{ minWidth: '150px', maxWidth: '200px' }} />
          <Column field="role" header="Role" body={roleBodyTemplate} sortable style={{ minWidth: '100px', maxWidth: '120px' }} />
          <Column field="contact" header="Contact" body={contactBodyTemplate} sortable style={{ minWidth: '180px', maxWidth: '220px' }} />
          <Column field="department" header="Department" sortable style={{ minWidth: '120px', maxWidth: '150px' }} />
          <Column field="employmentType" header="Employment" body={employmentTypeBodyTemplate} sortable style={{ minWidth: '100px', maxWidth: '120px' }} />
          <Column field="startDate" header="Start Date" body={startDateBodyTemplate} sortable style={{ minWidth: '120px', maxWidth: '140px' }} />
        </DataTable>
      </div>

      <StaffFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        role={selectedRole}
        schoolId={user?.schoolId}
        loading={createLibrarianMutation.isPending || createAccountantMutation.isPending}
      />
    </div>
  );
};

export default SchoolStaffPage;
