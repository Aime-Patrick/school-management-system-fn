import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  department: Yup.string()
    .required('Department is required')
    .max(100, 'Department name too long'),
  employmentType: Yup.string()
    .required('Employment type is required'),
  startDate: Yup.date()
    .required('Start date is required')
    .max(new Date(), 'Start date cannot be in the future'),
  qualifications: Yup.string()
    .max(500, 'Qualifications must not exceed 500 characters'),
  experience: Yup.string()
    .max(500, 'Experience must not exceed 500 characters'),
});

const StaffFormModal = ({
  visible,
  onCancel,
  onSubmit,
  role,
  schoolId,
  loading = false,
}) => {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    schoolId: schoolId || '',
    department: '',
    employmentType: 'full-time',
    startDate: dayjs(),
    qualifications: '',
    experience: '',
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      role: role,
    };
    onSubmit(payload);
  };

  const getRoleTitle = () => {
    return role === 'librarian' ? 'Librarian' : 'Accountant';
  };

  return (
    <Modal
      title={`Add New ${getRoleTitle()}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="90vw"
      style={{ maxWidth: '800px' }}
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
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Username"
                  required
                  validateStatus={errors.username && touched.username ? 'error' : ''}
                  help={errors.username && touched.username ? errors.username : ''}
                >
                  <Input
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter username"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
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
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Password"
                  required
                  validateStatus={errors.password && touched.password ? 'error' : ''}
                  help={errors.password && touched.password ? errors.password : ''}
                >
                  <Input.Password
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter password (min 8 characters)"
                    size="large"
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
                  />
                </Form.Item>
              </Col>
            </Row>

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
                    placeholder="Enter department"
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
                    <Option value="full-time">Full-time</Option>
                    <Option value="part-time">Part-time</Option>
                    <Option value="contract">Contract</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Start Date"
                  required
                  validateStatus={errors.startDate && touched.startDate ? 'error' : ''}
                  help={errors.startDate && touched.startDate ? errors.startDate : ''}
                >
                  <DatePicker
                    value={values.startDate}
                    onChange={(date) => setFieldValue('startDate', date)}
                    placeholder="Select start date"
                    style={{ width: '100%' }}
                    size="large"
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Role"
                >
                  <Input
                    value={getRoleTitle()}
                    disabled
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Qualifications"
                  validateStatus={errors.qualifications && touched.qualifications ? 'error' : ''}
                  help={errors.qualifications && touched.qualifications ? errors.qualifications : ''}
                >
                  <TextArea
                    name="qualifications"
                    value={values.qualifications}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter qualifications and certifications"
                    rows={3}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Experience"
                  validateStatus={errors.experience && touched.experience ? 'error' : ''}
                  help={errors.experience && touched.experience ? errors.experience : ''}
                >
                  <TextArea
                    name="experience"
                    value={values.experience}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter relevant work experience"
                    rows={3}
                    size="large"
                  />
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
                  loading={loading || isSubmitting}
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
