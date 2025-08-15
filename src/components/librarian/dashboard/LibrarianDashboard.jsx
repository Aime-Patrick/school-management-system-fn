import React from 'react';
import { Card, Row, Col, Statistic, Button, Space } from 'antd';
import { 
  BookOutlined, 
  UserOutlined, 
  DollarOutlined, 
  CalendarOutlined, 
  BarChartOutlined,
  PlusOutlined,
  SearchOutlined,
  UserAddOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../../hooks/library/useBooks';
import { useMembers } from '../../../hooks/library/useMembers';
import { useActiveBorrows } from '../../../hooks/library/useBorrow';
import { useUnpaidFines } from '../../../hooks/library/useFines';

const LibrarianDashboard = () => {
  const navigate = useNavigate();
  
  const { data: books = [], isLoading: booksLoading } = useBooks();
  const { data: members = [], isLoading: membersLoading } = useMembers();
  const { data: activeBorrows = [], isLoading: borrowsLoading } = useActiveBorrows();
  const { data: unpaidFines = [], isLoading: finesLoading } = useUnpaidFines();

  const isLoading = booksLoading || membersLoading || borrowsLoading || finesLoading;

  const quickActions = [
    {
      title: 'Add New Book',
      description: 'Add a new book to the library',
      icon: <PlusOutlined className="text-2xl" />,
      action: () => navigate('/librarian/books'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Search Books',
      description: 'Find books in the library',
      icon: <SearchOutlined className="text-2xl" />,
      action: () => navigate('/librarian/books'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Add Member',
      description: 'Register a new library member',
      icon: <UserAddOutlined className="text-2xl" />,
      action: () => navigate('/librarian/members'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Process Borrow',
      description: 'Issue books to members',
      icon: <BookOutlined className="text-2xl" />,
      action: () => navigate('/librarian/borrow'),
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Manage Fines',
      description: 'Handle overdue fines',
      icon: <CreditCardOutlined className="text-2xl" />,
      action: () => navigate('/librarian/fines'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'View Reports',
      description: 'Library analytics and insights',
      icon: <BarChartOutlined className="text-2xl" />,
      action: () => navigate('/librarian/reports'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Library Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the library management system</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic
              title="Total Books"
              value={books.length}
              prefix={<BookOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic
              title="Total Members"
              value={members.length}
              prefix={<UserOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic
              title="Active Borrows"
              value={activeBorrows.length}
              prefix={<BookOutlined className="text-orange-500" />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center">
            <Statistic
              title="Unpaid Fines"
              value={unpaidFines.length}
              prefix={<DollarOutlined className="text-red-500" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={action.action}
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white ${action.color}`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Borrows */}
        <Card title="Recent Borrows" className="h-80">
          <div className="space-y-3">
            {activeBorrows.slice(0, 5).map((borrow, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{borrow.book.title}</div>
                  <div className="text-sm text-gray-600">Borrowed by {borrow.member.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Due: {new Date(borrow.dueDate).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{borrow.status}</div>
                </div>
              </div>
            ))}
            {activeBorrows.length === 0 && (
              <div className="text-center text-gray-500 py-8">No active borrows</div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Button type="primary" onClick={() => navigate('/librarian/borrow')}>
              View All Borrows
            </Button>
          </div>
        </Card>

        {/* Recent Fines */}
        <Card title="Recent Fines" className="h-80">
          <div className="space-y-3">
            {unpaidFines.slice(0, 5).map((fine, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">${fine.amount}</div>
                  <div className="text-sm text-gray-600">{fine.borrow.book.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{fine.borrow.member.name}</div>
                  <div className="text-xs text-gray-500">{fine.reason}</div>
                </div>
              </div>
            ))}
            {unpaidFines.length === 0 && (
              <div className="text-center text-gray-500 py-8">No unpaid fines</div>
            )}
          </div>
          <div className="mt-4 text-center">
            <Button type="primary" onClick={() => navigate('/librarian/fines')}>
              View All Fines
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
