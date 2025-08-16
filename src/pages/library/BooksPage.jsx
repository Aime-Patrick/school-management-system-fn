import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Input, Select, Space, Spin, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook } from '../../hooks/library/useBooks';
import BookForm from '../../components/library/BookForm';

const { Search } = Input;
const { Option } = Select;

const BooksPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: books = [], isLoading, error } = useBooks();
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const deleteMutation = useDeleteBook();

  // Debug logging
  console.log('Books data:', books);
  console.log('Books type:', typeof books);
  console.log('Is array:', Array.isArray(books));

  const handleCreate = () => {
    setEditingBook(null);
    setIsModalVisible(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success('Book deleted successfully');
    } catch (error) {
      message.error('Failed to delete book');
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (editingBook) {
        await updateMutation.mutateAsync(values);
      } else {
        await createMutation.mutateAsync(values);
      }
      setIsModalVisible(false);
      setEditingBook(null);
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingBook(null);
  };

  // Filter books based on search and filters
  const filteredBooks = Array.isArray(books?.data) ? books.data.filter(book => {
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];

  // Body templates for DataTable
  const authorsBodyTemplate = (rowData) => (
    <div className="text-sm">
      {rowData.authors.join(', ')}
    </div>
  );

  const statusBodyTemplate = (rowData) => {
    const statusColors = {
      available: 'green',
      borrowed: 'blue',
      lost: 'red',
      damaged: 'orange'
    };
    
    return (
      <Tag color={statusColors[rowData.status] || 'default'}>
        {rowData.status.toUpperCase()}
      </Tag>
    );
  };

  const copiesBodyTemplate = (rowData) => (
    <div className="text-center">
      <div className="font-medium">{rowData.availableCopies}</div>
      <div className="text-xs text-gray-500">of {rowData.totalCopies}</div>
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
        title="Are you sure you want to delete this book?"
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
          <div className="text-red-500 text-lg mb-2">Error loading books</div>
          <div className="text-gray-600">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 library-page">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 library-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Library Books</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage library book inventory</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          className="w-full sm:w-auto library-page-actions"
        >
          Add Book
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{filteredBooks.length}</div>
          <div className="text-gray-600">Total Books</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredBooks.filter(book => book.status === 'available').length}
          </div>
          <div className="text-gray-600">Available</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {filteredBooks.filter(book => book.status === 'borrowed').length}
          </div>
          <div className="text-gray-600">Borrowed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            {filteredBooks.filter(book => book.status === 'lost' || book.status === 'damaged').length}
          </div>
          <div className="text-gray-600">Lost/Damaged</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 library-filters">
          <Search
            placeholder="Search by title or author"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full"
          />
          <Select
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="w-full"
          >
            <Option value="all">All Categories</Option>
            <Option value="fiction">Fiction</Option>
            <Option value="non-fiction">Non-Fiction</Option>
            <Option value="science">Science</Option>
            <Option value="technology">Technology</Option>
            <Option value="history">History</Option>
            <Option value="philosophy">Philosophy</Option>
            <Option value="literature">Literature</Option>
            <Option value="art">Art</Option>
            <Option value="biography">Biography</Option>
            <Option value="reference">Reference</Option>
            <Option value="textbook">Textbook</Option>
            <Option value="other">Other</Option>
          </Select>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full"
          >
            <Option value="all">All Statuses</Option>
            <Option value="available">Available</Option>
            <Option value="borrowed">Borrowed</Option>
            <Option value="lost">Lost</Option>
            <Option value="damaged">Damaged</Option>
          </Select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable
          value={filteredBooks}
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
          <Column field="title" header="Title" sortable style={{ minWidth: '120px', maxWidth: '200px' }} />
          <Column field="authors" header="Authors" body={authorsBodyTemplate} sortable style={{ minWidth: '100px', maxWidth: '150px' }} />
          <Column field="isbn" header="ISBN" sortable style={{ minWidth: '80px', maxWidth: '120px' }} />
          <Column field="category" header="Category" sortable style={{ minWidth: '80px', maxWidth: '120px' }} />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '80px', maxWidth: '100px' }} />
          <Column field="totalCopies" header="Total Copies" body={copiesBodyTemplate} sortable style={{ minWidth: '60px', maxWidth: '80px' }} />
          <Column field="location" header="Location" sortable style={{ minWidth: '80px', maxWidth: '120px' }} />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            style={{ minWidth: '80px', maxWidth: '100px' }}
            className="text-center"
            frozen={false}
          />
        </DataTable>
      </div>

      <BookForm
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        book={editingBook}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default BooksPage;
