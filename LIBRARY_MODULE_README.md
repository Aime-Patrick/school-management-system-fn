# 📚 Library Management Module

A comprehensive library management system built with React, TypeScript, and modern web technologies. This module provides complete functionality for managing books, members, borrowing, reservations, fines, and comprehensive reporting.

## 🚀 Features

### 📖 Books Management
- **CRUD Operations**: Create, read, update, and delete books
- **Advanced Search**: Search by title, author, ISBN, category, or status
- **Filtering**: Filter by category, status, and availability
- **Inventory Tracking**: Track total copies and available copies
- **Book Details**: Comprehensive book information including publication year, publisher, location

### 👥 Members Management
- **Member Profiles**: Complete member information with roles and limits
- **Role-Based Access**: Support for students, teachers, staff, and administrators
- **Borrow Limits**: Configurable maximum borrow limits per member
- **Status Tracking**: Active, suspended, and inactive member statuses

### 🔄 Borrowing System
- **Book Issuance**: Issue books to members with due dates
- **Return Processing**: Handle book returns with condition assessment
- **Due Date Extension**: Extend due dates when needed
- **Overdue Tracking**: Automatic overdue detection and fine calculation
- **Transaction History**: Complete borrowing transaction records

### 📅 Reservations
- **Book Reservations**: Reserve books for future borrowing
- **Reservation Management**: Fulfill, cancel, or expire reservations
- **Expiry Tracking**: Automatic reservation expiry handling
- **Member Notifications**: Track reservation status changes

### 💰 Fines Management
- **Automatic Calculation**: Calculate fines based on overdue days
- **Payment Processing**: Multiple payment methods (cash, card, bank transfer, online)
- **Fine Waiving**: Administrative ability to waive fines
- **Payment History**: Complete payment and waiver records

### 📊 Comprehensive Reporting
- **Overdue Reports**: Track overdue books and calculate fines
- **Most Borrowed Books**: Identify popular books and trends
- **Lost/Damaged Books**: Track book losses and damage
- **Category Trends**: Analyze borrowing patterns by category
- **Member Activity**: Monitor member borrowing behavior
- **Fine Collection**: Track fine collection rates and outstanding amounts

## 🛠️ Technical Stack

### Frontend Technologies
- **React 18** with TypeScript for type safety
- **@tanstack/react-query** for server state management
- **PrimeReact DataTable** for data display and manipulation
- **Ant Design** for UI components and forms
- **Tailwind CSS** for responsive styling
- **Formik + Yup** for form handling and validation

### Key Libraries
- **dayjs** for date manipulation
- **axios** for HTTP requests
- **react-hot-toast** for notifications

## 📁 Project Structure

```
src/
├── components/library/          # Reusable form components
│   ├── BookForm.tsx            # Book creation/editing form
│   ├── MemberForm.tsx          # Member creation/editing form
│   ├── BorrowForm.tsx          # Book borrowing form
│   └── index.ts                # Component exports
├── pages/library/              # Main page components
│   ├── BooksPage.tsx           # Books management page
│   ├── MembersPage.tsx         # Members management page
│   ├── BorrowPage.tsx          # Borrowing management page
│   ├── ReservationsPage.tsx    # Reservations management page
│   ├── FinesPage.tsx           # Fines management page
│   ├── ReportsPage.tsx         # Reports and analytics page
│   └── index.ts                # Page exports
├── hooks/library/               # React Query hooks
│   ├── useBooks.ts             # Books data hooks
│   ├── useMembers.ts           # Members data hooks
│   ├── useBorrow.ts            # Borrowing data hooks
│   ├── useReservations.ts      # Reservations data hooks
│   ├── useFines.ts             # Fines data hooks
│   ├── useReports.ts           # Reports data hooks
│   └── index.ts                # Hook exports
└── services/api/library/        # API service layer
    ├── books.api.ts            # Books API endpoints
    ├── members.api.ts          # Members API endpoints
    ├── borrow.api.ts           # Borrowing API endpoints
    ├── reservations.api.ts     # Reservations API endpoints
    ├── fines.api.ts            # Fines API endpoints
    ├── reports.api.ts          # Reports API endpoints
    └── index.ts                # API exports
```

## 🔌 API Integration

### Backend Requirements
The module expects a NestJS backend with the following endpoints:

#### Books API
- `GET /library/books` - Get all books
- `GET /library/books/:id` - Get book by ID
- `POST /library/books` - Create new book
- `PUT /library/books/:id` - Update book
- `DELETE /library/books/:id` - Delete book
- `GET /library/books/search?q=query` - Search books

#### Members API
- `GET /library/members` - Get all members
- `GET /library/members/:id` - Get member by ID
- `POST /library/members` - Create new member
- `PUT /library/members/:id` - Update member
- `DELETE /library/members/:id` - Delete member
- `GET /library/members/search?q=query` - Search members

#### Borrowing API
- `GET /library/borrow` - Get all borrow transactions
- `GET /library/borrow/active` - Get active borrows
- `GET /library/borrow/overdue` - Get overdue borrows
- `POST /library/borrow` - Create borrow transaction
- `PUT /library/borrow/:id/return` - Return book
- `PUT /library/borrow/:id/extend` - Extend due date

#### Reservations API
- `GET /library/reservations` - Get all reservations
- `GET /library/reservations/pending` - Get pending reservations
- `POST /library/reservations` - Create reservation
- `PUT /library/reservations/:id/fulfill` - Fulfill reservation
- `PUT /library/reservations/:id/cancel` - Cancel reservation

#### Fines API
- `GET /library/fines` - Get all fines
- `GET /library/fines/unpaid` - Get unpaid fines
- `POST /library/fines` - Create fine
- `PUT /library/fines/:id/pay` - Pay fine
- `PUT /library/fines/:id/waive` - Waive fine

#### Reports API
- `GET /library/reports/overdue` - Get overdue report
- `GET /library/reports/most-borrowed` - Get most borrowed report
- `GET /library/reports/lost-damaged` - Get lost/damaged report
- `GET /library/reports/category-trends` - Get category trends
- `GET /library/reports/member-activity` - Get member activity
- `GET /library/reports/fine-collection` - Get fine collection report

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Full-featured desktop interface

### Data Tables
- **Sorting**: Multi-column sorting
- **Filtering**: Advanced filtering capabilities
- **Pagination**: Configurable page sizes
- **Search**: Global and column-specific search
- **Responsive Layout**: Stack layout for mobile devices

### Forms and Modals
- **Validation**: Comprehensive form validation with Yup
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Success Notifications**: Toast notifications for successful operations

### Visual Elements
- **Status Tags**: Color-coded status indicators
- **Icons**: Intuitive iconography
- **Color Scheme**: Consistent color palette
- **Typography**: Readable and accessible text

## 🔐 Security & Validation

### Form Validation
- **Required Fields**: Essential field validation
- **Format Validation**: Email, ISBN, phone number formats
- **Range Validation**: Numeric value constraints
- **Custom Validation**: Business logic validation

### Data Sanitization
- **Input Cleaning**: Remove malicious content
- **Type Safety**: TypeScript for compile-time safety
- **API Validation**: Backend validation support

## 📱 Responsiveness

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm - lg)
- **Desktop**: > 1024px (lg+)

### Responsive Features
- **Grid Layouts**: Adaptive grid systems
- **Flexible Tables**: Stack layout for mobile
- **Touch-Friendly**: Mobile-optimized interactions
- **Readable Text**: Appropriate font sizes for all devices

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- React 18+
- TypeScript 4.5+

### Installation
1. Ensure all dependencies are installed:
```bash
npm install @tanstack/react-query primereact antd formik yup dayjs axios react-hot-toast
```

2. Import the library module in your app:
```typescript
import { BooksPage, MembersPage, BorrowPage } from './pages/library';
```

3. Add the library routes to your router:
```typescript
<Route path="/library/books" element={<BooksPage />} />
<Route path="/library/members" element={<MembersPage />} />
<Route path="/library/borrow" element={<BorrowPage />} />
```

### Configuration
1. Ensure your axios instance is configured with the correct base URL
2. Set up React Query provider in your app
3. Configure toast notifications

## 🧪 Testing

### Component Testing
- Test form validation
- Test API integration
- Test responsive behavior
- Test user interactions

### Integration Testing
- Test complete workflows
- Test error handling
- Test data persistence

## 🔧 Customization

### Styling
- Modify Tailwind CSS classes
- Update color schemes
- Adjust spacing and typography

### Functionality
- Add new fields to forms
- Implement additional validation rules
- Extend API endpoints

### Localization
- Replace hardcoded strings
- Implement i18n support
- Add language switching

## 📈 Performance

### Optimization Features
- **React Query**: Efficient data caching and synchronization
- **Lazy Loading**: Component lazy loading support
- **Memoization**: Optimized re-renders
- **Bundle Splitting**: Code splitting for better performance

### Best Practices
- **Debounced Search**: Optimized search performance
- **Pagination**: Efficient data loading
- **Caching**: Smart data caching strategies
- **Error Boundaries**: Graceful error handling

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript compilation
2. **API Errors**: Verify backend endpoints
3. **Styling Issues**: Check Tailwind CSS configuration
4. **Responsiveness**: Test on different screen sizes

### Debug Tips
- Use React DevTools for component inspection
- Check browser console for errors
- Verify API responses
- Test responsive breakpoints

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design principles
- Use consistent naming conventions
- Add comprehensive error handling

### Code Quality
- Write clean, readable code
- Add appropriate comments
- Follow component composition patterns
- Implement proper error boundaries

## 📄 License

This module is part of the School Management System and follows the same licensing terms.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code examples
- Test with the provided sample data
- Contact the development team

---

**Built with ❤️ for modern education management**
