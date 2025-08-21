import React from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, InputNumber } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { useFeeCategories } from '../../../hooks/useFees';
import { useClasses } from '../../../hooks/useClasses';
import { useAcademic } from '../../../hooks/useAcademic';

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
  discountAmount: Yup.number()
    .min(0, 'Discount amount must be non-negative'),
  discountPercentage: Yup.number()
    .min(0, 'Discount percentage must be non-negative')
    .max(100, 'Discount percentage cannot exceed 100%')
    .test('discount-validation', 'Discount percentage cannot exceed 100% of the amount', function(value) {
      const { discountAmount, amount } = this.parent;
      if (value && discountAmount && amount) {
        const maxPercentage = (discountAmount / amount) * 100;
        return value <= maxPercentage;
      }
      return true;
    }),
  academicYearId: Yup.string()
    .required('Academic Year is required'),
  termId: Yup.string()
    .required('Term is required'),
  dueDate: Yup.mixed()
    .required('Due date is required')
    .test('is-valid-date', 'Invalid date format', function(value) {
      if (!value) return false;
      // Check if it's a dayjs object
      if (value && typeof value.isValid === 'function') {
        return value.isValid();
      }
      // Check if it's a valid date string or Date object
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
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
    categoryId: structure.categoryId?._id || structure.category?._id || structure.category?.id || '',
    classId: structure.classId?._id || structure.class?._id || structure.class?.id || '',
    amount: structure.amount || 0,
    discountAmount: structure.discountAmount || 0,
    discountPercentage: structure.discountPercentage || 0,
    academicYearId: structure.academicYearId?._id || structure.academicYear?._id || structure.academicYear?.id || '',
    termId: structure.termId?._id || structure.term?._id || structure.term?.id || '',
    dueDate: structure.dueDate ? (() => {
      try {
        const date = dayjs(structure.dueDate);
        return date.isValid() ? date : null;
      } catch (error) {
        console.error('Error parsing date:', error, structure.dueDate);
        return null;
      }
    })() : null,
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
    discountAmount: 0,
    discountPercentage: 0,
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
    console.log('Form values before submit:', values);
    console.log('Due date type:', typeof values.dueDate, 'value:', values.dueDate);
    
    const submitData = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    };
    
    console.log('Submit data:', submitData);
    onSubmit(submitData);
    setSubmitting(false);
  };

  // Real API data
  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useFeeCategories();
  const { classes, isLoading: classesLoading, error: classesError } = useClasses();
  const { academicYears, academicTerms, isLoading: academicLoading, error: academicError } = useAcademic();

    // Extract data from API responses
  const categories = categoriesResponse?.data || [];
  const terms = academicTerms || [];
  
  // Show loading state if any data is still loading
  const isDataLoading = categoriesLoading || classesLoading || academicLoading;
  
  // Debug logging
  console.log('FeeStructureModal - structure prop:', structure);
  console.log('FeeStructureModal - initialValues:', initialValues);

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
      confirmLoading={isDataLoading}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            {isDataLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center text-blue-700">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                  Loading form data...
                </div>
              </div>
            )}
            
            {(categoriesError || classesError || academicError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-red-700">
                  <div className="font-medium mb-1">Error loading data:</div>
                  {categoriesError && <div>• Categories: {categoriesError?.response?.data?.message || 'Failed to load'}</div>}
                  {classesError && <div>• Classes: {classesError?.response?.data?.message || 'Failed to load'}</div>}
                  {academicError && <div>• Academic data: {academicError?.response?.data?.message || 'Failed to load'}</div>}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Category"
                validateStatus={errors.categoryId && touched.categoryId ? 'error' : ''}
                help={errors.categoryId && touched.categoryId ? errors.categoryId : ''}
              >
                <Select
                  value={values.categoryId}
                  onChange={(value) => setFieldValue('categoryId', value)}
                  placeholder={categoriesLoading ? "Loading categories..." : "Select category"}
                  size="large"
                  loading={categoriesLoading}
                  disabled={categoriesLoading}
                >
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <Option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</Option>
                    ))
                  ) : (
                    <Option disabled value="">No categories available</Option>
                  )}
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
                  placeholder={classesLoading ? "Loading classes..." : "Select class"}
                  size="large"
                  loading={classesLoading}
                  disabled={classesLoading}
                >
                  {classes && classes.length > 0 ? (
                    classes.map(cls => (
                      <Option key={cls._id || cls.id} value={cls._id || cls.id}>{cls.name}</Option>
                    ))
                  ) : (
                    <Option disabled value="">No classes available</Option>
                  )}
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
                  onChange={(value) => setFieldValue('dueDate', value)}
                  placeholder="Select due date"
                  size="large"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) => {
                    // Disable past dates
                    return current && current < dayjs().startOf('day');
                  }}
                />
              </Form.Item>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-lg font-medium mb-4">Discount Settings</h4>
              <p className="text-sm text-gray-600 mb-4">Set discount amount and/or percentage. You can use either or both.</p>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Discount Amount"
                validateStatus={errors.discountAmount && touched.discountAmount ? 'error' : ''}
                help={errors.discountAmount && touched.discountAmount ? errors.discountAmount : ''}
              >
                <InputNumber
                  value={values.discountAmount}
                  onChange={(value) => setFieldValue('discountAmount', value)}
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
                label="Discount Percentage"
                validateStatus={errors.discountPercentage && touched.discountPercentage ? 'error' : ''}
                help={errors.discountPercentage && touched.discountPercentage ? errors.discountPercentage : ''}
              >
                <InputNumber
                  value={values.discountPercentage}
                  onChange={(value) => setFieldValue('discountPercentage', value)}
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

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Academic Year"
                validateStatus={errors.academicYearId && touched.academicYearId ? 'error' : ''}
                help={errors.academicYearId && touched.academicYearId ? errors.academicYearId : ''}
              >
                <Select
                  value={values.academicYearId}
                  onChange={(value) => setFieldValue('academicYearId', value)}
                  placeholder={academicLoading ? "Loading academic years..." : "Select academic year"}
                  size="large"
                  loading={academicLoading}
                  disabled={academicLoading}
                >
                  {academicYears && academicYears.length > 0 ? (
                    academicYears.map(year => (
                      <Option key={year._id || year.id} value={year._id || year.id}>{year.name}</Option>
                    ))
                  ) : (
                    <Option disabled value="">No academic years available</Option>
                  )}
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
                  placeholder={academicLoading ? "Loading terms..." : "Select term"}
                  size="large"
                  loading={academicLoading}
                  disabled={academicLoading}
                >
                  {terms && terms.length > 0 ? (
                    terms.map(term => (
                      <Option key={term._id || term.id} value={term._id || term.id}>{term.name}</Option>
                    ))
                  ) : (
                    <Option disabled value="">No terms available</Option>
                  )}
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
              
              {/* Discount calculation preview */}
              {values.amount > 0 && (values.discountAmount > 0 || values.discountPercentage > 0) && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="text-sm text-blue-700">
                    <div className="font-medium mb-1">Discount Preview:</div>
                    <div>Original Amount: ${values.amount}</div>
                    {values.discountAmount > 0 && <div>Discount Amount: -${values.discountAmount}</div>}
                    {values.discountPercentage > 0 && <div>Discount Percentage: -{values.discountPercentage}%</div>}
                    <div className="font-medium mt-1">
                      Final Amount: ${Math.max(0, values.amount - values.discountAmount - (values.amount * values.discountPercentage / 100))}
                    </div>
                  </div>
                </div>
              )}
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
                disabled={isDataLoading || categoriesError || classesError || academicError}
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
