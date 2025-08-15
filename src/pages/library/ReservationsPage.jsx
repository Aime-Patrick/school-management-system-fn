import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useReservations, usePendingReservations, useFulfillReservation, useCancelReservation } from '../../hooks/library/useReservations';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const ReservationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: reservations = [], isLoading } = useReservations();
  const { data: pendingReservations = [] } = usePendingReservations();
  
  const fulfillMutation = useFulfillReservation();
  const cancelMutation = useCancelReservation();

  const handleFulfill = async (id) => {
    try {
      await fulfillMutation.mutateAsync(id);
      message.success('Reservation fulfilled successfully');
    } catch (error) {
      message.error('Failed to fulfill reservation');
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelMutation.mutateAsync(id);
      message.success('Reservation cancelled successfully');
    } catch (error) {
      message.error('Failed to cancel reservation');
    }
  };

  // Filter reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = !searchQuery || 
      reservation.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.member.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Body templates for DataTable
  const bookTitleBodyTemplate = (rowData) => (
    <div>
      <div className="font-medium">{rowData.book.title}</div>
      <div className="text-xs text-gray-500">ISBN: {rowData.book.isbn}</div>
    </div>
  );

  const memberBodyTemplate = (rowData) => (
    <div>
      <div className="font-medium">{rowData.member.name}</div>
      <div className="text-xs text-gray-500">{rowData.member.email}</div>
    </div>
  );

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      pending: 'blue',
      fulfilled: 'green',
      cancelled: 'red',
      expired: 'orange'
    };
    
    return (
      <Tag color={statusColors[rowData.status] || 'default'}>
        {rowData.status.toUpperCase()}
      </Tag>
    );
  };

  const datesBodyTemplate = (rowData) => (
    <div className="text-sm">
      <div>Reserved: {dayjs(rowData.reservationDate).format('MMM DD, YYYY')}</div>
      <div>Expires: {dayjs(rowData.expiryDate).format('MMM DD, YYYY')}</div>
      {rowData.fulfilledDate && (
        <div>Fulfilled: {dayjs(rowData.fulfilledDate).format('MMM DD, YYYY')}</div>
      )}
    </div>
  );

  const actionsBodyTemplate = (rowData) => (
    <Space>
      {rowData.status === 'pending' && (
        <Button
          type="text"
          icon={<CheckOutlined />}
          onClick={() => handleFulfill(rowData.id)}
          size="small"
        >
          Fulfill
        </Button>
      )}
      {rowData.status === 'pending' && (
        <Popconfirm
          title="Are you sure you want to cancel this reservation?"
          onConfirm={() => handleCancel(rowData.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            size="small"
          >
            Cancel
          </Button>
        </Popconfirm>
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Book Reservations</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage book reservations and fulfillment</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{pendingReservations.length}</div>
          <div className="text-gray-600">Pending Reservations</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {reservations.filter(r => r.status === 'fulfilled').length}
          </div>
          <div className="text-gray-600">Fulfilled Today</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            {reservations.filter(r => r.status === 'cancelled').length}
          </div>
          <div className="text-gray-600">Cancelled Today</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">
            {reservations.filter(r => r.status === 'expired').length}
          </div>
          <div className="text-gray-600">Expired Today</div>
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
            <Option value="pending">Pending</Option>
            <Option value="fulfilled">Fulfilled</Option>
            <Option value="cancelled">Cancelled</Option>
            <Option value="expired">Expired</Option>
          </Select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredReservations}
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
          <Column field="book.title" header="Book" body={bookTitleBodyTemplate} sortable style={{ minWidth: '200px' }} />
          <Column field="member.name" header="Member" body={memberBodyTemplate} sortable style={{ minWidth: '150px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="reservationDate" header="Dates" body={datesBodyTemplate} sortable style={{ minWidth: '160px' }} />
          <Column field="notes" header="Notes" sortable style={{ minWidth: '150px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '120px' }}
            className="text-center"
            frozen={false}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default ReservationsPage;
