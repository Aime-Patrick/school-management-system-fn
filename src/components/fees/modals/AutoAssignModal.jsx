import React from 'react';
import { Modal, Form, Select, Button, DatePicker, InputNumber, Checkbox, Spin } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAutoAssignData } from '../../../hooks/useAutoAssignData';
import { useAuth } from '../../../hooks/useAuth';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  feeStructureId: Yup.string()
    .required('Fee Structure is required'),
  classIds: Yup.array()
    .min(1, 'At least one class must be selected')
    .required('Classes are required'),
  studentIds: Yup.array()
    .min(1, 'At least one student must be selected')
    .required('Students are required'),
  assignToAllStudents: Yup.boolean(),
  assignToAllClasses: Yup.boolean(),
  dueDate: Yup.date()
    .required('Due date is required'),
  sendNotification: Yup.boolean(),
});

const AutoAssignModal = ({ visible, onCancel, onSubmit, loading }) => {
  const initialValues = {
    feeStructureId: '',
    classIds: [],
    studentIds: [],
    assignToAllStudents: false,
    assignToAllClasses: false,
    dueDate: null,
    sendNotification: true,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const submitData = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    };
    onSubmit(submitData);
    setSubmitting(false);
  };

  // Use real API data instead of mock data
  const { authData } = useAuth();
  const { feeStructures, classes, students, isLoading: dataLoading, error } = useAutoAssignData(authData?.schoolId);

  // Debug: Log the data to see its structure
  console.log('Classes data:', classes);
  console.log('Students data:', students);

  // Show loading spinner while data is being fetched
  if (dataLoading) {
    return (
      <Modal
        title="Auto Assign Fees"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width="90vw"
        style={{ maxWidth: '600px' }}
        centered
        className="fees-modal"
      >
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
          <span className="ml-3">Loading data...</span>
        </div>
      </Modal>
    );
  }

  // Show error message if data fetching failed
  if (error) {
    return (
      <Modal
        title="Auto Assign Fees"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width="90vw"
        style={{ maxWidth: '600px' }}
        centered
        className="fees-modal"
      >
        <div className="text-center py-8 text-red-500">
          <p>Error loading data. Please try again.</p>
          <Button onClick={onCancel} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Auto Assign Fees"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="90vw"
      style={{ maxWidth: '600px' }}
      centered
      className="fees-modal"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Fee Structure"
              validateStatus={errors.feeStructureId && touched.feeStructureId ? 'error' : ''}
              help={errors.feeStructureId && touched.feeStructureId ? errors.feeStructureId : ''}
            >
              <Select
                value={values.feeStructureId}
                onChange={(value) => setFieldValue('feeStructureId', value)}
                placeholder="Select fee structure"
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {feeStructures.map(structure => (
                  <Option key={structure._id || structure.id} value={structure._id || structure.id}>
                    {structure.categoryId?.name || 'Unnamed Category'} - {structure.classId?.name || 'Unknown Class'} - {structure.termId?.name || 'Unknown Term'} - ${structure.amount || 0}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Assign to All Classes"
                validateStatus={errors.assignToAllClasses && touched.assignToAllClasses ? 'error' : ''}
                help={errors.assignToAllClasses && touched.assignToAllClasses ? errors.assignToAllClasses : ''}
              >
                <Checkbox
                  checked={values.assignToAllClasses}
                  onChange={(e) => {
                    setFieldValue('assignToAllClasses', e.target.checked);
                    if (e.target.checked) {
                      setFieldValue('classIds', classes.map(c => c._id || c.id));
                    } else {
                      setFieldValue('classIds', []);
                    }
                  }}
                >
                  Assign to all classes
                </Checkbox>
              </Form.Item>

              <Form.Item
                label="Assign to All Students"
                validateStatus={errors.assignToAllStudents && touched.assignToAllStudents ? 'error' : ''}
                help={errors.assignToAllStudents && touched.assignToAllStudents ? errors.assignToAllStudents : ''}
              >
                <Checkbox
                  checked={values.assignToAllStudents}
                  onChange={(e) => {
                    setFieldValue('assignToAllStudents', e.target.checked);
                    if (e.target.checked) {
                      setFieldValue('studentIds', students.map(s => s._id || s.id));
                    } else {
                      setFieldValue('studentIds', []);
                    }
                  }}
                >
                  Assign to all students
                </Checkbox>
              </Form.Item>
            </div>

            {!values.assignToAllClasses && (
              <Form.Item
                label="Select Classes"
                validateStatus={errors.classIds && touched.classIds ? 'error' : ''}
                help={errors.classIds && touched.classIds ? errors.classIds : ''}
              >
                <Select
                  mode="multiple"
                  value={values.classIds}
                  onChange={(value) => setFieldValue('classIds', value)}
                  placeholder="Select classes"
                  size="large"
                  disabled={values.assignToAllClasses}
                >
                  {classes.filter(cls => cls && typeof cls === 'object').map(cls => {
                    const className = cls.name || cls.className || 'Unnamed Class';
                    return (
                      <Option key={cls._id || cls.id} value={cls._id || cls.id}>
                        {className}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}

            {!values.assignToAllStudents && (
              <Form.Item
                label="Select Students"
                validateStatus={errors.studentIds && touched.studentIds ? 'error' : ''}
                help={errors.studentIds && touched.studentIds ? errors.studentIds : ''}
              >
                <Select
                  mode="multiple"
                  value={values.studentIds}
                  onChange={(value) => setFieldValue('studentIds', value)}
                  placeholder="Select students"
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  disabled={values.assignToAllStudents}
                >
                  {students.filter(student => student && typeof student === 'object').map(student => {
                    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unnamed Student';
                    const studentClass = student.class?.name || 'N/A';
                    return (
                      <Option key={student._id || student.id} value={student._id || student.id}>
                        {studentName} ({studentClass})
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              label="Due Date"
              validateStatus={errors.dueDate && touched.dueDate ? 'error' : ''}
              help={errors.dueDate && touched.dueDate ? errors.dueDate : ''}
            >
              <DatePicker
                value={values.dueDate}
                onChange={(date) => setFieldValue('dueDate', date)}
                placeholder="Select due date"
                size="large"
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item>
              <Checkbox
                checked={values.sendNotification}
                onChange={(e) => setFieldValue('sendNotification', e.target.checked)}
              >
                Send notification to students/parents
              </Checkbox>
            </Form.Item>

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
                Assign Fees
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AutoAssignModal;
