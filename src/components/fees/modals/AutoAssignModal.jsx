import React from 'react';
import { Modal, Form, Select, Button, DatePicker, InputNumber, Checkbox, Spin } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAutoAssignData } from '../../../hooks/useAutoAssignData';


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

  // Mock data - in real app, these would come from API calls
  const feeStructures = [
    { id: '1', name: 'Tuition Fee - Class 1 - Term 1', category: 'Tuition Fee', amount: 500 },
    { id: '2', name: 'Library Fee - Class 1 - Term 1', category: 'Library Fee', amount: 50 },
    { id: '3', name: 'Laboratory Fee - Class 1 - Term 1', category: 'Laboratory Fee', amount: 75 },
  ];

  const classes = [
    { id: '1', name: 'Class 1' },
    { id: '2', name: 'Class 2' },
    { id: '3', name: 'Class 3' },
  ];

  const students = [
    { id: '1', name: 'John Doe', class: 'Class 1' },
    { id: '2', name: 'Jane Smith', class: 'Class 1' },
    { id: '3', name: 'Mike Johnson', class: 'Class 2' },
  ];

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
                  <Option key={structure.id} value={structure.id}>
                    {structure.name} - ${structure.amount}
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
                      setFieldValue('classIds', classes.map(c => c.id));
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
                      setFieldValue('studentIds', students.map(s => s.id));
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
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>{cls.name}</Option>
                  ))}
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
                  {students.map(student => (
                    <Option key={student.id} value={student.id}>
                      {student.name} ({student.class})
                    </Option>
                  ))}
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
