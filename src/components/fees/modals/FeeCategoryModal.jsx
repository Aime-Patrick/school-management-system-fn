import React from 'react';
import { Modal, Form, Input, Select, Button, Spin } from 'antd';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  frequency: Yup.string()
    .required('Frequency is required'),
  isActive: Yup.boolean()
    .required('Status is required'),
});

const FeeCategoryModal = ({ visible, onCancel, onSubmit, category, loading }) => {
  const initialValues = category ? {
    name: category.name,
    description: category.description,
    frequency: category.frequency,
    isActive: category.isActive,
  } : {
    name: '',
    description: '',
    frequency: '',
    isActive: true,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Modal
      title={category ? 'Edit Fee Category' : 'Add Fee Category'}
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
              label="Name"
              validateStatus={errors.name && touched.name ? 'error' : ''}
              help={errors.name && touched.name ? errors.name : ''}
            >
              <Input
                name="name"
                value={values.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                placeholder="Enter category name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              validateStatus={errors.description && touched.description ? 'error' : ''}
              help={errors.description && touched.description ? errors.description : ''}
            >
              <TextArea
                name="description"
                value={values.description}
                onChange={(e) => setFieldValue('description', e.target.value)}
                placeholder="Enter category description"
                rows={4}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Frequency"
              validateStatus={errors.frequency && touched.frequency ? 'error' : ''}
              help={errors.frequency && touched.frequency ? errors.frequency : ''}
            >
              <Select
                name="frequency"
                value={values.frequency}
                onChange={(value) => setFieldValue('frequency', value)}
                placeholder="Select frequency"
                size="large"
                style={{ width: '100%' }}
              >
                <Option value="monthly">Monthly</Option>
                <Option value="quarterly">Quarterly</Option>
                <Option value="semester">Semester</Option>
                <Option value="annually">Annually</Option>
                <Option value="one-time">One Time</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              validateStatus={errors.isActive && touched.isActive ? 'error' : ''}
              help={errors.isActive && touched.isActive ? errors.isActive : ''}
            >
              <Select
                name="isActive"
                value={values.isActive}
                onChange={(value) => setFieldValue('isActive', value)}
                placeholder="Select status"
                size="large"
                style={{ width: '100%' }}
              >
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
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
                {category ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default FeeCategoryModal;
