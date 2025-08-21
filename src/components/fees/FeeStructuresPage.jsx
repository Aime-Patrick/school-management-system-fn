import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Spin, Tag, Space, Popconfirm } from 'antd';
import { useFeeStructures, useCreateFeeStructure, useUpdateFeeStructure, useDeleteFeeStructure } from '../../hooks/useFees';
import FeeStructureModal from './modals/FeeStructureModal';
import { useAuth } from '../../hooks/useAuth';
import { getResourceUIConfig } from '../../utils/permissions';
import PermissionGuard from '../reusable/PermissionGuard';
import dayjs from 'dayjs';



const FeeStructuresPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const { authData } = useAuth();
  const uiConfig = getResourceUIConfig(authData.role, 'FEE_STRUCTURES');
  
  const { data: structuresResponse, isLoading } = useFeeStructures();
  
  // Extract structures from API response
  const structures = structuresResponse?.data || [];
  
  // Debug logging to help identify data structure issues
  console.log('FeeStructuresPage - structuresResponse:', structuresResponse);
  console.log('FeeStructuresPage - processed structures:', structures);
  
  // Ensure all date fields are properly formatted for the table
  const processedStructures = structures.map(structure => ({
    ...structure,
    dueDate: structure.dueDate ? new Date(structure.dueDate).toISOString() : null
  }));
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
      updateMutation.mutate({ id: editingStructure._id, ...values });
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
    
    try {
      // First try to create a native Date object
      const nativeDate = new Date(rowData.dueDate);
      if (isNaN(nativeDate.getTime())) return 'Invalid Date';
      
      // Then use dayjs for formatting
      const date = dayjs(nativeDate);
      if (!date.isValid()) return 'Invalid Date';
      
      return date.format('MMM DD, YYYY');
    } catch (error) {
      console.error('Error formatting date:', error, rowData.dueDate);
      return 'Invalid Date';
    }
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    const color = status === 'active' ? 'green' : 'red';
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const classBodyTemplate = (rowData) => {
    if (!rowData.classId) return <span className="text-gray-400">-</span>;
    return rowData.classId.name || '-';
  };

  const lateFeeRulesBodyTemplate = (rowData) => {
    console.log('Late Fee Rules - rowData:', rowData);
    console.log('Late Fee Rules - lateFeeRules:', rowData.lateFeeRules);
    
    const rules = rowData.lateFeeRules;
    if (!rules || (!rules.gracePeriod && !rules.lateFeeAmount && !rules.lateFeePercentage)) {
      console.log('Late Fee Rules - No data found, showing "No late fees"');
      return <span className="text-gray-400">No late fees</span>;
    }
    
    console.log('Late Fee Rules - Found data:', rules);
    return (
      <div className="text-xs space-y-1">
        {rules.gracePeriod > 0 && <div className="whitespace-nowrap">Grace: {rules.gracePeriod}d</div>}
        {rules.lateFeeAmount > 0 && <div className="whitespace-nowrap">${rules.lateFeeAmount}</div>}
        {rules.lateFeePercentage > 0 && <div className="whitespace-nowrap">{rules.lateFeePercentage}%</div>}
      </div>
    );
  };

  const discountBodyTemplate = (rowData) => {
    const discountAmount = rowData.discountAmount || 0;
    const discountPercentage = rowData.discountPercentage || 0;
    
    if (discountAmount === 0 && discountPercentage === 0) {
      return <span className="text-gray-400">No discount</span>;
    }
    
    return (
      <div className="text-xs space-y-1">
        {discountAmount > 0 && <div className="whitespace-nowrap">${discountAmount}</div>}
        {discountPercentage > 0 && <div className="whitespace-nowrap">{discountPercentage}%</div>}
      </div>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    if (!uiConfig.hasManagementAccess) {
      return null;
    }

    return (
      <Space>
        {uiConfig.canUpdate && (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(rowData)}
            size="small"
          />
        )}
        {uiConfig.canDelete && (
          <Popconfirm
            title="Are you sure you want to delete this fee structure?"
            onConfirm={() => handleDelete(rowData._id)}
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
        )}
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
    <div className="p-3 sm:p-4 md:p-6 max-w-full">
      {/* Responsive Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 fees-page-header">
        <div className="text-center sm:text-left">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Fee Structures</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">Manage fee structures and their configurations</p>
        </div>
        <PermissionGuard userRole={authData.role} resource="FEE_STRUCTURES" action="CREATE">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
            className="w-full sm:w-auto fees-page-actions shadow-sm"
          >
            <span className="hidden sm:inline">Add Structure</span>
            <span className="sm:hidden">+ Add</span>
          </Button>
        </PermissionGuard>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        {/* Responsive Info Bar */}
        <div className="bg-blue-50 border-b border-blue-200 p-2 sm:p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-blue-700">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2 sm:mb-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">Responsive View:</span>
              <span className="hidden sm:inline">All columns visible</span>
              <span className="sm:hidden">Essential columns only</span>
            </div>
            <div className="text-center sm:text-right text-xs">
              <span className="hidden sm:inline">Resize browser to see more/less columns</span>
              <span className="sm:hidden">Swipe to see more data</span>
            </div>
          </div>
        </div>
        
        {/* Mobile-friendly table wrapper */}
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          {processedStructures && processedStructures.length > 0 ? (
            <>
              {/* Desktop/Tablet View */}
              <div className="hidden sm:block">
                         <DataTable
               value={processedStructures}
               paginator
               rows={10}
               rowsPerPageOptions={[5, 10, 25, 50]}
               className="p-2 sm:p-4"
               showGridlines
               stripedRows
               size="small"
               emptyMessage="No fee structures found"
             >
                         <Column 
                 header="Category" 
                 body={(rowData) => rowData.categoryId?.name || 'Unknown Category'}
                 sortable 
                 style={{ minWidth: '100px' }} 
               />
               <Column 
                 header="Amount" 
                 body={amountBodyTemplate} 
                 sortable 
                 style={{ minWidth: '90px' }} 
               />
               <Column 
                 header="Status" 
                 body={statusBodyTemplate} 
                 sortable 
                 style={{ minWidth: '70px' }} 
               />
               <Column 
                 header="Class" 
                 body={classBodyTemplate} 
                 sortable 
                 style={{ minWidth: '80px' }} 
               />
               <Column 
                 header="Discount" 
                 body={discountBodyTemplate} 
                 style={{ minWidth: '100px' }} 
               />
               <Column 
                 header="Due Date" 
                 body={dueDateBodyTemplate} 
                 style={{ minWidth: '90px' }} 
               />
               <Column 
                 header="Academic Year" 
                 body={(rowData) => rowData.academicYearId?.name || 'Unknown Year'}
                 sortable 
                 style={{ minWidth: '100px' }} 
               />
               <Column 
                 header="Term" 
                 body={(rowData) => rowData.termId?.name || 'Unknown Term'}
                 sortable 
                 style={{ minWidth: '80px' }} 
               />
               <Column 
                 header="Late Fee Rules" 
                 body={lateFeeRulesBodyTemplate} 
                 style={{ minWidth: '120px' }} 
               />
               <Column 
                 header="Actions" 
                 body={actionsBodyTemplate} 
                 style={{ minWidth: '80px' }}
                 className="text-center"
               />
            </DataTable>
              </div>
              
              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4 p-4">
                {processedStructures.map((structure, index) => (
                  <div key={structure._id || index} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{structure.categoryId?.name || 'Unknown Category'}</div>
                        <div className="text-sm text-gray-600">{structure.classId?.name || 'No Class'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{amountBodyTemplate(structure)}</div>
                        <div className="text-sm text-gray-500">{statusBodyTemplate(structure)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Academic Year:</span>
                        <div className="font-medium">{structure.academicYearId?.name || '-'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Term:</span>
                        <div className="font-medium">{structure.termId?.name || '-'}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <div className="font-medium">{dueDateBodyTemplate(structure)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Discount:</span>
                        <div className="font-medium">{discountBodyTemplate(structure)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-2">Late Fee Rules:</div>
                      {lateFeeRulesBodyTemplate(structure)}
                    </div>
                    
                    {uiConfig.hasManagementAccess && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                        {uiConfig.canUpdate && (
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(structure)}
                            size="small"
                            className="flex-1"
                          >
                            Edit
                          </Button>
                        )}
                        {uiConfig.canDelete && (
                          <Popconfirm
                            title="Are you sure you want to delete this fee structure?"
                            onConfirm={() => handleDelete(structure._id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              size="small"
                              className="flex-1"
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">No fee structures found</div>
              <div className="text-gray-400 text-sm">Create your first fee structure to get started</div>
            </div>
          )}
        </div>
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
