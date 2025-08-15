import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Tooltip, Modal, message } from 'antd';
import { PlusOutlined, FilterOutlined, DownloadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useFeePayments, useCreateFeePayment, useApproveFeePayment, useRejectFeePayment } from '../../hooks/useFees';
import { useAuth } from '../../hooks/useAuth';
import PaymentModal from './modals/PaymentModal';
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from 'xlsx';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const FeePaymentsPage = () => {
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentMode: 'all',
    dateRange: null,
  });
  const { authData } = useAuth();
  
  const { data: paymentsResponse, isLoading } = useFeePayments();
  
  // Handle different API response structures
  const payments = Array.isArray(paymentsResponse) 
    ? paymentsResponse 
    : paymentsResponse?.data || [];
  const createPaymentMutation = useCreateFeePayment();
  const approvePaymentMutation = useApproveFeePayment();
  const rejectPaymentMutation = useRejectFeePayment();

  const handleCreatePayment = () => {
    setIsPaymentModalVisible(true);
  };

  const handlePaymentSubmit = (values) => {
    createPaymentMutation.mutate(values);
    setIsPaymentModalVisible(false);
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
  };

  const handleApprove = (payment) => {
    approvePaymentMutation.mutate(payment.id);
  };

  const handleReject = (payment) => {
    setSelectedPayment(payment);
    setIsRejectModalVisible(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }
    rejectPaymentMutation.mutate({ paymentId: selectedPayment.id, reason: rejectReason });
    setIsRejectModalVisible(false);
    setRejectReason('');
    setSelectedPayment(null);
  };

  const handleRejectCancel = () => {
    setIsRejectModalVisible(false);
    setRejectReason('');
    setSelectedPayment(null);
  };

  const handleExport = () => {
    const exportData = filteredPayments.map(payment => ({
      'Student Name': payment.student?.name || '',
      'Fee Category': payment.feeAssignment?.feeStructure?.category?.name || '',
      'Amount': payment.amount || 0,
      'Payment Mode': payment.paymentMode || '',
      'Status': payment.status || '',
      'Payment Date': payment.paymentDate ? dayjs(payment.paymentDate).format('MMM DD, YYYY') : '',
      'Reference Number': payment.referenceNumber || '',
    }));

    const ws = xlsxUtils.json_to_sheet(exportData);
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, 'Fee Payments');
    xlsxWriteFile(wb, 'fee-payments.xlsx');
  };

  const filteredPayments = (payments || []).filter(payment => {
    const matchesSearch = !filters.search || 
      payment.student?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.feeAssignment?.feeStructure?.category?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.referenceNumber?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || payment.status === filters.status;
    const matchesPaymentMode = filters.paymentMode === 'all' || payment.paymentMode === filters.paymentMode;

    return matchesSearch && matchesStatus && matchesPaymentMode;
  });

  const amountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.amount || 0);
  };

  const paymentDateBodyTemplate = (rowData) => {
    if (!rowData.paymentDate) return '-';
    return dayjs(rowData.paymentDate).format('MMM DD, YYYY');
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    let color = 'default';
    
    switch (status) {
      case 'approved':
        color = 'green';
        break;
      case 'pending':
        color = 'orange';
        break;
      case 'rejected':
        color = 'red';
        break;
      default:
        color = 'default';
    }
    
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const actionsBodyTemplate = (rowData) => {
    if (authData.role !== 'school-admin' && authData.role !== 'system-admin') {
      return null;
    }

    if (rowData.status === 'pending') {
      return (
        <Space>
          <Button
            type="text"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(rowData)}
            size="small"
            style={{ color: '#52c41a' }}
          />
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleReject(rowData)}
            size="small"
          />
        </Space>
      );
    }

    return null;
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Fee Payments</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track fee payments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto fees-page-actions">
          {(authData.role === 'school-admin' || authData.role === 'system-admin' || authData.role === 'accountant') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePayment}
              size="large"
              className="w-full sm:w-auto"
            >
              Record Payment
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fees-filters">
          <Search
            placeholder="Search by student name, category, or reference"
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
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select
            placeholder="Filter by payment mode"
            value={filters.paymentMode}
            onChange={(value) => setFilters({ ...filters, paymentMode: value })}
            className="w-full"
          >
            <Option value="all">All Modes</Option>
            <Option value="cash">Cash</Option>
            <Option value="card">Card</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
            <Option value="check">Check</Option>
            <Option value="online">Online</Option>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredPayments || []}
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
          <Column field="feeAssignment.feeStructure.category.name" header="Fee Category" sortable style={{ minWidth: '120px' }} />
          <Column field="amount" header="Amount" body={amountBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="paymentMode" header="Payment Mode" sortable style={{ minWidth: '110px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="paymentDate" header="Payment Date" body={paymentDateBodyTemplate} sortable style={{ minWidth: '120px' }} />
          <Column field="referenceNumber" header="Reference" sortable style={{ minWidth: '120px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '100px' }}
            className="text-center"
            frozen="right"
          />
        </DataTable>
      </div>

      <PaymentModal
        visible={isPaymentModalVisible}
        onCancel={handlePaymentCancel}
        onSubmit={handlePaymentSubmit}
        loading={createPaymentMutation.isPending}
      />

      {/* Reject Payment Modal */}
      <Modal
        title="Reject Payment"
        open={isRejectModalVisible}
        onCancel={handleRejectCancel}
        onOk={handleRejectSubmit}
        okText="Reject"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <div className="py-4">
          <p className="mb-4">Please provide a reason for rejecting this payment:</p>
          <Input.TextArea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default FeePaymentsPage;
