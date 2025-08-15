import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tabs, Card, Row, Col, Statistic, Spin, Button, DatePicker, Select } from 'antd';
import { 
  DollarOutlined, 
  BookOutlined, 
  UserOutlined, 
  ExclamationCircleOutlined,
  DownloadOutlined 
} from '@ant-design/icons';
import { 
  useOverdueReport, 
  useMostBorrowedReport, 
  useLostDamagedReport, 
  useCategoryTrendsReport,
  useMemberActivityReport,
  useFineCollectionReport 
} from '../../hooks/library/useReports';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ]);
  const [period, setPeriod] = useState('monthly');

  const { data: overdueReport, isLoading: overdueLoading } = useOverdueReport();
  const { data: mostBorrowedReport, isLoading: mostBorrowedLoading } = useMostBorrowedReport(10);
  const { data: lostDamagedReport, isLoading: lostDamagedLoading } = useLostDamagedReport();
  const { data: categoryTrendsReport, isLoading: categoryTrendsLoading } = useCategoryTrendsReport();
  const { data: memberActivityReport, isLoading: memberActivityLoading } = useMemberActivityReport();
  const { data: fineCollectionReport, isLoading: fineCollectionLoading } = useFineCollectionReport(
    dateRange[0]?.toISOString(),
    dateRange[1]?.toISOString()
  );

  const isLoading = overdueLoading || mostBorrowedLoading || lostDamagedLoading || 
                   categoryTrendsLoading || memberActivityLoading || fineCollectionLoading;

  // Body templates for DataTable
  const amountBodyTemplate = (rowData) => (
    <div className="text-right font-medium">
      ${(rowData.amount || 0).toFixed(2)}
    </div>
  );

  const percentageBodyTemplate = (rowData) => (
    <div className="text-right">
      {(rowData.percentage || 0).toFixed(1)}%
    </div>
  );

  const dateBodyTemplate = (rowData) => (
    <div className="text-sm">
      {dayjs(rowData.date || rowData.lastActivity).format('MMM DD, YYYY')}
    </div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 library-page-header">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Library Reports</h1>
          <p className="text-sm sm:text-base text-gray-600">Comprehensive library analytics and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            size="large"
            className="w-full sm:w-auto"
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {(overdueReport?.totalOverdue || 0) + (lostDamagedReport?.totalLost || 0)}
          </div>
          <div className="text-gray-600">Total Issues</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {fineCollectionReport?.totalCollected || 0}
          </div>
          <div className="text-gray-600">Fines Collected</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">
            {mostBorrowedReport?.totalBorrows || 0}
          </div>
          <div className="text-gray-600">Total Borrows</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">
            {memberActivityReport?.totalMembers || 0}
          </div>
          <div className="text-gray-600">Active Members</div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 library-filters">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-gray-700 font-medium whitespace-nowrap">Date Range:</span>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates)}
              format="YYYY-MM-DD"
              className="w-full sm:w-auto"
            />
          </div>
          <Select
            value={period}
            onChange={setPeriod}
            placeholder="Select Period"
            className="w-full sm:w-auto"
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
          </Select>
          <div className="flex justify-end">
            <Button 
              type="default" 
              icon={<DownloadOutlined />} 
              size="large"
              className="w-full sm:w-auto"
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Reports Tabs */}
      <div className="bg-white rounded-lg shadow">
        <Tabs defaultActiveKey="overdue" className="p-4">
          <TabPane tab="Overdue Report" key="overdue">
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Total Overdue"
                      value={overdueReport?.totalOverdue || 0}
                      prefix={<ExclamationCircleOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Total Fine Amount"
                      value={overdueReport?.totalFineAmount || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Average Days Overdue"
                      value={overdueReport?.averageDaysOverdue || 0}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
            
            <DataTable
              value={overdueReport?.data || []}
              responsiveLayout="stack"
              className="library-datatable"
              scrollable
              scrollHeight="400px"
              showGridlines
              stripedRows
            >
              <Column field="bookTitle" header="Book Title" sortable style={{ minWidth: '200px' }} />
              <Column field="memberName" header="Member" sortable style={{ minWidth: '150px' }} />
              <Column field="dueDate" header="Due Date" body={dateBodyTemplate} sortable style={{ minWidth: '120px' }} />
              <Column field="daysOverdue" header="Days Overdue" sortable style={{ minWidth: '120px' }} />
              <Column field="fineAmount" header="Fine Amount" body={amountBodyTemplate} sortable style={{ minWidth: '120px' }} />
            </DataTable>
          </TabPane>

          <TabPane tab="Most Borrowed" key="most-borrowed">
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card>
                    <Statistic
                      title="Total Borrows"
                      value={mostBorrowedReport?.totalBorrows || 0}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card>
                    <Statistic
                      title="Unique Members"
                      value={mostBorrowedReport?.uniqueMembers || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
            
            <DataTable
              value={mostBorrowedReport?.data || []}
              responsiveLayout="stack"
              className="library-datatable"
              scrollable
              scrollHeight="400px"
              showGridlines
              stripedRows
            >
              <Column field="bookTitle" header="Book Title" sortable style={{ minWidth: '200px' }} />
              <Column field="bookIsbn" header="ISBN" sortable style={{ minWidth: '120px' }} />
              <Column field="borrowCount" header="Borrow Count" sortable style={{ minWidth: '120px' }} />
              <Column field="lastBorrowed" header="Last Borrowed" body={dateBodyTemplate} sortable style={{ minWidth: '140px' }} />
            </DataTable>
          </TabPane>

          <TabPane tab="Lost/Damaged" key="lost-damaged">
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Lost"
                      value={lostDamagedReport?.totalLost || 0}
                      prefix={<ExclamationCircleOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Damaged"
                      value={lostDamagedReport?.totalDamaged || 0}
                      prefix={<ExclamationCircleOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Value"
                      value={lostDamagedReport?.totalValue || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Fines"
                      value={lostDamagedReport?.data?.reduce((sum, item) => sum + (item.fineAmount || 0), 0) || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
            
            <DataTable
              value={lostDamagedReport?.data || []}
              responsiveLayout="stack"
              className="library-datatable"
              scrollable
              scrollHeight="400px"
              showGridlines
              stripedRows
            >
              <Column field="bookTitle" header="Book Title" sortable style={{ minWidth: '200px' }} />
              <Column field="memberName" header="Member" sortable style={{ minWidth: '150px' }} />
              <Column field="status" header="Status" sortable style={{ minWidth: '100px' }} />
              <Column field="fineAmount" header="Fine Amount" body={amountBodyTemplate} sortable style={{ minWidth: '120px' }} />
              <Column field="date" header="Date" body={dateBodyTemplate} sortable style={{ minWidth: '120px' }} />
            </DataTable>
          </TabPane>

          <TabPane tab="Category Trends" key="category-trends">
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Total Books"
                      value={categoryTrendsReport?.totalBooks || 0}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Total Borrows"
                      value={categoryTrendsReport?.totalBorrows || 0}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={8}>
                  <Card>
                    <Statistic
                      title="Avg Borrows/Book"
                      value={categoryTrendsReport?.totalBooks ? 
                        (categoryTrendsReport.totalBorrows / categoryTrendsReport.totalBooks).toFixed(1) : 0}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
            
            <DataTable
              value={categoryTrendsReport?.data || []}
              responsiveLayout="stack"
              className="library-datatable"
              scrollable
              scrollHeight="400px"
              showGridlines
              stripedRows
            >
              <Column field="category" header="Category" sortable style={{ minWidth: '150px' }} />
              <Column field="bookCount" header="Book Count" sortable style={{ minWidth: '120px' }} />
              <Column field="borrowCount" header="Borrow Count" sortable style={{ minWidth: '120px' }} />
              <Column field="averageBorrows" header="Avg Borrows" sortable style={{ minWidth: '120px' }} />
            </DataTable>
          </TabPane>

          <TabPane tab="Member Activity" key="member-activity">
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Members"
                      value={memberActivityReport?.totalMembers || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Active Members"
                      value={memberActivityReport?.activeMembers || 0}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Borrows"
                      value={memberActivityReport?.data?.reduce((sum, item) => sum + (item.totalBorrows || 0), 0) || 0}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Fines"
                      value={memberActivityReport?.data?.reduce((sum, item) => sum + (item.totalFines || 0), 0) || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
            
            <DataTable
              value={memberActivityReport?.data || []}
              responsiveLayout="stack"
              className="library-datatable"
              scrollable
              scrollHeight="400px"
              showGridlines
              stripedRows
            >
              <Column field="memberName" header="Member Name" sortable style={{ minWidth: '150px' }} />
              <Column field="memberRole" header="Role" sortable style={{ minWidth: '100px' }} />
              <Column field="totalBorrows" header="Total Borrows" sortable style={{ minWidth: '120px' }} />
              <Column field="currentBorrows" header="Current Borrows" sortable style={{ minWidth: '120px' }} />
              <Column field="totalFines" header="Total Fines" body={amountBodyTemplate} sortable style={{ minWidth: '120px' }} />
              <Column field="lastActivity" header="Last Activity" body={dateBodyTemplate} sortable style={{ minWidth: '140px' }} />
            </DataTable>
          </TabPane>

          <TabPane tab="Fine Collection" key="fine-collection">
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Fines"
                      value={fineCollectionReport?.totalFines || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Collected"
                      value={fineCollectionReport?.totalCollected || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Total Waived"
                      value={fineCollectionReport?.totalWaived || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={6}>
                  <Card>
                    <Statistic
                      title="Outstanding"
                      value={fineCollectionReport?.outstandingAmount || 0}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
            
            <DataTable
              value={fineCollectionReport?.data || []}
              responsiveLayout="stack"
              className="library-datatable"
              scrollable
              scrollHeight="400px"
              showGridlines
              stripedRows
            >
              <Column field="month" header="Period" sortable style={{ minWidth: '100px' }} />
              <Column field="finesIssued" header="Fines Issued" sortable style={{ minWidth: '120px' }} />
              <Column field="finesCollected" header="Fines Collected" sortable style={{ minWidth: '140px' }} />
              <Column field="finesWaived" header="Fines Waived" sortable style={{ minWidth: '130px' }} />
              <Column field="collectionRate" header="Collection Rate" body={percentageBodyTemplate} sortable style={{ minWidth: '130px' }} />
            </DataTable>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsPage;
