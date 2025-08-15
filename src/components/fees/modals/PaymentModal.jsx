import React from 'react';
import { Modal, Form, Input, Select, Button, DatePicker, InputNumber } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';


const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  feeAssignmentId: Yup.string()
    .required('Fee Assignment is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least 0.01'),
  paymentMode: Yup.string()
    .required('Payment mode is required'),
  paymentDate: Yup.date()
    .required('Payment date is required'),
  referenceNumber: Yup.string()
    .required('Reference number is required'),
  notes: Yup.string()
    .max(500, 'Notes must not exceed 500 characters'),
});

const PaymentModal = ({ visible, onCancel, onSubmit, loading }) => {
  const initialValues = {
    feeAssignmentId: '',
    amount: 0,
    paymentMode: '',
    paymentDate: new Date(),
    referenceNumber: '',
    notes: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const submitData = {
      ...values,
      paymentDate: values.paymentDate ? values.paymentDate.toISOString() : null,
    };
    onSubmit(submitData);
    setSubmitting(false);
  };

  // Mock data - in real app, these would come from API calls
  const feeAssignments = [
    { 
      id: '1', 
      student: { name: 'John Doe' }, 
      feeStructure: { category: { name: 'Tuition Fee' }, amount: 500 },
      status: 'pending'
    },
    { 
      id: '2', 
      student: { name: 'Jane Smith' }, 
      feeStructure: { category: { name: 'Library Fee' }, amount: 50 },
      status: 'pending'
    },
    { 
      id: '3', 
      student: { name: 'Mike Johnson' }, 
      feeStructure: { category: { name: 'Laboratory Fee' }, amount: 75 },
      status: 'pending'
    },
  ];

  const paymentModes = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'online', label: 'Online' },
  ];

  return (
    <Modal
      title="Record Payment"
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
              label="Fee Assignment"
              validateStatus={errors.feeAssignmentId && touched.feeAssignmentId ? 'error' : ''}
              help={errors.feeAssignmentId && touched.feeAssignmentId ? errors.feeAssignmentId : ''}
            >
              <Select
                value={values.feeAssignmentId}
                onChange={(value) => setFieldValue('feeAssignmentId', value)}
                placeholder="Select fee assignment"
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {feeAssignments.map(assignment => (
                  <Option key={assignment.id} value={assignment.id}>
                    {assignment.student.name} - {assignment.feeStructure.category.name} (${assignment.feeStructure.amount})
                  </Option>
                ))}
              </Select>
            </Form.Item>

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
                label="Payment Mode"
                validateStatus={errors.paymentMode && touched.paymentMode ? 'error' : ''}
                help={errors.paymentMode && touched.paymentMode ? errors.paymentMode : ''}
              >
                <Select
                  value={values.paymentMode}
                  onChange={(value) => setFieldValue('paymentMode', value)}
                  placeholder="Select payment mode"
                  size="large"
                >
                  {paymentModes.map(mode => (
                    <Option key={mode.value} value={mode.value}>{mode.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Payment Date"
                validateStatus={errors.paymentDate && touched.paymentDate ? 'error' : ''}
                help={errors.paymentDate && touched.paymentDate ? errors.paymentDate : ''}
              >
                <DatePicker
                  value={values.paymentDate}
                  onChange={(date) => setFieldValue('paymentDate', date)}
                  placeholder="Select payment date"
                  size="large"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item
                label="Reference Number"
                validateStatus={errors.referenceNumber && touched.referenceNumber ? 'error' : ''}
                help={errors.referenceNumber && touched.referenceNumber ? errors.referenceNumber : ''}
              >
                <Input
                  value={values.referenceNumber}
                  onChange={(e) => setFieldValue('referenceNumber', e.target.value)}
                  placeholder="Enter reference number"
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Notes"
              validateStatus={errors.notes && touched.notes ? 'error' : ''}
              help={errors.notes && touched.notes ? errors.notes : ''}
            >
              <TextArea
                value={values.notes}
                onChange={(e) => setFieldValue('notes', e.target.value)}
                placeholder="Enter additional notes (optional)"
                rows={3}
                size="large"
              />
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
                Record Payment
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default PaymentModal;
