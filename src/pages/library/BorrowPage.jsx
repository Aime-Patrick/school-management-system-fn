import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Modal, message, DatePicker } from 'antd';
import { PlusOutlined, RollbackOutlined, EyeOutlined } from '@ant-design/icons';
import { useActiveBorrows, useOverdueBorrows, useReturnBook, useExtendDueDate } from '../../hooks/library/useBorrow';
import { useBooks } from '../../hooks/library/useBooks';
import { useMembers } from '../../hooks/library/useMembers';
import BorrowForm from '../../components/library/BorrowForm';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

const BorrowPage = () => {
  const [isBorrowModalVisible, setIsBorrowModalVisible] = useState(false);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [returnDate, setReturnDate] = useState(dayjs());
  const [returnCondition, setReturnCondition] = useState('good');
  const [returnNotes, setReturnNotes] = useState('');

  const { data: activeBorrows = [], isLoading: activeLoading, error: activeError } = useActiveBorrows();
  const { data: overdueBorrows = [], isLoading: overdueLoading, error: overdueError } = useOverdueBorrows();
  const { data: books = [], error: booksError } = useBooks();
  const { data: members = [], error: membersError } = useMembers();
  
  // Debug logging
  console.log('Active borrows:', activeBorrows, 'Type:', typeof activeBorrows, 'Is array:', Array.isArray(activeBorrows));
  console.log('Overdue borrows:', overdueBorrows, 'Type:', typeof overdueBorrows, 'Is array:', Array.isArray(overdueBorrows));
  
  const returnMutation = useReturnBook();
  const extendMutation = useExtendDueDate();

  const isLoading = activeLoading || overdueLoading;

  const handleBorrow = () => {
    setIsBorrowModalVisible(true);
  };

  const handleReturn = (borrow) => {
    setSelectedBorrow(borrow);
    setReturnDate(dayjs());
    setReturnCondition('good');
    setReturnNotes('');
    setIsReturnModalVisible(true);
  };

  const handleExtend = async (borrowId) => {
    try {
      const newDueDate = dayjs().add(7, 'day').format('YYYY-MM-DD');
      await extendMutation.mutateAsync({ borrowId, newDueDate });
      message.success('Due date extended successfully');
    } catch (error) {
      message.error('Failed to extend due date');
    }
  };

  const handleReturnSubmit = async () => {
    if (!selectedBorrow) return;

    try {
      await returnMutation.mutateAsync({
        borrowId: selectedBorrow.id,
        returnDate: returnDate.format('YYYY-MM-DD'),
        condition: returnCondition,
        notes: returnNotes
      });
      
      setIsReturnModalVisible(false);
      setSelectedBorrow(null);
      message.success('Book returned successfully');
    } catch (error) {
      message.error('Failed to return book');
    }
  };

  const handleReturnCancel = () => {
    setIsReturnModalVisible(false);
    setSelectedBorrow(null);
  };

  // Combine and filter borrows - ensure both are arrays
  const activeBorrowsArray = Array.isArray(activeBorrows) ? activeBorrows : [];
  const overdueBorrowsArray = Array.isArray(overdueBorrows) ? overdueBorrows : [];
  const allBorrows = [...activeBorrowsArray, ...overdueBorrowsArray];
  const filteredBorrows = allBorrows.filter(borrow => {
    const matchesSearch = !searchQuery || 
      borrow.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrow.member.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || borrow.status === statusFilter;
    
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

  const datesBodyTemplate = (rowData) => (
    <div className="text-sm">
      <div>Borrowed: {dayjs(rowData.borrowDate).format('MMM DD, YYYY')}</div>
      <div>Due: {dayjs(rowData.dueDate).format('MMM DD, YYYY')}</div>
    </div>
  );

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      borrowed: 'blue',
      overdue: 'red',
      returned: 'green',
      lost: 'orange'
    };
    
    return (
      <Tag color={statusColors[rowData.status] || 'default'}>
        {rowData.status.toUpperCase()}
      </Tag>
    );
  };

  const daysOverdueBodyTemplate = (rowData) => {
    if (rowData.status !== 'overdue') return '-';
    
    const days = dayjs().diff(dayjs(rowData.dueDate), 'day');
    return (
      <Tag color="red">
        {days} day{days !== 1 ? 's' : ''} overdue
      </Tag>
    );
  };

  const actionsBodyTemplate = (rowData) => (
    <Space>
      {rowData.status === 'borrowed' && (
        <Button
          type="text"
          icon={<RollbackOutlined />}
          onClick={() => handleReturn(rowData)}
          size="small"
        >
          Return
        </Button>
      )}
      {rowData.status === 'borrowed' && (
        <Button
          type="text"
          onClick={() => handleExtend(rowData.id)}
          size="small"
        >
          Extend
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

  // Check for errors
  const hasError = activeError || overdueError || booksError || membersError;
  if (hasError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading data</div>
          <div className="text-gray-600">
            {activeError?.message || overdueError?.message || booksError?.message || membersError?.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 library-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 library-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Book Borrowing</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage book borrowing and returns</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleBorrow}
          size="large"
          className="w-full sm:w-auto library-page-actions"
        >
          Borrow Book
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{activeBorrows.length}</div>
          <div className="text-gray-600">Active Borrows</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">{overdueBorrows.length}</div>
          <div className="text-gray-600">Overdue Books</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {allBorrows.filter(b => b.status === 'returned').length}
          </div>
          <div className="text-gray-600">Returned Today</div>
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
            <Option value="borrowed">Borrowed</Option>
            <Option value="overdue">Overdue</Option>
            <Option value="returned">Returned</Option>
            <Option value="lost">Lost</Option>
          </Select>
        </div>
      </div>

      {/* Borrows Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredBorrows}
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
          <Column field="borrowDate" header="Dates" body={datesBodyTemplate} sortable style={{ minWidth: '140px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="daysOverdue" header="Overdue" body={daysOverdueBodyTemplate} sortable style={{ minWidth: '100px' }} />
          <Column field="fineAmount" header="Fine" sortable style={{ minWidth: '80px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '120px' }}
            className="text-center"
            frozen={false}
          />
        </DataTable>
      </div>

      {/* Borrow Modal */}
      <BorrowForm
        visible={isBorrowModalVisible}
        onCancel={() => setIsBorrowModalVisible(false)}
        onSubmit={() => {
          setIsBorrowModalVisible(false);
          message.success('Book borrowed successfully');
        }}
        books={Array.isArray(books) ? books.filter(book => book.availableCopies > 0) : []}
        members={Array.isArray(members) ? members.filter(member => member.status === 'active') : []}
      />

      {/* Return Modal */}
      <Modal
        title="Return Book"
        open={isReturnModalVisible}
        onCancel={handleReturnCancel}
        onOk={handleReturnSubmit}
        okText="Return Book"
        cancelText="Cancel"
        width="90vw"
        style={{ maxWidth: '500px' }}
        centered
        className="library-modal"
      >
        {selectedBorrow && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Book Details</h4>
              <div className="text-sm">
                <div><strong>Title:</strong> {selectedBorrow.book.title}</div>
                <div><strong>Member:</strong> {selectedBorrow.member.name}</div>
                <div><strong>Due Date:</strong> {dayjs(selectedBorrow.dueDate).format('MMM DD, YYYY')}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Return Date</label>
                <DatePicker
                  value={returnDate}
                  onChange={(date) => setReturnDate(date || dayjs())}
                  style={{ width: '100%' }}
                  size="large"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Book Condition</label>
                <Select
                  value={returnCondition}
                  onChange={setReturnCondition}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="good">Good</Option>
                  <Option value="damaged">Damaged</Option>
                  <Option value="lost">Lost</Option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <Input.TextArea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                placeholder="Add any notes about the return"
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

export default BorrowPage;
