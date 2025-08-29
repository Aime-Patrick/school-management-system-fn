import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, Space, Row, Col, Upload, message, Divider } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { UploadOutlined, UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, BookOutlined, TrophyOutlined, ClockCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  address: Yup.string()
    .required('Address is required')
    .max(200, 'Address must not exceed 200 characters'),
  city: Yup.string()
    .required('City is required')
    .max(100, 'City name too long'),
  hiredDate: Yup.date()
    .required('Hired date is required')
    .max(new Date(), 'Hired date cannot be in the future'),
  status: Yup.string()
    .required('Status is required'),
  department: Yup.string()
    .required('Department is required')
    .max(100, 'Department name too long'),
  gender: Yup.string()
    .required('Gender is required'),
  employmentType: Yup.string()
    .required('Employment type is required'),
  qualifications: Yup.string()
    .required('Qualifications are required')
    .max(1000, 'Qualifications must not exceed 1000 characters'),
  experience: Yup.string()
    .required('Experience is required')
    .max(1000, 'Experience must not exceed 1000 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  specialization: Yup.string()
    .max(200, 'Specialization must not exceed 200 characters'),
  // Emergency contact validation
  emergencyContactName: Yup.string()
    .max(100, 'Emergency contact name too long'),
  emergencyContactRelationship: Yup.string()
    .max(100, 'Relationship too long'),
  emergencyContactPhone: Yup.string()
    .matches(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  // Accountant-specific fields
  softwareProficiency: Yup.string()
    .max(500, 'Software proficiency must not exceed 500 characters'),
  taxId: Yup.string()
    .max(50, 'Tax ID too long'),
  bankName: Yup.string()
    .max(100, 'Bank name too long'),
  accountNumber: Yup.string()
    .max(50, 'Account number too long'),
  routingNumber: Yup.string()
    .max(20, 'Routing number too long'),
});

const StaffFormModal = ({
  visible,
  onCancel,
  onSubmit,
  role,
  loading = false,
}) => {
  const [fileList, setFileList] = useState([]);

  const initialValues = {
    firstName: '',
    lastName: '',
    dateOfBirth: dayjs().subtract(25, 'year'), // Default to 25 years ago
    address: '',
    city: '',
    hiredDate: dayjs(),
    status: 'active',
    department: '',
    gender: '',
    employmentType: 'Full-time',
    qualifications: '',
    experience: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    startTime: null,
    endTime: null,
    // Emergency contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    // Accountant-specific
    softwareProficiency: '',
    taxId: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
  };

  const handleSubmit = (values) => {
    // Debug: Log the incoming values
    console.log('Incoming values to handleSubmit:', values);
    console.log('Software Proficiency value:', values.softwareProficiency);
    
    // Prepare the payload according to the new DTO structure
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      hiredDate: values.hiredDate.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      // Format working hours from time pickers
      workingHours: values.startTime && values.endTime ? 
        `${values.startTime.format('HH:mm')} - ${values.endTime.format('HH:mm')}` : '',
      // Format emergency contact if provided
      emergencyContact: values.emergencyContactName ? {
        name: values.emergencyContactName,
        relationship: values.emergencyContactRelationship,
        phoneNumber: values.emergencyContactPhone,
      } : undefined,
      // Format bank account info if provided (for accountants)
      bankAccountInfo: values.bankName ? {
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        routingNumber: values.routingNumber,
      } : undefined,
      // Format arrays
      certifications: values.qualifications ? [values.qualifications] : [],
      softwareProficiency: values.softwareProficiency ? values.softwareProficiency.split(',').map(s => s.trim()) : [],
    };

    // Remove the individual fields that are now nested
    delete payload.emergencyContactName;
    delete payload.emergencyContactRelationship;
    delete payload.emergencyContactPhone;
    delete payload.bankName;
    delete payload.accountNumber;
    delete payload.routingNumber;
    delete payload.startTime;
    delete payload.endTime;

    // Debug: Log the final payload
    console.log('Final payload before submit:', payload);
    console.log('Software Proficiency in payload:', payload.softwareProficiency);

    onSubmit(payload, fileList[0]?.originFileObj);
  };

  const getRoleTitle = () => {
    return role === 'librarian' ? 'Librarian' : 'Accountant';
  };

  const getDepartmentPlaceholder = () => {
    return role === 'librarian' ? 'Library Department' : 'Finance Department';
  };

  const getSpecializationPlaceholder = () => {
    return role === 'librarian' 
      ? 'e.g., Children\'s Literature, Digital Resources, Cataloging'
      : 'e.g., General Accounting, Payroll, Tax Specialist';
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      setFileList(info.fileList.slice(-1)); // Keep only the last file
    },
    fileList,
  };

  return (
    <Modal
      title={`Add New ${getRoleTitle()}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="95vw"
      style={{ maxWidth: '1000px' }}
      centered
      className="staff-form-modal"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            {/* Personal Information Section */}
            <Divider orientation="left" icon={<UserOutlined />}>Personal Information</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="First Name"
                  required
                  validateStatus={errors.firstName && touched.firstName ? 'error' : ''}
                  help={errors.firstName && touched.firstName ? errors.firstName : ''}
                >
                  <Input
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter first name"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Last Name"
                  required
                  validateStatus={errors.lastName && touched.lastName ? 'error' : ''}
                  help={errors.lastName && touched.lastName ? errors.lastName : ''}
                >
                  <Input
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter last name"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Date of Birth"
                  required
                  validateStatus={errors.dateOfBirth && touched.dateOfBirth ? 'error' : ''}
                  help={errors.dateOfBirth && touched.dateOfBirth ? errors.dateOfBirth : ''}
                >
                  <DatePicker
                    value={values.dateOfBirth}
                    onChange={(date) => setFieldValue('dateOfBirth', date)}
                    placeholder="Select date of birth"
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Gender"
                  required
                  validateStatus={errors.gender && touched.gender ? 'error' : ''}
                  help={errors.gender && touched.gender ? errors.gender : ''}
                >
                  <Select
                    value={values.gender}
                    onChange={(value) => setFieldValue('gender', value)}
                    placeholder="Select gender"
                    size="large"
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Address"
                  required
                  validateStatus={errors.address && touched.address ? 'error' : ''}
                  help={errors.address && touched.address ? errors.address : ''}
                >
                  <Input
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter address"
                    size="large"
                    icon={<HomeOutlined />}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="City"
                  required
                  validateStatus={errors.city && touched.city ? 'error' : ''}
                  help={errors.city && touched.city ? errors.city : ''}
                >
                  <Input
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter city"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Contact Information Section */}
            <Divider orientation="left" icon={<PhoneOutlined />}>Contact Information</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  required
                  validateStatus={errors.email && touched.email ? 'error' : ''}
                  help={errors.email && touched.email ? errors.email : ''}
                >
                  <Input
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter email address"
                    size="large"
                    icon={<MailOutlined />}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone Number"
                  required
                  validateStatus={errors.phoneNumber && touched.phoneNumber ? 'error' : ''}
                  help={errors.phoneNumber && touched.phoneNumber ? errors.phoneNumber : ''}
                >
                  <Input
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    size="large"
                    icon={<PhoneOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Employment Information Section */}
            <Divider orientation="left" icon={<CalendarOutlined />}>Employment Information</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Hired Date"
                  required
                  validateStatus={errors.hiredDate && touched.hiredDate ? 'error' : ''}
                  help={errors.hiredDate && touched.hiredDate ? errors.hiredDate : ''}
                >
                  <DatePicker
                    value={values.hiredDate}
                    onChange={(date) => setFieldValue('hiredDate', date)}
                    placeholder="Select hired date"
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Status"
                  required
                  validateStatus={errors.status && touched.status ? 'error' : ''}
                  help={errors.status && touched.status ? errors.status : ''}
                >
                  <Select
                    value={values.status}
                    onChange={(value) => setFieldValue('status', value)}
                    placeholder="Select status"
                    size="large"
                  >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Department"
                  required
                  validateStatus={errors.department && touched.department ? 'error' : ''}
                  help={errors.department && touched.department ? errors.department : ''}
                >
                  <Input
                    name="department"
                    value={values.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={getDepartmentPlaceholder()}
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Employment Type"
                  required
                  validateStatus={errors.employmentType && touched.employmentType ? 'error' : ''}
                  help={errors.employmentType && touched.employmentType ? errors.employmentType : ''}
                >
                  <Select
                    value={values.employmentType}
                    onChange={(value) => setFieldValue('employmentType', value)}
                    placeholder="Select employment type"
                    size="large"
                  >
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                    <Option value="Contract">Contract</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Professional Information Section */}
            <Divider orientation="left" icon={<BookOutlined />}>Professional Information</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Specialization"
                  validateStatus={errors.specialization && touched.specialization ? 'error' : ''}
                  help={errors.specialization && touched.specialization ? errors.specialization : ''}
                >
                  <Input
                    name="specialization"
                    value={values.specialization}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={getSpecializationPlaceholder()}
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Working Hours"
                  validateStatus={errors.workingHours && touched.workingHours ? 'error' : ''}
                  help={errors.workingHours && touched.workingHours ? errors.workingHours : ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TimePicker
                      value={values.startTime}
                      onChange={(time) => setFieldValue('startTime', time)}
                      placeholder="Start Time"
                      format="HH:mm"
                      size="large"
                      style={{ flex: 1 }}
                    />
                    <span style={{ color: '#666' }}>to</span>
                    <TimePicker
                      value={values.endTime}
                      onChange={(time) => setFieldValue('endTime', time)}
                      placeholder="End Time"
                      format="HH:mm"
                      size="large"
                      style={{ flex: 1 }}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Qualifications"
                  required
                  validateStatus={errors.qualifications && touched.qualifications ? 'error' : ''}
                  help={errors.qualifications && touched.qualifications ? errors.qualifications : ''}
                >
                  <TextArea
                    name="qualifications"
                    value={values.qualifications}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter educational qualifications and certifications"
                    rows={3}
                    size="large"
                    icon={<TrophyOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Experience"
                  required
                  validateStatus={errors.experience && touched.experience ? 'error' : ''}
                  help={errors.experience && touched.experience ? errors.experience : ''}
                >
                  <TextArea
                    name="experience"
                    value={values.experience}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter relevant work experience and skills"
                    rows={3}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Accountant-specific fields */}
            {role === 'accountant' && (
              <>
                <Divider orientation="left" icon={<SafetyCertificateOutlined />}>Accounting Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Software Proficiency"
                      validateStatus={errors.softwareProficiency && touched.softwareProficiency ? 'error' : ''}
                      help={errors.softwareProficiency && touched.softwareProficiency ? errors.softwareProficiency : ''}
                    >
                      <Input
                        name="softwareProficiency"
                        value={values.softwareProficiency}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., QuickBooks, Excel, Sage (comma-separated)"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Tax ID"
                      validateStatus={errors.taxId && touched.taxId ? 'error' : ''}
                      help={errors.taxId && touched.taxId ? errors.taxId : ''}
                    >
                      <Input
                        name="taxId"
                        value={values.taxId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Professional tax ID"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      label="Bank Name"
                      validateStatus={errors.bankName && touched.bankName ? 'error' : ''}
                      help={errors.bankName && touched.bankName ? errors.bankName : ''}
                    >
                      <Input
                        name="bankName"
                        value={values.bankName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Bank name"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Form.Item
                      label="Account Number"
                      validateStatus={errors.accountNumber && touched.accountNumber ? 'error' : ''}
                      help={errors.accountNumber && touched.accountNumber ? errors.accountNumber : ''}
                    >
                      <Input
                        name="accountNumber"
                        value={values.accountNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Account number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={8}>
                    <Form.Item
                      label="Routing Number"
                      validateStatus={errors.routingNumber && touched.routingNumber ? 'error' : ''}
                      help={errors.routingNumber && touched.routingNumber ? errors.routingNumber : ''}
                    >
                      <Input
                        name="routingNumber"
                        value={values.routingNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Routing number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            {/* Emergency Contact Section */}
            <Divider orientation="left" icon={<SafetyCertificateOutlined />}>Emergency Contact (Optional)</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Contact Name"
                  validateStatus={errors.emergencyContactName && touched.emergencyContactName ? 'error' : ''}
                  help={errors.emergencyContactName && touched.emergencyContactName ? errors.emergencyContactName : ''}
                >
                  <Input
                    name="emergencyContactName"
                    value={values.emergencyContactName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Emergency contact name"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Relationship"
                  validateStatus={errors.emergencyContactRelationship && touched.emergencyContactRelationship ? 'error' : ''}
                  help={errors.emergencyContactRelationship && touched.emergencyContactRelationship ? errors.emergencyContactRelationship : ''}
                >
                  <Input
                    name="emergencyContactRelationship"
                    value={values.emergencyContactRelationship}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Spouse, Parent"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Phone Number"
                  validateStatus={errors.emergencyContactPhone && touched.emergencyContactPhone ? 'error' : ''}
                  help={errors.emergencyContactPhone && touched.emergencyContactPhone ? errors.emergencyContactPhone : ''}
                >
                  <Input
                    name="emergencyContactPhone"
                    value={values.emergencyContactPhone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Emergency contact phone"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Profile Picture Upload */}
            <Divider orientation="left">Profile Picture (Optional)</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Profile Picture">
                  <Upload {...uploadProps} listType="picture">
                    <Button icon={<UploadOutlined />} size="large">
                      Click to Upload
                    </Button>
                  </Upload>
                  <div style={{ marginTop: '8px', color: '#666', fontSize: '12px' }}>
                    Only image files (JPG, PNG, GIF) under 2MB are allowed
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Space>
                <Button onClick={onCancel} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  Add {getRoleTitle()}
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default StaffFormModal;