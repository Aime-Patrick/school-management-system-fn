import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Spin, Tag, Space, Popconfirm } from 'antd';
import { useFeeCategories, useCreateFeeCategory, useUpdateFeeCategory, useDeleteFeeCategory } from '../../hooks/useFees';
import FeeCategoryModal from './modals/FeeCategoryModal';
import { useAuth } from '../../hooks/useAuth';

const FeeCategoriesPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { authData } = useAuth();
  
  const { data: categoriesResponse, isLoading } = useFeeCategories();
  
  // Handle different API response structures
  const categories = Array.isArray(categoriesResponse) 
    ? categoriesResponse 
    : categoriesResponse?.data || [];
  
  // Debug logging to help identify data structure issues
  console.log('FeeCategoriesPage - categoriesResponse:', categoriesResponse);
  console.log('FeeCategoriesPage - processed categories:', categories);
  const createMutation = useCreateFeeCategory();
  const updateMutation = useUpdateFeeCategory();
  const deleteMutation = useDeleteFeeCategory();

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleModalSubmit = (values) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...values });
    } else {
      createMutation.mutate(values);
    }
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
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
          title="Are you sure you want to delete this category?"
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Fee Categories</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage fee categories and their configurations</p>
        </div>
        {(authData.role === 'school-admin' || authData.role === 'system-admin') && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
            className="w-full sm:w-auto bg-system-theme text-white fees-page-actions"
          >
            Add Category
          </Button>
        )}
      </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={categories || []}
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
          <Column field="name" header="Name" sortable style={{ minWidth: '150px' }} />
          <Column field="description" header="Description" sortable style={{ minWidth: '200px' }} />
          <Column field="frequency" header="Frequency" sortable style={{ minWidth: '120px' }} />
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

      <FeeCategoryModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        category={editingCategory}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default FeeCategoriesPage;
