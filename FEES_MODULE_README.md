# Fees Management Module

A comprehensive fee management system for the School Management Portal, built with React, TypeScript, and modern UI libraries.

## 🚀 Features

### 1. Fee Categories Management
- **CRUD Operations**: Create, Read, Update, Delete fee categories
- **Category Properties**: Name, description, frequency, status
- **Frequency Options**: Monthly, Quarterly, Semester, Annually, One Time
- **Status Management**: Active/Inactive categories

### 2. Fee Structures Management
- **Comprehensive Configuration**: Category, class, amount, academic year, term, due date
- **Late Fee Rules**: Grace period, late fee amount, late fee percentage
- **Flexible Assignment**: Multiple classes and terms support
- **Status Control**: Active/Inactive structures

### 3. Fee Assignments
- **Auto-Assignment**: Bulk assign fees to students by class/year/term
- **Student Management**: Individual or bulk student selection
- **Assignment Tracking**: Monitor assigned fees with status updates
- **Filtering & Search**: Advanced filtering by status, class, and student

### 4. Fee Payments
- **Payment Recording**: Record new payments with multiple payment modes
- **Payment Modes**: Cash, Card, Bank Transfer, Check, Online
- **Approval Workflow**: Approve/Reject payments with reason tracking
- **Reference Tracking**: Unique reference numbers for each payment
- **Status Management**: Pending, Approved, Rejected statuses

### 5. Fee Reports & Analytics
- **Outstanding Fees Report**: Color-coded overdue status tracking
- **Payment Summary**: Monthly payment statistics and trends
- **Defaulter List**: Students with overdue payments
- **Export Functionality**: Excel export for all reports
- **Date Range Filtering**: Customizable reporting periods

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: @tanstack/react-query for server state
- **UI Components**: 
  - PrimeReact DataTable for data display
  - Ant Design for forms, modals, and general UI
- **Form Handling**: Formik + Yup validation
- **HTTP Client**: Axios with interceptors
- **Notifications**: react-hot-toast
- **Date Handling**: date-fns
- **Export**: xlsx library for Excel export

## 📁 File Structure

```
src/components/fees/
├── index.js                          # Component exports
├── FeesManagementPage.jsx           # Main dashboard
├── FeeCategoriesPage.jsx            # Categories management
├── FeeStructuresPage.jsx            # Structures management
├── FeeAssignmentsPage.jsx           # Assignments management
├── FeePaymentsPage.jsx              # Payments management
├── FeeReportsPage.jsx               # Reports and analytics
└── modals/
    ├── FeeCategoryModal.jsx         # Category CRUD modal
    ├── FeeStructureModal.jsx        # Structure CRUD modal
    ├── AutoAssignModal.jsx          # Auto-assignment modal
    └── PaymentModal.jsx             # Payment recording modal
```

## 🔌 API Integration

### Endpoints
- `POST /fees/categories` - Create fee category
- `GET /fees/categories` - Get all categories
- `PUT /fees/categories/:id` - Update category
- `DELETE /fees/categories/:id` - Delete category
- `POST /fees/structures` - Create fee structure
- `GET /fees/structures` - Get all structures
- `PUT /fees/structures/:id` - Update structure
- `DELETE /fees/structures/:id` - Delete structure
- `POST /fees/assignments/auto-assign` - Auto-assign fees
- `GET /fees/assignments` - Get all assignments
- `POST /fees/payments` - Record payment
- `GET /fees/payments` - Get all payments
- `PUT /fees/payments/:id/approve` - Approve payment
- `PUT /fees/payments/:id/reject` - Reject payment
- `GET /fees/reports/outstanding` - Outstanding fees report
- `GET /fees/reports/summary` - Payment summary report
- `GET /fees/reports/defaulter` - Defaulter list

### React Query Hooks
- `useFeeCategories()` - Categories data and mutations
- `useFeeStructures()` - Structures data and mutations
- `useFeeAssignments()` - Assignments data and mutations
- `useFeePayments()` - Payments data and mutations
- `useOutstandingFeesReport()` - Outstanding fees data
- `usePaymentSummaryReport()` - Payment summary data
- `useDefaulterList()` - Defaulter list data

## 🔐 Role-Based Access Control

### School Admin & System Admin
- Full access to all fee management features
- Create, edit, delete categories and structures
- Auto-assign fees to students
- Approve/reject payments
- Access all reports

### Accountant
- Manage payments (record, approve, reject)
- View and export reports
- Auto-assign fees to students
- Access fee assignments

### Teacher
- View-only access to reports
- Monitor student fee statuses
- Access fee assignments (read-only)

### Student/Parent
- View own fees and payment history
- Access fee assignments (read-only)

## 🎨 UI/UX Features

### DataTables
- **Sorting**: All columns sortable
- **Pagination**: Configurable page sizes (5, 10, 25, 50)
- **Filtering**: Advanced search and filter options
- **Responsive**: Mobile-friendly layout
- **Export**: Excel export functionality

### Forms
- **Validation**: Comprehensive Yup validation schemas
- **Error Handling**: Clear error messages and validation states
- **Loading States**: Loading indicators during operations
- **Success Feedback**: Toast notifications for successful operations

### Modals
- **Centered Layout**: Professional modal positioning
- **Form Integration**: Seamless Formik integration
- **Responsive Design**: Mobile-optimized modal layouts

## 📊 Reporting Features

### Outstanding Fees Report
- Student name, class, fee category
- Amount and due date
- Color-coded overdue status
- Days overdue calculation

### Payment Summary Report
- Total payments count
- Total amount collected
- Pending vs approved payments
- Monthly trends

### Defaulter List
- Students with outstanding fees
- Total outstanding amounts
- Overdue amounts
- Last payment dates

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# .env
VITE_API_URL=your_backend_api_url
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Fees Module
Navigate to `/school-admin/fees` in your browser

## 🔧 Configuration

### Fee Categories
- Configure fee frequencies (monthly, quarterly, etc.)
- Set category statuses (active/inactive)
- Manage category descriptions

### Fee Structures
- Link categories to classes and academic terms
- Set due dates and amounts
- Configure late fee rules

### Payment Modes
- Cash, Card, Bank Transfer
- Check, Online payments
- Custom payment modes

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Touch Friendly**: Mobile-optimized interactions

## 🧪 Testing

The module is designed to work with live APIs and includes:
- Error handling for API failures
- Loading states for better UX
- Toast notifications for user feedback
- Form validation for data integrity

## 🔄 State Management

- **Server State**: React Query for API data
- **Local State**: React useState for UI state
- **Form State**: Formik for form management
- **Cache Management**: Automatic query invalidation

## 📈 Performance Features

- **Lazy Loading**: Components load on demand
- **Pagination**: Efficient data loading
- **Caching**: React Query caching for performance
- **Optimistic Updates**: Immediate UI feedback

## 🎯 Future Enhancements

- **Bulk Operations**: Mass fee assignments and payments
- **Advanced Analytics**: Charts and graphs for insights
- **Notification System**: Automated reminders for overdue fees
- **Payment Gateway Integration**: Online payment processing
- **Multi-Currency Support**: International fee management
- **Audit Trail**: Complete payment history tracking

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Implement proper error handling
4. Add loading states for better UX
5. Follow the established naming conventions
6. Test with live APIs before committing

## 📄 License

This module is part of the School Management Portal and follows the same licensing terms.

---

For technical support or questions, please refer to the main project documentation or contact the development team.
