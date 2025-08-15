import React from 'react';
import { Card, Row, Col, Button, Space, Statistic } from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined, 
  UserOutlined, 
  CreditCardOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const FeesManagementPage = () => {
  const navigate = useNavigate();
  const { authData } = useAuth();

  const feeModules = [
    {
      title: 'Fee Categories',
      description: 'Manage fee categories and their configurations',
      icon: <SettingOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />,
      path: '/school-admin/fees/categories',
      roles: ['school-admin', 'system-admin'],
      color: '#1890ff'
    },
    {
      title: 'Fee Structures',
      description: 'Create and manage fee structures for different classes and terms',
      icon: <FileTextOutlined style={{ fontSize: '2rem', color: '#52c41a' }} />,
      path: '/school-admin/fees/structures',
      roles: ['school-admin', 'system-admin'],
      color: '#52c41a'
    },
    {
      title: 'Fee Assignments',
      description: 'Assign fees to students and manage assignments',
      icon: <UserOutlined style={{ fontSize: '2rem', color: '#fa8c16' }} />,
      path: '/school-admin/fees/assignments',
      roles: ['school-admin', 'system-admin', 'accountant'],
      color: '#fa8c16'
    },
    {
      title: 'Fee Payments',
      description: 'Record and manage fee payments',
      icon: <CreditCardOutlined style={{ fontSize: '2rem', color: '#722ed1' }} />,
      path: '/school-admin/fees/payments',
      roles: ['school-admin', 'system-admin', 'accountant'],
      color: '#722ed1'
    },
    {
      title: 'Fee Reports',
      description: 'View comprehensive fee reports and analytics',
      icon: <BarChartOutlined style={{ fontSize: '2rem', color: '#13c2c2' }} />,
      path: '/school-admin/fees/reports',
      roles: ['school-admin', 'system-admin', 'accountant', 'teacher'],
      color: '#13c2c2'
    }
  ];

  const filteredModules = feeModules.filter(module => 
    module.roles.includes(authData.role)
  );

  const handleModuleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Fees Management</h1>
        <p className="text-gray-600 text-lg">
          Comprehensive fee management system for schools
        </p>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Total Outstanding Fees"
              value={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
              formatter={(value) => new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Pending Payments"
              value={0}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Total Students"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Active Fee Categories"
              value={0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

            {/* Fee Management Modules */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Fee Management Modules</h2>
        <Row gutter={[16, 16]}>
          {filteredModules.map((module, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={index}>
              <Card
                hoverable
                className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => handleModuleClick(module.path)}
                style={{ borderTop: `4px solid ${module.color}` }}
              >
                <div className="text-center">
                  <div className="mb-4">
                    {module.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {module.description}
                  </p>
                  <Button 
                    type="primary"
                    size="large"
                    className="w-full sm:w-auto"
                    style={{ backgroundColor: module.color, borderColor: module.color }}
                  >
                    Access Module
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

            {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {(authData.role === 'school-admin' || authData.role === 'system-admin') && (
            <>
              <Button 
                type="primary"
                icon={<SettingOutlined />}
                onClick={() => navigate('/school-admin/fees/categories')}
                size="large"
                className="w-full sm:w-auto"
              >
                Add Fee Category
              </Button>
              <Button 
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => navigate('/school-admin/fees/structures')}
                size="large"
                className="w-full sm:w-auto"
              >
                Create Fee Structure
              </Button>
            </>
          )}
          {(authData.role === 'school-admin' || authData.role === 'system-admin' || authData.role === 'accountant') && (
            <>
              <Button 
                type="primary"
                icon={<UserOutlined />}
                onClick={() => navigate('/school-admin/fees/assignments')}
                size="large"
                className="w-full sm:w-auto"
              >
                Auto Assign Fees
              </Button>
              <Button 
                type="primary"
                icon={<CreditCardOutlined />}
                onClick={() => navigate('/school-admin/fees/payments')}
                size="large"
                className="w-full sm:w-auto"
              >
                Record Payment
              </Button>
            </>
          )}
          <Button 
            type="default"
            icon={<BarChartOutlined />}
            onClick={() => navigate('/school-admin/fees/reports')}
            size="large"
            className="w-full sm:w-auto"
          >
            View Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeesManagementPage;
