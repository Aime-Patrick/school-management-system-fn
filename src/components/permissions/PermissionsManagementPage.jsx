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
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  LockOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPermissions, 
  getFormattedPermissions, 
  getMyPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  seedDefaultPermissions
} from '../../services/api/permissionsApi';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;
const { Option } = Select;

const PermissionsManagementPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedResource, setSelectedResource] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { authData } = useAuth();
  const queryClient = useQueryClient();

  // Fetch permissions data
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  const { data: formattedPermissions, isLoading: formattedLoading } = useQuery({
    queryKey: ['formatted-permissions'],
    queryFn: getFormattedPermissions,
  });

  const { data: myPermissions, isLoading: myPermissionsLoading } = useQuery({
    queryKey: ['my-permissions'],
    queryFn: getMyPermissions,
  });

  // Debug: Log myPermissions data structure
  console.log('myPermissions data:', myPermissions);

  // Mutations
  const createMutation = useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      message.success('Permission created successfully');
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error('Failed to create permission');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePermission(id, data),
    onSuccess: () => {
      message.success('Permission updated successfully');
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
      setIsModalVisible(false);
      setEditingPermission(null);
      form.resetFields();
    },
    onError: (error) => {
      message.error('Failed to update permission');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      message.success('Permission deleted successfully');
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
    },
    onError: (error) => {
      message.error('Failed to delete permission');
    },
  });

  const seedMutation = useMutation({
    mutationFn: seedDefaultPermissions,
    onSuccess: () => {
      message.success('Default permissions seeded successfully');
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
    },
    onError: (error) => {
      message.error('Failed to seed default permissions');
    },
  });

  // Available resources and actions
  const resources = [
    'FEE_CATEGORIES', 'FEE_STRUCTURES', 'STUDENTS', 'TEACHERS', 
    'CLASSES', 'COURSES', 'ACADEMIC', 'LIBRARY', 'SYSTEM'
  ];

  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'VIEW'];

  const roles = ['system-admin', 'school-admin', 'teacher', 'student', 'librarian'];

  // Filter permissions based on selected filters
  const filteredPermissions = permissions?.filter(permission => {
    const matchesRole = selectedRole === 'all' || permission.roles?.includes(selectedRole);
    const matchesResource = selectedResource === 'all' || permission.resource === selectedResource;
    const matchesSearch = !searchText || 
      permission.resource?.toLowerCase().includes(searchText.toLowerCase()) ||
      permission.action?.toLowerCase().includes(searchText.toLowerCase()) ||
      (Array.isArray(permission.roles) && permission.roles.some(role => role.toLowerCase().includes(searchText.toLowerCase())));
    
    return matchesRole && matchesResource && matchesSearch;
  }) || [];

  // Table columns for main permissions table
  const columns = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource) => (
        <Tag color="blue" icon={<DatabaseOutlined />}>
          {resource}
        </Tag>
      ),
      sorter: (a, b) => a.resource.localeCompare(b.resource),
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
      sorter: (a, b) => a.action.localeCompare(b.action),
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space wrap>
          {Array.isArray(roles) ? roles.map(role => (
            <Tag key={role} color="geekblue">
              {role}
            </Tag>
          )) : null}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge 
          status={isActive ? 'success' : 'error'} 
          text={isActive ? 'Active' : 'Inactive'} 
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Permission">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this permission?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Permission">
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

  // Simplified columns for My Permissions table (without actions and with safer renders)
  const myPermissionsColumns = [
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource) => resource ? (
        <Tag color="blue" icon={<DatabaseOutlined />}>
          {resource}
        </Tag>
      ) : '-',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => {
        if (!action) return '-';
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
        <Space wrap>
          {Array.isArray(roles) ? roles.map(role => (
            <Tag key={role} color="geekblue">
              {role}
            </Tag>
          )) : <Text type="secondary">No roles</Text>}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Badge 
          status={isActive ? 'success' : 'error'} 
          text={isActive ? 'Active' : 'Inactive'} 
        />
      ),
    },
  ];

  // Handlers
  const handleCreate = () => {
    setEditingPermission(null);
    setIsModalVisible(true);
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    form.setFieldsValue({
      resource: permission.resource,
      action: permission.action,
      roles: permission.roles,
      isActive: permission.isActive,
      conditions: permission.conditions,
    });
    setIsModalVisible(true);
  };

  const handleView = (permission) => {
    Modal.info({
      title: 'Permission Details',
      width: 600,
      content: (
        <div>
          <p><strong>Resource:</strong> {permission.resource}</p>
          <p><strong>Action:</strong> {permission.action}</p>
          <p><strong>Roles:</strong> {Array.isArray(permission.roles) ? permission.roles.join(', ') : 'No roles assigned'}</p>
          <p><strong>Status:</strong> {permission.isActive ? 'Active' : 'Inactive'}</p>
          <p><strong>Created:</strong> {new Date(permission.createdAt).toLocaleDateString()}</p>
          <p><strong>Updated:</strong> {new Date(permission.updatedAt).toLocaleDateString()}</p>
        </div>
      ),
    });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleModalSubmit = (values) => {
    if (editingPermission) {
      updateMutation.mutate({ id: editingPermission._id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingPermission(null);
    form.resetFields();
  };

  const handleSeedDefaults = () => {
    Modal.confirm({
      title: 'Seed Default Permissions',
      content: 'This will create default permissions for all resources. Are you sure?',
      onOk: () => seedMutation.mutate(),
    });
  };

  // Statistics
  const stats = {
    total: permissions?.length || 0,
    active: permissions?.filter(p => p.isActive).length || 0,
    inactive: permissions?.filter(p => !p.isActive).length || 0,
    resources: new Set(permissions?.map(p => p.resource)).size || 0,
  };

  if (permissionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
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
                <LockOutlined className="mr-2" />
                Permissions Management
              </Title>
              <Text type="secondary">
                Manage role-based access control and permissions across the system
              </Text>
            </div>
            <Space>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => queryClient.invalidateQueries(['permissions'])}
              >
                Refresh
              </Button>
              <Button 
                icon={<DatabaseOutlined />} 
                onClick={handleSeedDefaults}
                loading={seedMutation.isPending}
              >
                Seed Defaults
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreate}
              >
                Add Permission
              </Button>
            </Space>
          </div>

          {/* Statistics Cards */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Permissions"
                  value={stats.total}
                  prefix={<LockOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Permissions"
                  value={stats.active}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Inactive Permissions"
                  value={stats.inactive}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Resources"
                  value={stats.resources}
                  prefix={<DatabaseOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Main Content */}
        <Tabs 
          defaultActiveKey="all" 
          className="bg-white rounded-lg shadow py-4 px-6"
          items={[
            {
              key: 'all',
              label: 'All Permissions',
              children: (
                <div className="p-6">
                  {/* Filters */}
                  <div className="mb-4 flex flex-wrap gap-4 items-center">
                    <Input
                      placeholder="Search permissions..."
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
                      {roles.map(role => (
                        <Option key={role} value={role}>{role}</Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="Filter by Resource"
                      value={selectedResource}
                      onChange={setSelectedResource}
                      style={{ width: 180 }}
                    >
                      <Option value="all">All Resources</Option>
                      {resources.map(resource => (
                        <Option key={resource} value={resource}>{resource}</Option>
                      ))}
                    </Select>
                    <Button 
                      icon={<FilterOutlined />}
                      onClick={() => {
                        setSelectedRole('all');
                        setSelectedResource('all');
                        setSearchText('');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>

                  {/* Permissions Table */}
                  <Table
                    columns={columns}
                    dataSource={filteredPermissions}
                    rowKey="_id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => 
                        `${range[0]}-${range[1]} of ${total} permissions`,
                    }}
                    loading={permissionsLoading}
                    scroll={{ x: 1200 }}
                  />
                </div>
              ),
            },
            {
              key: 'my',
              label: 'My Permissions',
              children: (
                <div className="p-6">
                  {myPermissionsLoading ? (
                    <Spin size="large" />
                  ) : (
                    <div>
                      <Alert
                        message="Your Current Permissions"
                        description={`Showing permissions for role: ${authData?.role}`}
                        type="info"
                        showIcon
                        className="mb-4"
                      />
                      <Table
                        columns={myPermissionsColumns}
                        dataSource={Array.isArray(myPermissions) ? myPermissions : []}
                        rowKey="_id"
                        pagination={false}
                      />
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'formatted',
              label: 'Formatted View',
              children: (
                <div className="p-6">
                  {formattedLoading ? (
                    <Spin size="large" />
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(formattedPermissions || {}).map(([resource, actions]) => (
                        <Card key={resource} title={resource} className="mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(actions).map(([action, roles]) => (
                              <div key={action} className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <Tag color="blue">{action}</Tag>
                                  <Text type="secondary">{roles.length} roles</Text>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {Array.isArray(roles) ? roles.map(role => (
                                    <Tag key={role} size="small">{role}</Tag>
                                  )) : null}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Permission Modal */}
      <Modal
        title={editingPermission ? 'Edit Permission' : 'Add Permission'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          initialValues={{
            isActive: true,
            roles: [],
          }}
        >
          <Form.Item
            name="resource"
            label="Resource"
            rules={[{ required: true, message: 'Please select a resource' }]}
          >
            <Select placeholder="Select resource">
              {resources.map(resource => (
                <Option key={resource} value={resource}>{resource}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="action"
            label="Action"
            rules={[{ required: true, message: 'Please select an action' }]}
          >
            <Select placeholder="Select action">
              {actions.map(action => (
                <Option key={action} value={action}>{action}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="roles"
            label="Roles"
            rules={[{ required: true, message: 'Please select at least one role' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select roles"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {roles.map(role => (
                <Option key={role} value={role}>{role}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={handleModalCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingPermission ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionsManagementPage;
