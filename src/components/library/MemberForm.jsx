
import { Modal, Form, Input, Select, InputNumber, Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;



const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .max(100, 'Email must not exceed 100 characters'),
  role: Yup.string().required('Role is required'),
  maxBorrowLimit: Yup.number()
    .required('Maximum borrow limit is required')
    .min(1, 'Must allow at least 1 book')
    .max(50, 'Cannot allow more than 50 books'),
  phoneNumber: Yup.string()
    .matches(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format')
    .max(20, 'Phone number too long'),
  studentId: Yup.string().max(50, 'Student ID too long'),
  department: Yup.string().max(100, 'Department name too long'),
});

const MemberForm = ({
  visible,
  onCancel,
  onSubmit,
  member,
  loading = false,
}) => {
  const initialValues = {
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'student',
    maxBorrowLimit: member?.maxBorrowLimit || 5,
    phoneNumber: member?.phoneNumber || '',
    studentId: member?.studentId || '',
    department: member?.department || '',
  };

  const handleSubmit = (values) => {
    if (member) {
      onSubmit({ ...values, id: member.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Modal
      title={member ? 'Edit Member' : 'Add New Member'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="90vw"
      style={{ maxWidth: '600px' }}
      centered
      className="library-modal"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Full Name"
              required
              validateStatus={errors.name && touched.name ? 'error' : ''}
              help={errors.name && touched.name ? errors.name : ''}
            >
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter full name"
                size="large"
              />
            </Form.Item>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label="Role"
                required
                validateStatus={errors.role && touched.role ? 'error' : ''}
                help={errors.role && touched.role ? errors.role : ''}
              >
                <Select
                  value={values.role}
                  onChange={(value) => setFieldValue('role', value)}
                  placeholder="Select role"
                  size="large"
                >
                  <Option value="student">Student</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="staff">Staff</Option>
                  <Option value="admin">Administrator</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Max Borrow Limit"
                required
                validateStatus={errors.maxBorrowLimit && touched.maxBorrowLimit ? 'error' : ''}
                help={errors.maxBorrowLimit && touched.maxBorrowLimit ? errors.maxBorrowLimit : ''}
              >
                <InputNumber
                  name="maxBorrowLimit"
                  value={values.maxBorrowLimit}
                  onChange={(value) => setFieldValue('maxBorrowLimit', value)}
                  placeholder="Limit"
                  min={1}
                  max={50}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Phone Number"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label="Student ID"
                validateStatus={errors.studentId && touched.studentId ? 'error' : ''}
                help={errors.studentId && touched.studentId ? errors.studentId : ''}
              >
                <Input
                  name="studentId"
                  value={values.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter student ID"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Department"
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
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button onClick={onCancel} size="large" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || isSubmitting}
                size="large"
                className="w-full sm:w-auto"
              >
                {member ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default MemberForm;
