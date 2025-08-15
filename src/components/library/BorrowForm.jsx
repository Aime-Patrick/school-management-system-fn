import React from 'react';
import { Modal, Form, Select, DatePicker, Input, Button } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;



const validationSchema = Yup.object().shape({
  bookId: Yup.string().required('Book selection is required'),
  memberId: Yup.string().required('Member selection is required'),
  borrowDate: Yup.date().required('Borrow date is required'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(Yup.ref('borrowDate'), 'Due date must be after borrow date'),
  notes: Yup.string().max(500, 'Notes too long'),
});

const BorrowForm = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  books = [],
  members = []
}) => {
  const initialValues = {
    bookId: '',
    memberId: '',
    borrowDate: dayjs().format('YYYY-MM-DD'),
    dueDate: dayjs().add(14, 'day').format('YYYY-MM-DD'),
    notes: '',
  };

  return (
    <Modal
      title="Borrow Book"
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
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Select Book"
              required
              validateStatus={errors.bookId && touched.bookId ? 'error' : ''}
              help={errors.bookId && touched.bookId ? errors.bookId : ''}
            >
              <Select
                value={values.bookId}
                onChange={(value) => setFieldValue('bookId', value)}
                placeholder="Select a book"
                size="large"
              >
                {books.map(book => (
                  <Option key={book.id} value={book.id}>
                    {book.title} - {book.authors.join(', ')}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Select Member"
              required
              validateStatus={errors.memberId && touched.memberId ? 'error' : ''}
              help={errors.memberId && touched.memberId ? errors.memberId : ''}
            >
              <Select
                value={values.memberId}
                onChange={(value) => setFieldValue('memberId', value)}
                placeholder="Select a member"
                size="large"
              >
                {members.map(member => (
                  <Option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label="Borrow Date"
                required
                validateStatus={errors.borrowDate && touched.borrowDate ? 'error' : ''}
                help={errors.borrowDate && touched.borrowDate ? errors.borrowDate : ''}
              >
                <DatePicker
                  value={values.borrowDate ? dayjs(values.borrowDate) : null}
                  onChange={(date) => setFieldValue('borrowDate', date ? date.format('YYYY-MM-DD') : '')}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Due Date"
                required
                validateStatus={errors.dueDate && touched.dueDate ? 'error' : ''}
                help={errors.dueDate && touched.dueDate ? errors.dueDate : ''}
              >
                <DatePicker
                  value={values.dueDate ? dayjs(values.dueDate) : null}
                  onChange={(date) => setFieldValue('dueDate', date ? date.format('YYYY-MM-DD') : '')}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Notes (Optional)"
              validateStatus={errors.notes && touched.notes ? 'error' : ''}
              help={errors.notes && touched.notes ? errors.notes : ''}
            >
              <TextArea
                name="notes"
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Add any special notes"
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
                Borrow Book
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BorrowForm;
