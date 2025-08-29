import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button, Card, Row, Col, Statistic, DatePicker, Select, Space, Spin, Tag, Tabs } from 'antd';
import { DownloadOutlined, DollarOutlined, ExclamationCircleOutlined, CheckCircleOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { useOutstandingFeesReport, usePaymentSummaryReport, useDefaulterList } from '../../hooks/useFees';
import { useAuth } from '../../hooks/useAuth';
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from 'xlsx';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const FeeReportsPage = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
  const [selectedReport, setSelectedReport] = useState('outstanding');
  const { authData } = useAuth();
  
  // Get schoolId from auth context (assuming it's available)
  const schoolId = authData?.schoolId || authData?.school?.id;
  
  const { data: outstandingFeesResponse, isLoading: outstandingLoading } = useOutstandingFeesReport(schoolId);
  const { data: paymentSummaryResponse, isLoading: summaryLoading } = usePaymentSummaryReport(
    schoolId,
    dateRange ? [
      dateRange[0]?.toISOString(),
      dateRange[1]?.toISOString()
    ] : undefined
  );
  const { data: defaulterListResponse, isLoading: defaulterLoading } = useDefaulterList(schoolId);
  
  // Handle backend API response structure
  const outstandingFees = outstandingFeesResponse?.data || [];
  const paymentSummary = paymentSummaryResponse || {};
  const defaulterList = defaulterListResponse?.data || [];
  
  // Get summary statistics from backend response
  const totalOutstandingAmount = outstandingFeesResponse?.totalOutstandingAmount || 0;
  const totalDefaulters = defaulterListResponse?.totalDefaulters || 0;

  const handleExport = (data, filename) => {
    const ws = xlsxUtils.json_to_sheet(data);
    const wb = xlsxUtils.book_new();
    xlsxUtils.book_append_sheet(wb, ws, 'Report');
    xlsxWriteFile(wb, `${filename}.xlsx`);
  };

  const exportOutstandingFees = () => {
    const exportData = outstandingFees.map(fee => ({
      'Student Name': fee.studentName || '',
      'Registration Number': fee.registrationNumber || '',
      'Class': fee.className || '',
      'Fee Category': fee.feeCategory || '',
      'Assigned Amount': fee.assignedAmount || 0,
      'Total Paid': fee.totalPaid || 0,
      'Outstanding Amount': fee.outstandingAmount || 0,
      'Due Date': fee.dueDate ? dayjs(fee.dueDate).format('MMM DD, YYYY') : '',
      'Days Overdue': fee.daysOverdue || 0,
    }));
    handleExport(exportData, 'outstanding-fees');
  };

  const exportPaymentSummary = () => {
    const exportData = [
      { 'Metric': 'Total Payments', 'Value': paymentSummary.totalPayments || 0 },
      { 'Metric': 'Total Amount', 'Value': paymentSummary.totalAmount || 0 },
      { 'Metric': 'Pending Payments', 'Value': paymentSummary.pendingPayments || 0 },
      { 'Metric': 'Approved Payments', 'Value': paymentSummary.approvedPayments || 0 },
      { 'Metric': 'Rejected Payments', 'Value': paymentSummary.rejectedPayments || 0 },
    ];
    handleExport(exportData, 'payment-summary');
  };

  const exportDefaulterList = () => {
    const exportData = defaulterList.map(defaulter => ({
      'Student Name': defaulter.studentName || '',
      'Registration Number': defaulter.registrationNumber || '',
      'Phone Number': defaulter.phoneNumber || '',
      'Class': defaulter.className || '',
      'Fee Category': defaulter.feeCategory || '',
      'Assigned Amount': defaulter.assignedAmount || 0,
      'Total Paid': defaulter.totalPaid || 0,
      'Outstanding Amount': defaulter.outstandingAmount || 0,
      'Due Date': defaulter.dueDate ? dayjs(defaulter.dueDate).format('MMM DD, YYYY') : '',
      'Days Overdue': defaulter.daysOverdue || 0,
    }));
    handleExport(exportData, 'defaulter-list');
  };

  const assignedAmountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.assignedAmount || 0);
  };
    const totalPaidBodyTemplate = (rowData) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(rowData.totalPaid || 0);
    };

  const outstandingAmountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.outstandingAmount || 0);
  };

  const dueDateBodyTemplate = (rowData) => {
    if (!rowData.dueDate) return '-';
    return dayjs(rowData.dueDate).format('MMM DD, YYYY');
  };

  const daysOverdueBodyTemplate = (rowData) => {
    const days = rowData.daysOverdue || 0;
    if (days === 0) return <Tag color="green">On Time</Tag>;
    if (days <= 7) return <Tag color="orange">{days} days overdue</Tag>;
    return <Tag color="red">{days} days overdue</Tag>;
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status;
    let color = 'default';
    
    switch (status) {
      case 'paid':
        color = 'green';
        break;
      case 'overdue':
        color = 'red';
        break;
      case 'pending':
        color = 'orange';
        break;
      default:
        color = 'default';
    }
    
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const totalOutstandingBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.totalOutstanding || 0);
  };

  const overdueAmountBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(rowData.overdueAmount || 0);
  };

  const lastPaymentDateBodyTemplate = (rowData) => {
    if (!rowData.lastPaymentDate) return 'No payments';
    return dayjs(rowData.lastPaymentDate).format('MMM DD, YYYY');
  };

  if (outstandingLoading || summaryLoading || defaulterLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 fees-page-header">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Fee Reports</h1>
        <p className="text-sm sm:text-base text-gray-600">Comprehensive fee management reports and analytics</p>
      </div>

      {/* Summary Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Total Outstanding Fees"
              value={totalOutstandingAmount}
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
              title="Overdue Fees"
              value={outstandingFees.filter(fee => (fee.daysOverdue || 0) > 0).length}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Total Defaulters"
              value={totalDefaulters}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full">
            <Statistic
              title="Total Students"
              value={outstandingFeesResponse?.totalStudents || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 fees-filters">
          <span className="text-gray-700 font-medium">Date Range:</span>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Reports Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultActiveKey="outstanding" onChange={setSelectedReport}>
          <TabPane tab="Outstanding Fees" key="outstanding" className="p-4 px-4">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Outstanding Fees Report</h3>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportOutstandingFees}
                  size="large"
                  className="w-full sm:w-auto"
                >
                  Export
                </Button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <DataTable
                  value={outstandingFees || []}
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
                  <Column field="studentName" header="Student Name" sortable style={{ minWidth: '140px' }} />
                  <Column field="registrationNumber" header="Reg. Number" sortable style={{ minWidth: '120px' }} />
                  <Column field="className" header="Class" sortable style={{ minWidth: '100px' }} />
                  <Column field="feeCategory" header="Fee Category" sortable style={{ minWidth: '120px' }} />
                  <Column field="assignedAmount" header="Assigned Amount" body={assignedAmountBodyTemplate} sortable style={{ minWidth: '120px' }} />
                  <Column field="totalPaid" header="Total Paid" body={totalPaidBodyTemplate} sortable style={{ minWidth: '100px' }} />
                  <Column field="outstandingAmount" header="Outstanding" body={outstandingAmountBodyTemplate} sortable style={{ minWidth: '100px' }} />
                  <Column field="dueDate" header="Due Date" body={dueDateBodyTemplate} sortable style={{ minWidth: '100px' }} />
                  <Column field="daysOverdue" header="Overdue" body={daysOverdueBodyTemplate} sortable style={{ minWidth: '100px' }} />
                </DataTable>
              </div>
            </div>
          </TabPane>

          <TabPane tab="Payment Summary" key="summary" className="p-4 px-4">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Payment Summary Report</h3>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportPaymentSummary}
                  size="large"
                  className="w-full sm:w-auto"
                >
                  Export
                </Button>
              </div>
              <Row gutter={16}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Payments"
                      value={paymentSummary.totalPayments || 0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Amount"
                      value={paymentSummary.totalAmount || 0}
                      prefix="$"
                      valueStyle={{ color: '#52c41a' }}
                      formatter={(value) => new Intl.NumberFormat('en-US').format(value)}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Pending Payments"
                      value={paymentSummary.pendingPayments || 0}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Approved Payments"
                      value={paymentSummary.approvedPayments || 0}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>

          <TabPane tab="Defaulter List" key="defaulter" className="p-4 px-4">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Defaulter List</h3>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportDefaulterList}
                  size="large"
                  className="w-full sm:w-auto"
                >
                  Export
                </Button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <DataTable
                  value={defaulterList || []}
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
                  <Column field="studentName" header="Student Name" sortable style={{ minWidth: '140px' }} />
                  <Column field="registrationNumber" header="Reg. Number" sortable style={{ minWidth: '120px' }} />
                  <Column field="phoneNumber" header="Phone" sortable style={{ minWidth: '120px' }} />
                  <Column field="className" header="Class" sortable style={{ minWidth: '100px' }} />
                  <Column field="feeCategory" header="Fee Category" sortable style={{ minWidth: '120px' }} />
                  <Column field="assignedAmount" header="Assigned Amount" body={assignedAmountBodyTemplate} sortable style={{ minWidth: '120px' }} />
                  <Column field="totalPaid" header="Total Paid" body={totalPaidBodyTemplate} sortable style={{ minWidth: '100px' }} />
                  <Column field="outstandingAmount" header="Outstanding" body={outstandingAmountBodyTemplate} sortable style={{ minWidth: '100px' }} />
                  <Column field="dueDate" header="Due Date" body={dueDateBodyTemplate} sortable style={{ minWidth: '100px' }} />
                  <Column field="daysOverdue" header="Days Overdue" sortable style={{ minWidth: '100px' }} />
                </DataTable>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default FeeReportsPage;
