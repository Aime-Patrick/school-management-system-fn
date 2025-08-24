import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Space, 
  Popconfirm, 
  message, 
  Spin, 
  Tabs, 
  Row, 
  Col, 
  Statistic,
  Tooltip,
  Badge,
  Typography,
  Alert,
  Checkbox,
  DatePicker
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UserOutlined,
  CopyOutlined,
  TeamOutlined,
  SettingOutlined,
  SearchOutlined,
  FilterOutlined,
  CrownOutlined,
  BankOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { 
  useUsersWithPermissions,
  usePermissionSets,
  useUserPermissions,
  useBulkAssignMutation,
  useAssignPermissionSetMutation,
  useCopyPermissionsMutation,
  useRevokePermissionsMutation,
  useAllPermissions,
  useAllSchools,
  useDataIntegrityIssues,
  useFixDataIntegrityMutation
} from '../../hooks/usePermissions';

import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const SystemAdminDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [isCopyModalVisible, setIsCopyModalVisible] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [copyForm] = Form.useForm();
  const { authData } = useAuth();

  // System Admin specific data - NO schoolId needed!
  const { 
    data: allSchools, 
    isLoading: schoolsLoading 
  } = useAllSchools();

  const { 
    data: allPermissions, 
    isLoading: permissionsLoading 
  } = useAllPermissions();

  // Get ALL users across ALL schools (System Admin endpoint)
  const { 
    data: usersWithPermissions, 
    isLoading: usersLoading,
    error: usersError 
  } = useUsersWithPermissions(null, true); // true = isSystemAdmin

  const { 
    data: permissionSets, 
    isLoading: setsLoading,
    error: setsError
  } = usePermissionSets();

  const { 
    data: selectedUserPermissions, 
    isLoading: userPermissionsLoading 
  } = useUserPermissions(selectedUser, null, true); // true = isSystemAdmin

  // Data integrity check
  const { data: dataIntegrityIssues } = useDataIntegrityIssues();

  // Mutations
  const bulkAssignMutation = useBulkAssignMutation();
  const assignSetMutation = useAssignPermissionSetMutation();
  const copyPermissionsMutation = useCopyPermissionsMutation();
  const revokeMutation = useRevokePermissionsMutation();
  const fixDataIntegrityMutation = useFixDataIntegrityMutation();

  // Available resources and actions
  const resources = [
    'FEE_CATEGORIES', 'FEE_STRUCTURES', 'FEE_ASSIGNMENTS', 'PAYMENTS',
    'STUDENTS', 'TEACHERS', 'PARENTS', 'LIBRARY', 'BOOKS', 'BORROW_RECORDS',
    'MEMBERS', 'CLASSES', 'COURSES', 'ASSIGNMENTS', 'RESULTS', 'QUIZZES',
    'EVENTS', 'ACADEMIC_YEARS', 'TERMS', 'USERS', 'SCHOOLS', 'FINANCIAL', 'REPORTS'
  ];

  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'VIEW'];
  // System Admins can manage ALL roles
  const availableRoles = ['system-admin', 'school-admin', 'teacher', 'student', 'librarian', 'accountant', 'parent'];

  // Filter users based on search
  const filteredUsers = usersWithPermissions?.filter(user => {
    const matchesSearch = !searchText || 
      user.user?.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.user?.role?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.user?.school?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.user?.role === selectedRole;
    
    return matchesSearch && matchesRole;
  }) || [];

  // Table columns for users - NOTE: Includes school column
  const userColumns = [
    {
      title: 'User',
      dataIndex: ['user', 'username'],
      key: 'username',
      render: (username, record) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{username}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.user?.id}
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.user?.username?.localeCompare(b.user?.username),
    },
    {
      title: 'School',
      dataIndex: ['user', 'school'],
      key: 'school',
      render: (school) => (
        <Tag color="green" icon={<BankOutlined />}>
          {school || 'System Admin'}
        </Tag>
      ),
      filters: allSchools?.map(school => ({ text: school.name, value: school.name })) || [],
      onFilter: (value, record) => record.user?.school === value,
    },
    {
      title: 'Role',
      dataIndex: ['user', 'role'],
      key: 'role',
      render: (role) => (
        <Tag color={role === 'system-admin' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
      filters: availableRoles.map(role => ({ text: role, value: role })),
      onFilter: (value, record) => record.user?.role === value,
    },
    {
      title: 'Role Permissions',
      key: 'rolePermissions',
      render: (_, record) => {
        const rolePerms = record.permissions?.rolePermissions || {};
        const count = Object.values(rolePerms).flat().length;
        return (
          <Badge count={count} showZero />
        );
      },
      sorter: (a, b) => {
        const aCount = Object.values(a.permissions?.rolePermissions || {}).flat().length;
        const bCount = Object.values(b.permissions?.rolePermissions || {}).flat().length;
        return aCount - bCount;
      },
    },
    {
      title: 'Custom Permissions',
      key: 'customPermissions',
      render: (_, record) => {
        const customPerms = record.permissions?.userPermissions || [];
        return (
          <Badge count={customPerms.length} showZero />
        );
      },
      sorter: (a, b) => {
        const aCount = a.permissions?.userPermissions?.length || 0;
        const bCount = b.permissions?.userPermissions?.length || 0;
        return aCount - bCount;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Permissions">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Permissions">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Copy Permissions">
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              size="small"
              onClick={() => handleCopyPermissions(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to revoke all custom permissions for this user?"
            onConfirm={() => handleRevokeAll(record.user?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Revoke Custom Permissions">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleViewUser = (user) => {
    setSelectedUser(user.user?.id);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user.user?.id);
    setIsModalVisible(true);
  };

  const handleCopyPermissions = (user) => {
    copyForm.setFieldsValue({
      sourceUserId: user.user?.id,
      sourceUserName: user.user?.username,
    });
    setIsCopyModalVisible(true);
  };

  const handleRevokeAll = (userId) => {
    const user = usersWithPermissions?.find(u => u.user?.id === userId);
    const customPermissions = user?.permissions?.userPermissions || [];
    
    if (customPermissions.length === 0) {
      message.info('No custom permissions to revoke');
      return;
    }

    const permissionsToRevoke = customPermissions.reduce((acc, perm) => {
      const existing = acc.find(p => p.resource === perm.resource);
      if (existing) {
        existing.actions.push(perm.action);
      } else {
        acc.push({ resource: perm.resource, actions: [perm.action] });
      }
      return acc;
    }, []);

    revokeMutation.mutate({
      userId,
      permissions: permissionsToRevoke
    }, {
      onSuccess: () => {
        message.success('Custom permissions revoked successfully');
      },
      onError: () => {
        message.error('Failed to revoke permissions');
      }
    });
  };

  const handleBulkAssign = (values) => {
    const permissions = [];
    
    if (values.selectedPermissions) {
      Object.entries(values.selectedPermissions).forEach(([resource, selectedActions]) => {
        if (selectedActions && selectedActions.length > 0) {
          permissions.push({
            resource,
            actions: selectedActions
          });
        }
      });
    }

    const payload = {
      userIds: values.userIds,
      permissions,
      expiresAt: values.expiresAt ? dayjs(values.expiresAt).toISOString() : undefined,
      reason: values.reason
    };

    bulkAssignMutation.mutate(payload, {
      onSuccess: () => {
        message.success('Permissions assigned successfully');
        setIsBulkModalVisible(false);
        bulkForm.resetFields();
      },
      onError: () => {
        message.error('Failed to assign permissions');
      }
    });
  };

  const handleAssignSet = (values) => {
    const payload = {
      userIds: values.userIds,
      permissionSet: values.permissionSet,
      expiresAt: values.expiresAt ? dayjs(values.expiresAt).toISOString() : undefined,
      reason: values.reason
    };

    assignSetMutation.mutate(payload, {
      onSuccess: () => {
        message.success('Permission set assigned successfully');
        setIsBulkModalVisible(false);
        bulkForm.resetFields();
      },
      onError: () => {
        message.error('Failed to assign permission set');
      }
    });
  };

  const handleCopyPermissionsSubmit = (values) => {
    const payload = {
      sourceUserId: values.sourceUserId,
      targetUserIds: values.targetUserIds,
      includeExpiration: values.includeExpiration || false,
      reason: values.reason
    };

    copyPermissionsMutation.mutate(payload, {
      onSuccess: () => {
        message.success('Permissions copied successfully');
        setIsCopyModalVisible(false);
        copyForm.resetFields();
      },
      onError: () => {
        message.error('Failed to copy permissions');
      }
    });
  };

  console.log(selectedUserPermissions)

  const handleAssignUserToSchool = (userId) => {
    // For now, we'll use a simple assignment to the first available school
    // In a real implementation, you might want to show a modal to select the school
    const firstSchool = allSchools?.[0];
    if (!firstSchool) {
      message.error('No schools available for assignment');
      return;
    }

    const assignment = {
      userId,
      schoolId: firstSchool.id,
      reason: 'Data integrity fix - automatic assignment'
    };

    fixDataIntegrityMutation.mutate([assignment], {
      onSuccess: () => {
        message.success(`User assigned to ${firstSchool.name} successfully`);
      },
      onError: () => {
        message.error('Failed to assign user to school');
      }
    });
  };

  // Statistics
  const stats = {
    total: usersWithPermissions?.length || 0,
    active: usersWithPermissions?.filter(u => u.user?.isActive !== false).length || 0,
    inactive: usersWithPermissions?.filter(u => u.user?.isActive === false).length || 0,
    withCustomPermissions: usersWithPermissions?.filter(u => (u.permissions?.userPermissions?.length || 0) > 0).length || 0,
    systemAdmins: usersWithPermissions?.filter(u => u.user?.role === 'system-admin').length || 0,
    schoolAdmins: usersWithPermissions?.filter(u => u.user?.role === 'school-admin').length || 0,
  };

  if (usersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
        <div className="ml-4">
          <Text>Loading system data...</Text>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading System Data"
          description="Failed to load system-wide user data. Please try again."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <Title level={2} className="mb-2">
                <CrownOutlined className="mr-2" />
                System User Permissions
              </Title>
              <Text type="secondary">
                Manage permissions across all schools in the system
              </Text>
            </div>
            <Space>
              <Button 
                icon={<UploadOutlined />} 
                onClick={() => setIsBulkModalVisible(true)}
              >
                Bulk Assign
              </Button>
              <Button 
                icon={<SettingOutlined />} 
                onClick={() => setIsBulkModalVisible(true)}
              >
                Assign Set
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setIsModalVisible(true)}
              >
                Manage Permissions
              </Button>
            </Space>
          </div>

          {/* System Admin Notice */}
          <Alert
            message="System Administrator Access"
            description="You have full system-wide control. You can manage permissions across all schools and create system-wide permission sets."
            type="info"
            showIcon
            className="mb-4"
          />

          {/* Data Integrity Issues */}
          {dataIntegrityIssues?.usersWithoutSchool?.length > 0 && (
            <Card title="Data Integrity Issues" className="mb-4">
              <Alert
                message={`${dataIntegrityIssues.usersWithoutSchool.length} users are not associated with any school`}
                description="These users cannot access school-specific features properly."
                type="error"
                showIcon
                className="mb-4"
              />
              
              <Table
                columns={[
                  { title: 'Username', dataIndex: 'username', key: 'username' },
                  { title: 'Role', dataIndex: 'role', key: 'role' },
                  { title: 'Email', dataIndex: 'email', key: 'email' },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={() => handleAssignUserToSchool(record.id)}
                        loading={fixDataIntegrityMutation.isPending}
                      >
                        Assign to School
                      </Button>
                    ),
                  },
                ]}
                dataSource={dataIntegrityIssues.usersWithoutSchool}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          )}

          {/* Statistics Cards */}
          <Row gutter={16} className="mb-6">
            <Col span={4}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={stats.total}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="System Admins"
                  value={stats.systemAdmins}
                  prefix={<CrownOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="School Admins"
                  value={stats.schoolAdmins}
                  prefix={<BankOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Users with Custom Permissions"
                  value={stats.withCustomPermissions}
                  prefix={<SettingOutlined />}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={stats.active}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card>
                <Statistic
                  title="Inactive Users"
                  value={stats.inactive}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Main Content */}
        <Tabs
          defaultActiveKey="users"
          className="bg-white rounded-lg shadow px-6 py-4"
          items={[
            {
              key: 'users',
              label: 'System Users & Permissions',
              children: (
                <Card className="bg-white rounded-lg shadow">
                  {/* Filters */}
                  <div className="mb-4 flex flex-wrap gap-4 items-center">
                    <Input
                      placeholder="Search users..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                    />
                    <Select
                      placeholder="Filter by Role"
                      value={selectedRole}
                      onChange={setSelectedRole}
                      style={{ width: 150 }}
                    >
                      <Option value="all">All Roles</Option>
                      {availableRoles.map(role => (
                        <Option key={role} value={role}>{role}</Option>
                      ))}
                    </Select>
                    <Button 
                      icon={<FilterOutlined />}
                      onClick={() => {
                        setSelectedRole('all');
                        setSearchText('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>

                  {/* Users Table */}
                  <Table
                    columns={userColumns}
                    dataSource={filteredUsers}
                    rowKey={record => record.user?.id}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => 
                        `${range[0]}-${range[1]} of ${total} users`,
                    }}
                    loading={usersLoading}
                    scroll={{ x: 1200 }}
                  />
                </Card>
              ),
            },
            {
              key: 'permissions',
              label: 'System Permissions',
              children: (
                <Card className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <Alert
                      message="System-Wide Permissions"
                      description="Manage role-based permissions that apply across all schools"
                      type="info"
                      showIcon
                      className="mb-4"
                    />
                    <Table
                      columns={[
                        {
                          title: 'Resource',
                          dataIndex: 'resource',
                          key: 'resource',
                          render: (resource) => (
                            <Tag color="blue" icon={<SettingOutlined />}>
                              {resource}
                            </Tag>
                          ),
                        },
                        {
                          title: 'Action',
                          dataIndex: 'action',
                          key: 'action',
                          render: (action) => {
                            const colors = {
                              CREATE: 'green',
                              READ: 'blue',
                              UPDATE: 'orange',
                              DELETE: 'red',
                              VIEW: 'purple'
                            };
                            return (
                              <Tag color={colors[action] || 'default'}>
                                {action}
                              </Tag>
                            );
                          },
                        },
                        {
                          title: 'Roles',
                          dataIndex: 'roles',
                          key: 'roles',
                          render: (roles) => (
                            <Space>
                              {roles.map(role => (
                                <Tag key={role} color="green">
                                  {role}
                                </Tag>
                              ))}
                            </Space>
                          ),
                        },
                        {
                          title: 'Actions',
                          key: 'actions',
                          render: () => (
                            <Space>
                              <Button type="text" icon={<EditOutlined />} size="small">
                                Edit
                              </Button>
                              <Button type="text" danger icon={<DeleteOutlined />} size="small">
                                Delete
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={allPermissions || []}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                      }}
                    />
                  </div>
                </Card>
              ),
            },
            {
              key: 'audit',
              label: 'System Audit Trail',
              children: (
                <Card className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <Alert
                      message="System-Wide Audit Trail"
                      description="Track all permission changes across the entire system"
                      type="info"
                      showIcon
                      className="mb-4"
                    />
                    <Table
                      columns={[
                        {
                          title: 'Date',
                          dataIndex: 'date',
                          key: 'date',
                          render: (date) => new Date(date).toLocaleString(),
                        },
                        {
                          title: 'School',
                          dataIndex: 'school',
                          key: 'school',
                          render: (school) => (
                            <Tag color="green" icon={<BankOutlined />}>
                              {school}
                            </Tag>
                          ),
                        },
                        {
                          title: 'User',
                          dataIndex: 'userName',
                          key: 'userName',
                        },
                        {
                          title: 'Action',
                          dataIndex: 'action',
                          key: 'action',
                          render: (action) => {
                            const colors = {
                              'GRANT': 'green',
                              'REVOKE': 'red',
                              'UPDATE': 'orange',
                              'COPY': 'blue'
                            };
                            return (
                              <Tag color={colors[action] || 'default'}>
                                {action}
                              </Tag>
                            );
                          },
                        },
                        {
                          title: 'Granted By',
                          dataIndex: 'grantedBy',
                          key: 'grantedBy',
                        },
                        {
                          title: 'Reason',
                          dataIndex: 'reason',
                          key: 'reason',
                        },
                      ]}
                      dataSource={[]} // TODO: Add audit trail data
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                      }}
                    />
                  </div>
                </Card>
              ),
            },
          ]}
        />
      </div>

      {/* User Permissions Modal */}
      <Modal
        title={`User Permissions `}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedUser(null);
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        {userPermissionsLoading ? (
          <Spin size="large" />
        ) : (
          <div>
            <Alert
              message="User Permissions"
              description={`Showing permissions for: ${selectedUserPermissions?.user?.username}`}
              type="info"
              showIcon
              className="mb-4"
            />
            
            {/* Role Permissions */}
            <div className="mb-6">
              <Title level={4}>Role-Based Permissions</Title>
              <Table
                columns={[
                  {
                    title: 'Resource',
                    dataIndex: 'resource',
                    key: 'resource',
                    render: (resource) => (
                      <Tag color="blue" icon={<SettingOutlined />}>
                        {resource}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    render: (actions) => (
                      <Space>
                        {actions.map(action => {
                          const colors = {
                            CREATE: 'green',
                            READ: 'blue',
                            UPDATE: 'orange',
                            DELETE: 'red',
                            VIEW: 'purple'
                          };
                          return (
                            <Tag key={action} color={colors[action] || 'default'}>
                              {action}
                            </Tag>
                          );
                        })}
                      </Space>
                    ),
                  },
                ]}
                dataSource={Object.entries(selectedUserPermissions?.rolePermissions || {}).map(([resource, actions]) => ({
                  key: resource,
                  resource,
                  actions
                }))}
                rowKey="resource"
                pagination={false}
              />
            </div>

            {/* Custom Permissions */}
            <div>
              <Title level={4}>Custom Permissions</Title>
              <Table
                columns={[
                  {
                    title: 'Resource',
                    dataIndex: 'resource',
                    key: 'resource',
                    render: (resource) => (
                      <Tag color="green" icon={<SettingOutlined />}>
                        {resource}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Action',
                    dataIndex: 'action',
                    key: 'action',
                    render: (action) => {
                      const colors = {
                        CREATE: 'green',
                        READ: 'blue',
                        UPDATE: 'orange',
                        DELETE: 'red',
                        VIEW: 'purple'
                      };
                      return (
                        <Tag color={colors[action] || 'default'}>
                          {action}
                        </Tag>
                      );
                    },
                  },
                  {
                    title: 'Granted By',
                    dataIndex: 'grantedBy',
                    key: 'grantedBy',
                  },
                  {
                    title: 'Expires',
                    dataIndex: 'expiresAt',
                    key: 'expiresAt',
                    render: (expiresAt) => {
                      if (!expiresAt) return <Tag color="default">Never</Tag>;
                      const isExpired = new Date(expiresAt) < new Date();
                      return (
                        <Tag color={isExpired ? 'red' : 'green'}>
                          {dayjs(expiresAt).format('YYYY-MM-DD HH:mm')}
                        </Tag>
                      );
                    },
                  },
                  {
                    title: 'Reason',
                    dataIndex: 'reason',
                    key: 'reason',
                  },
                ]}
                dataSource={selectedUserPermissions?.userPermissions || []}
                rowKey={(record, index) => `${record.resource}-${record.action}-${index}`}
                pagination={false}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Bulk Assign Modal */}
      <Modal
        title="Bulk Assign Permissions"
        open={isBulkModalVisible}
        onCancel={() => {
          setIsBulkModalVisible(false);
          bulkForm.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Tabs
          items={[
            {
              key: 'bulk',
              label: 'Bulk Assign',
              children: (
                <Form
                  form={bulkForm}
                  layout="vertical"
                  onFinish={handleBulkAssign}
                >
                  <Form.Item
                    name="userIds"
                    label="Select Users"
                    rules={[{ required: true, message: 'Please select users' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select users"
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {usersWithPermissions?.map(user => (
                        <Option key={user.user?.id} value={user.user?.id}>
                          {user.user?.username} ({user.user?.school})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="selectedPermissions"
                    label="Select Permissions"
                    rules={[{ required: true, message: 'Please select permissions' }]}
                  >
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {resources.map(resource => (
                        <Card key={resource} size="small" className="mb-2">
                          <div className="flex justify-between items-center mb-2">
                            <Text strong>{resource}</Text>
                          </div>
                          <Checkbox.Group>
                            {actions.map(action => (
                              <Checkbox key={action} value={action}>{action}</Checkbox>
                            ))}
                          </Checkbox.Group>
                        </Card>
                      ))}
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="expiresAt"
                    label="Expiration Date"
                  >
                    <DatePicker 
                      showTime 
                      placeholder="Select expiration date (optional)"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="reason"
                    label="Reason for Granting Permissions"
                    rules={[{ required: true, message: 'Please provide a reason for granting these permissions' }]}
                  >
                    <Input.TextArea 
                      placeholder="e.g., Temporary access for fee management, Staff onboarding, etc."
                      rows={3}
                    />
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Space className="w-full justify-end">
                      <Button onClick={() => {
                        setIsBulkModalVisible(false);
                        bulkForm.resetFields();
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={bulkAssignMutation.isPending}
                      >
                        Assign Permissions
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'set',
              label: 'Assign Set',
              children: (
                <Form
                  form={bulkForm}
                  layout="vertical"
                  onFinish={handleAssignSet}
                >
                  <Form.Item
                    name="userIds"
                    label="Select Users"
                    rules={[{ required: true, message: 'Please select users' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select users"
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {usersWithPermissions?.map(user => (
                        <Option key={user.user?.id} value={user.user?.id}>
                          {user.user?.username} ({user.user?.school})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="permissionSet"
                    label="Permission Set"
                    rules={[{ required: true, message: 'Please select a permission set' }]}
                  >
                    <Select
                      placeholder="Select permission set"
                      loading={setsLoading}
                      disabled={setsError}
                    >
                      {permissionSets?.map(set => (
                        <Option key={set.name} value={set.name}>
                          {set.name} - {set.description}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {setsError && (
                    <Alert
                      message="Permission Sets Unavailable"
                      description="Unable to load permission sets. Please contact your system administrator."
                      type="error"
                      showIcon
                      className="mb-4"
                    />
                  )}

                  <Form.Item
                    name="expiresAt"
                    label="Expiration Date"
                  >
                    <DatePicker 
                      showTime 
                      placeholder="Select expiration date (optional)"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="reason"
                    label="Reason for Granting Permission Set"
                    rules={[{ required: true, message: 'Please provide a reason for granting this permission set' }]}
                  >
                    <Input.TextArea 
                      placeholder="e.g., Staff onboarding, Role assignment, Temporary access, etc."
                      rows={3}
                    />
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Space className="w-full justify-end">
                      <Button onClick={() => {
                        setIsBulkModalVisible(false);
                        bulkForm.resetFields();
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        loading={assignSetMutation?.isPending || false}
                      >
                        Assign Set
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Modal>

      {/* Copy Permissions Modal */}
      <Modal
        title="Copy Permissions from User"
        open={isCopyModalVisible}
        onCancel={() => {
          setIsCopyModalVisible(false);
          copyForm.resetFields();
        }}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form
          form={copyForm}
          layout="vertical"
          onFinish={handleCopyPermissionsSubmit}
        >
          <Form.Item
            name="sourceUserId"
            label="Source User"
            rules={[{ required: true, message: 'Please select source user' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="sourceUserName"
            label="Source User Name"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="targetUserIds"
            label="Target Users"
            rules={[{ required: true, message: 'Please select target users' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select target users"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {usersWithPermissions?.map(user => (
                <Option key={user.user?.id} value={user.user?.id}>
                  {user.user?.username} ({user.user?.school})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="includeExpiration"
            valuePropName="checked"
          >
            <Checkbox>Include expiration dates from source user</Checkbox>
          </Form.Item>

          <Form.Item
            name="reason"
            label="Reason for Copying Permissions"
            rules={[{ required: true, message: 'Please provide a reason for copying these permissions' }]}
          >
            <Input.TextArea 
              placeholder="e.g., Copying permissions from experienced user, Onboarding new staff, etc."
              rows={3}
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setIsCopyModalVisible(false);
                copyForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={copyPermissionsMutation.isPending}
              >
                Copy Permissions
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

export default SystemAdminDashboard;