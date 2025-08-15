import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Spin, Tag, Space, Popconfirm } from 'antd';
import { useFeeStructures, useCreateFeeStructure, useUpdateFeeStructure, useDeleteFeeStructure } from '../../hooks/useFees';
import FeeStructureModal from './modals/FeeStructureModal';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const FeeStructuresPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const { authData } = useAuth();
  
  const { data: structuresResponse, isLoading } = useFeeStructures();
  
  // Handle different API response structures
  const structures = Array.isArray(structuresResponse) 
    ? structuresResponse 
    : structuresResponse?.data || [];
  const createMutation = useCreateFeeStructure();
  const updateMutation = useUpdateFeeStructure();
  const deleteMutation = useDeleteFeeStructure();

  const handleCreate = () => {
    setEditingStructure(null);
    setIsModalVisible(true);
  };

  const handleEdit = (structure) => {
    setEditingStructure(structure);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleModalSubmit = (values) => {
    if (editingStructure) {
      updateMutation.mutate({ id: editingStructure.id, ...values });
    } else {
      createMutation.mutate(values);
    }
    setIsModalVisible(false);
    setEditingStructure(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingStructure(null);
  };

  const amountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.amount);
  };

  const dueDateBodyTemplate = (rowData) => {
    if (!rowData.dueDate) return '-';
    return dayjs(rowData.dueDate).format('MMM DD, YYYY');
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    const color = status === 'active' ? 'green' : 'red';
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const actionsBodyTemplate = (rowData) => {
    if (authData.role !== 'school-admin' && authData.role !== 'system-admin') {
      return null;
    }

    return (
      <Space>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleEdit(rowData)}
          size="small"
        />
        <Popconfirm
          title="Are you sure you want to delete this fee structure?"
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
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 fees-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Fee Structures</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage fee structures and their configurations</p>
        </div>
        {(authData.role === 'school-admin' || authData.role === 'system-admin') && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
            className="w-full sm:w-auto fees-page-actions"
          >
            Add Structure
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={structures || []}
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
          <Column field="category.name" header="Category" sortable style={{ minWidth: '120px' }} />
          <Column field="class.name" header="Class" sortable style={{ minWidth: '100px' }} />
          <Column field="amount" header="Amount" body={amountBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="academicYear.name" header="Academic Year" sortable style={{ minWidth: '120px' }} />
          <Column field="term.name" header="Term" sortable style={{ minWidth: '100px' }} />
          <Column field="dueDate" header="Due Date" body={dueDateBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '100px' }}
            className="text-center"
            frozen="right"
          />
        </DataTable>
      </div>

      <FeeStructureModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        structure={editingStructure}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default FeeStructuresPage;
