import React from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, InputNumber } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

const { Option } = Select;

const validationSchema = Yup.object().shape({
  categoryId: Yup.string()
    .required('Category is required'),
  classId: Yup.string()
    .required('Class is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least 0.01'),
  academicYearId: Yup.string()
    .required('Academic Year is required'),
  termId: Yup.string()
    .required('Term is required'),
  dueDate: Yup.date()
    .required('Due date is required'),
  lateFeeRules: Yup.object().shape({
    gracePeriod: Yup.number()
      .min(0, 'Grace period must be non-negative'),
    lateFeeAmount: Yup.number()
      .min(0, 'Late fee amount must be non-negative'),
    lateFeePercentage: Yup.number()
      .min(0, 'Late fee percentage must be non-negative')
      .max(100, 'Late fee percentage cannot exceed 100%'),
  }),
  status: Yup.string()
    .required('Status is required'),
});

const FeeStructureModal = ({ visible, onCancel, onSubmit, structure, loading }) => {
  const initialValues = structure ? {
    categoryId: structure.category?.id || '',
    classId: structure.class?.id || '',
    amount: structure.amount || 0,
    academicYearId: structure.academicYear?.id || '',
    termId: structure.term?.id || '',
    dueDate: structure.dueDate ? dayjs(structure.dueDate).toDate() : null,
    lateFeeRules: {
      gracePeriod: structure.lateFeeRules?.gracePeriod || 0,
      lateFeeAmount: structure.lateFeeRules?.lateFeeAmount || 0,
      lateFeePercentage: structure.lateFeeRules?.lateFeePercentage || 0,
    },
    status: structure.status || 'active',
  } : {
    categoryId: '',
    classId: '',
    amount: 0,
    academicYearId: '',
    termId: '',
    dueDate: null,
    lateFeeRules: {
      gracePeriod: 0,
      lateFeeAmount: 0,
      lateFeePercentage: 0,
    },
    status: 'active',
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
  const categories = [
    { id: '1', name: 'Tuition Fee' },
    { id: '2', name: 'Library Fee' },
    { id: '3', name: 'Laboratory Fee' },
  ];

  const classes = [
    { id: '1', name: 'Class 1' },
    { id: '2', name: 'Class 2' },
    { id: '3', name: 'Class 3' },
  ];

  const academicYears = [
    { id: '1', name: '2024-2025' },
    { id: '2', name: '2023-2024' },
  ];

  const terms = [
    { id: '1', name: 'First Term' },
    { id: '2', name: 'Second Term' },
    { id: '3', name: 'Third Term' },
  ];

  return (
    <Modal
      title={structure ? 'Edit Fee Structure' : 'Add Fee Structure'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="95vw"
      style={{ maxWidth: '700px' }}
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
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Category"
                validateStatus={errors.categoryId && touched.categoryId ? 'error' : ''}
                help={errors.categoryId && touched.categoryId ? errors.categoryId : ''}
              >
                <Select
                  value={values.categoryId}
                  onChange={(value) => setFieldValue('categoryId', value)}
                  placeholder="Select category"
                  size="large"
                >
                  {categories.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Class"
                validateStatus={errors.classId && touched.classId ? 'error' : ''}
                help={errors.classId && touched.classId ? errors.classId : ''}
              >
                <Select
                  value={values.classId}
                  onChange={(value) => setFieldValue('classId', value)}
                  placeholder="Select class"
                  size="large"
                >
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>{cls.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Amount"
                validateStatus={errors.amount && touched.amount ? 'error' : ''}
                help={errors.amount && touched.amount ? errors.amount : ''}
              >
                <InputNumber
                  value={values.amount}
                  onChange={(value) => setFieldValue('amount', value)}
                  placeholder="Enter amount"
                  size="large"
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  min={0}
                  step={0.01}
                />
              </Form.Item>

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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Academic Year"
                validateStatus={errors.academicYearId && touched.academicYearId ? 'error' : ''}
                help={errors.academicYearId && touched.academicYearId ? errors.academicYearId : ''}
              >
                <Select
                  value={values.academicYearId}
                  onChange={(value) => setFieldValue('academicYearId', value)}
                  placeholder="Select academic year"
                  size="large"
                >
                  {academicYears.map(year => (
                    <Option key={year.id} value={year.id}>{year.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Term"
                validateStatus={errors.termId && touched.termId ? 'error' : ''}
                help={errors.termId && touched.termId ? errors.termId : ''}
              >
                <Select
                  value={values.termId}
                  onChange={(value) => setFieldValue('termId', value)}
                  placeholder="Select term"
                  size="large"
                >
                  {terms.map(term => (
                    <Option key={term.id} value={term.id}>{term.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-medium mb-4">Late Fee Rules</h4>
              <div className="grid grid-cols-3 gap-4">
                <Form.Item
                  label="Grace Period (days)"
                  validateStatus={errors.lateFeeRules?.gracePeriod && touched.lateFeeRules?.gracePeriod ? 'error' : ''}
                  help={errors.lateFeeRules?.gracePeriod && touched.lateFeeRules?.gracePeriod ? errors.lateFeeRules.gracePeriod : ''}
                >
                  <InputNumber
                    value={values.lateFeeRules.gracePeriod}
                    onChange={(value) => setFieldValue('lateFeeRules.gracePeriod', value)}
                    placeholder="0"
                    size="large"
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  label="Late Fee Amount"
                  validateStatus={errors.lateFeeRules?.lateFeeAmount && touched.lateFeeRules?.lateFeeAmount ? 'error' : ''}
                  help={errors.lateFeeRules?.lateFeeAmount && touched.lateFeeRules?.lateFeeAmount ? errors.lateFeeRules.lateFeeAmount : ''}
                >
                  <InputNumber
                    value={values.lateFeeRules.lateFeeAmount}
                    onChange={(value) => setFieldValue('lateFeeRules.lateFeeAmount', value)}
                    placeholder="0.00"
                    size="large"
                    style={{ width: '100%' }}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    min={0}
                    step={0.01}
                  />
                </Form.Item>

                <Form.Item
                  label="Late Fee %"
                  validateStatus={errors.lateFeeRules?.lateFeePercentage && touched.lateFeeRules?.lateFeePercentage ? 'error' : ''}
                  help={errors.lateFeeRules?.lateFeePercentage && touched.lateFeeRules?.lateFeePercentage ? errors.lateFeeRules.lateFeePercentage : ''}
                >
                  <InputNumber
                    value={values.lateFeeRules.lateFeePercentage}
                    onChange={(value) => setFieldValue('lateFeeRules.lateFeePercentage', value)}
                    placeholder="0"
                    size="large"
                    style={{ width: '100%' }}
                    min={0}
                    max={100}
                    step={0.1}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              label="Status"
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
                {structure ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default FeeStructureModal;
