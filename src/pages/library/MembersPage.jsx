import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from '../../hooks/library/useMembers';
import MemberForm from '../../components/library/MemberForm';

const { Search } = Input;
const { Option } = Select;

const MembersPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: members = [], isLoading, error } = useMembers();
  const createMutation = useCreateMember();
  const updateMutation = useUpdateMember();
  const deleteMutation = useDeleteMember();

  const handleCreate = () => {
    setEditingMember(null);
    setIsModalVisible(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Member deleted successfully');
    } catch (error) {
      message.error('Failed to delete member');
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingMember) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      setIsModalVisible(false);
      setEditingMember(null);
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingMember(null);
  };

  // Debug logging
  console.log('Members data:', members);
  console.log('Members type:', typeof members);
  console.log('Is array:', Array.isArray(members));

  // Filter members based on search and filters
  const filteredMembers = Array.isArray(members) ? members.filter(member => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.studentId && member.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  // Body templates for DataTable
  const roleBodyTemplate = (rowData) => {
    const roleColors = {
      student: 'blue',
      teacher: 'green',
      staff: 'orange',
      admin: 'red'
    };
    
    return (
      <Tag color={roleColors[rowData.role] || 'default'}>
        {rowData.role.toUpperCase()}
      </Tag>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      active: 'green',
      suspended: 'orange',
      inactive: 'red'
    };
    
    return (
      <Tag color={statusColors[rowData.status] || 'default'}>
        {rowData.status.toUpperCase()}
      </Tag>
    );
  };

  const borrowsBodyTemplate = (rowData) => (
    <div className="text-center">
      <div className="font-medium">{rowData.currentBorrows}</div>
      <div className="text-xs text-gray-500">of {rowData.maxBorrowLimit}</div>
    </div>
  );

  const joinDateBodyTemplate = (rowData) => (
    <div className="text-sm">
      {new Date(rowData.joinDate).toLocaleDateString()}
    </div>
  );

  const actionsBodyTemplate = (rowData) => (
    <Space>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={() => handleEdit(rowData)}
        size="small"
      />
      <Popconfirm
        title="Are you sure you want to delete this member?"
        onConfirm={() => handleDelete(rowData.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
        />
      </Popconfirm>
    </Space>
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
          <div className="text-red-500 text-lg mb-2">Error loading members</div>
          <div className="text-gray-600">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 library-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 library-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Library Members</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage library member accounts</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          className="w-full sm:w-auto library-page-actions"
        >
          Add Member
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{filteredMembers.length}</div>
          <div className="text-gray-600">Total Members</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredMembers.filter(member => member.status === 'active').length}
          </div>
          <div className="text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {filteredMembers.filter(member => member.role === 'student').length}
          </div>
          <div className="text-gray-600">Students</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">
            {filteredMembers.filter(member => member.role === 'teacher').length}
          </div>
          <div className="text-gray-600">Teachers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 library-filters">
          <Search
            placeholder="Search by name, email, or student ID"
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
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
            <Option value="staff">Staff</Option>
            <Option value="admin">Administrator</Option>
          </Select>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full"
          >
            <Option value="all">All Statuses</Option>
            <Option value="active">Active</Option>
            <Option value="suspended">Suspended</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredMembers}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          responsiveLayout="stack"
          className="p-2 sm:p-4 library-datatable"
          scrollable
          scrollHeight="400px"
          showGridlines
          stripedRows
        >
          <Column field="name" header="Name" sortable style={{ minWidth: '150px' }} />
          <Column field="email" header="Email" sortable style={{ minWidth: '180px' }} />
          <Column field="role" header="Role" body={roleBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="currentBorrows" header="Current Borrows" body={borrowsBodyTemplate} sortable style={{ minWidth: '120px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="phoneNumber" header="Phone" sortable style={{ minWidth: '120px' }} />
          <Column field="studentId" header="Student ID" sortable style={{ minWidth: '100px' }} />
          <Column field="department" header="Department" sortable style={{ minWidth: '120px' }} />
          <Column field="joinDate" header="Join Date" body={joinDateBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '100px' }}
            className="text-center"
            frozen={false}
          />
        </DataTable>
      </div>

      <MemberForm
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        member={editingMember}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default MembersPage;
