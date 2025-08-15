import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Modal, message, DatePicker, InputNumber } from 'antd';
import { DollarOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useUnpaidFines, usePaidFines, usePayFine, useWaiveFine } from '../../hooks/library/useFines';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const FinesPage = () => {
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isWaiveModalVisible, setIsWaiveModalVisible] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [waiveNotes, setWaiveNotes] = useState('');

  const { data: unpaidFines = [], isLoading: unpaidLoading } = useUnpaidFines();
  const { data: paidFines = [], isLoading: paidLoading } = usePaidFines();
  
  const payFineMutation = usePayFine();
  const waiveFineMutation = useWaiveFine();

  const isLoading = unpaidLoading || paidLoading;

  const handlePayFine = (fine) => {
    setSelectedFine(fine);
    setPaymentAmount(fine.amount);
    setPaymentMethod('cash');
    setPaymentNotes('');
    setIsPaymentModalVisible(true);
  };

  const handleWaiveFine = (fine) => {
    setSelectedFine(fine);
    setWaiveNotes('');
    setIsWaiveModalVisible(true);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedFine) return;

    try {
      await payFineMutation.mutateAsync({
        fineId: selectedFine.id,
        amount: paymentAmount,
        paymentMethod,
        notes: paymentNotes
      });
      
      setIsPaymentModalVisible(false);
      setSelectedFine(null);
      message.success('Fine paid successfully');
    } catch (error) {
      message.error('Failed to pay fine');
    }
  };

  const handleWaiveSubmit = async () => {
    if (!selectedFine) return;

    try {
      await waiveFineMutation.mutateAsync({
        fineId: selectedFine.id,
        waivedBy: 'Current User', // This should come from auth context
        notes: waiveNotes
      });
      
      setIsWaiveModalVisible(false);
      setSelectedFine(null);
      message.success('Fine waived successfully');
    } catch (error) {
      message.error('Failed to waive fine');
    }
  };

  // Combine and filter fines
  const allFines = [...unpaidFines, ...paidFines];
  const filteredFines = allFines.filter(fine => {
    const matchesSearch = !searchQuery || 
      fine.borrow.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.borrow.member.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Body templates for DataTable
  const bookTitleBodyTemplate = (rowData) => (
    <div>
      <div className="font-medium">{rowData.borrow.book.title}</div>
      <div className="text-xs text-gray-500">ISBN: {rowData.borrow.book.isbn}</div>
    </div>
  );

  const memberBodyTemplate = (rowData) => (
    <div>
      <div className="font-medium">{rowData.borrow.member.name}</div>
      <div className="text-xs text-gray-500">{rowData.borrow.member.email}</div>
    </div>
  );

  const amountBodyTemplate = (rowData) => (
    <div className="text-right font-medium text-red-600">
      ${(rowData.amount || 0).toFixed(2)}
    </div>
  );

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      unpaid: 'red',
      paid: 'green',
      waived: 'orange'
    };
    
    return (
      <Tag color={statusColors[rowData.status] || 'default'}>
        {rowData.status.toUpperCase()}
      </Tag>
    );
  };

  const reasonBodyTemplate = (rowData) => {
    const reasonColors = {
      overdue: 'red',
      damaged: 'orange',
      lost: 'red',
      other: 'default'
    };
    
    return (
      <Tag color={reasonColors[rowData.reason] || 'default'}>
        {rowData.reason.toUpperCase()}
      </Tag>
    );
  };

  const datesBodyTemplate = (rowData) => (
    <div className="text-sm">
      <div>Due: {dayjs(rowData.borrow.dueDate).format('MMM DD, YYYY')}</div>
      {rowData.paidDate && (
        <div>Paid: {dayjs(rowData.paidDate).format('MMM DD, YYYY')}</div>
      )}
      {rowData.waivedDate && (
        <div>Waived: {dayjs(rowData.waivedDate).format('MMM DD, YYYY')}</div>
      )}
    </div>
  );

  const actionsBodyTemplate = (rowData) => (
    <Space>
      {rowData.status === 'unpaid' && (
        <Button
          type="text"
          icon={<CheckOutlined />}
          onClick={() => handlePayFine(rowData)}
          size="small"
        >
          Pay
        </Button>
      )}
      {rowData.status === 'unpaid' && (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => handleWaiveFine(rowData)}
          size="small"
        >
          Waive
        </Button>
      )}
    </Space>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 library-page">
      <div className="mb-6 library-page-header">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Library Fines</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage library fines and payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">{unpaidFines.length}</div>
          <div className="text-gray-600">Unpaid Fines</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{paidFines.length}</div>
          <div className="text-gray-600">Paid Fines</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            ${unpaidFines.reduce((sum, fine) => sum + (fine.amount || 0), 0).toFixed(2)}
          </div>
          <div className="text-gray-600">Total Outstanding</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            ${paidFines.reduce((sum, fine) => sum + (fine.amount || 0), 0).toFixed(2)}
          </div>
          <div className="text-gray-600">Total Collected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 library-filters">
          <Search
            placeholder="Search by book title or member name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full"
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full"
          >
            <Option value="all">All Statuses</Option>
            <Option value="unpaid">Unpaid</Option>
            <Option value="paid">Paid</Option>
            <Option value="waived">Waived</Option>
          </Select>
        </div>
      </div>

      {/* Fines Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredFines}
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
          <Column field="borrow.book.title" header="Book" body={bookTitleBodyTemplate} sortable style={{ minWidth: '200px' }} />
          <Column field="borrow.member.name" header="Member" body={memberBodyTemplate} sortable style={{ minWidth: '150px' }} />
          <Column field="amount" header="Amount" body={amountBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="reason" header="Reason" body={reasonBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="borrow.dueDate" header="Dates" body={datesBodyTemplate} sortable style={{ minWidth: '140px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '120px' }}
            className="text-center"
            frozen={false}
          />
        </DataTable>
      </div>

      {/* Payment Modal */}
      <Modal
        title="Pay Fine"
        open={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        onOk={handlePaymentSubmit}
        okText="Pay Fine"
        cancelText="Cancel"
        width="90vw"
        style={{ maxWidth: '500px' }}
        centered
        className="library-modal"
      >
        {selectedFine && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Fine Details</h4>
              <div className="text-sm">
                <div><strong>Book:</strong> {selectedFine.borrow.book.title}</div>
                <div><strong>Member:</strong> {selectedFine.borrow.member.name}</div>
                <div><strong>Reason:</strong> {selectedFine.reason}</div>
                <div><strong>Amount:</strong> ${selectedFine.amount}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Payment Amount</label>
                <InputNumber
                  value={paymentAmount}
                  onChange={(value) => setPaymentAmount(value || 0)}
                  min={0}
                  max={selectedFine.amount}
                  style={{ width: '100%' }}
                  size="large"
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <Select
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="cash">Cash</Option>
                  <Option value="card">Card</Option>
                  <Option value="bank_transfer">Bank Transfer</Option>
                  <Option value="online">Online Payment</Option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <TextArea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="Add any payment notes"
                rows={3}
                size="large"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Waive Modal */}
      <Modal
        title="Waive Fine"
        open={isWaiveModalVisible}
        onCancel={() => setIsWaiveModalVisible(false)}
        onOk={handleWaiveSubmit}
        okText="Waive Fine"
        cancelText="Cancel"
        width="90vw"
        style={{ maxWidth: '500px' }}
        centered
        className="library-modal"
      >
        {selectedFine && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Fine Details</h4>
              <div className="text-sm">
                <div><strong>Book:</strong> {selectedFine.borrow.book.title}</div>
                <div><strong>Member:</strong> {selectedFine.borrow.member.name}</div>
                <div><strong>Reason:</strong> {selectedFine.reason}</div>
                <div><strong>Amount:</strong> ${selectedFine.amount}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason for Waiving</label>
              <TextArea
                value={waiveNotes}
                onChange={(e) => setWaiveNotes(e.target.value)}
                placeholder="Please provide a reason for waiving this fine"
                rows={3}
                size="large"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FinesPage;
