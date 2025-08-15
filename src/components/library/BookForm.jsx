import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Space, Tooltip } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must not exceed 200 characters'),
  authors: Yup.array()
    .of(Yup.string().required('Author name is required'))
    .min(1, 'At least one author is required'),
  isbn: Yup.string()
    .required('ISBN is required')
    .test('isbn-format', 'Invalid ISBN format. Examples: 978-0-7475-3269-9, 0-7475-3269-9, 9780747532699', function(value) {
      if (!value) return false;
      
      // Remove hyphens and spaces
      const cleanIsbn = value.replace(/[-\s]/g, '');
      
      // Check if it's 10 or 13 digits
      if (!/^\d{10}$|^\d{13}$/.test(cleanIsbn)) {
        return false;
      }
      
      // Basic validation: 13-digit ISBNs should start with 978 or 979
      if (cleanIsbn.length === 13 && !cleanIsbn.startsWith('978') && !cleanIsbn.startsWith('979')) {
        return false;
      }
      
      return true;
    }),
  category: Yup.string().required('Category is required'),
  publicationYear: Yup.number()
    .min(1800, 'Publication year must be after 1800')
    .max(new Date().getFullYear(), 'Publication year cannot be in the future'),
  publisher: Yup.string().max(100, 'Publisher name too long'),
  description: Yup.string().max(1000, 'Description too long'),
  copies: Yup.number()
    .required('Number of copies is required')
    .min(1, 'Must have at least 1 copy')
    .max(1000, 'Cannot have more than 1000 copies'),
  location: Yup.string().max(100, 'Location description too long'),
});

const BookForm = ({
  visible,
  onCancel,
  onSubmit,
  book,
  loading = false,
}) => {
  const initialValues = {
    title: book?.title || '',
    authors: book?.authors || [''],
    isbn: book?.isbn || '',
    category: book?.category || '',
    publicationYear: book?.publicationYear || undefined,
    publisher: book?.publisher || '',
    description: book?.description || '',
    copies: book?.copies || 1,
    location: book?.location || '',
  };

  const handleSubmit = (values) => {
    if (book) {
      onSubmit({ ...values, id: book.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Modal
      title={book ? 'Edit Book' : 'Add New Book'}
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
              label="Title"
              required
              validateStatus={errors.title && touched.title ? 'error' : ''}
              help={errors.title && touched.title ? errors.title : ''}
            >
              <Input
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter book title"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Authors"
              required
              validateStatus={errors.authors && touched.authors ? 'error' : ''}
              help={errors.authors && touched.authors ? errors.authors : ''}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {values.authors.map((author, index) => (
                  <Input
                    key={index}
                    value={author}
                    onChange={(e) => {
                      const newAuthors = [...values.authors];
                      newAuthors[index] = e.target.value;
                      setFieldValue('authors', newAuthors);
                    }}
                    placeholder={`Author ${index + 1}`}
                    size="large"
                  />
                ))}
                <Button
                  type="dashed"
                  onClick={() => setFieldValue('authors', [...values.authors, ''])}
                  block
                >
                  Add Author
                </Button>
                {values.authors.length > 1 && (
                  <Button
                    type="text"
                    danger
                    onClick={() => {
                      const newAuthors = values.authors.slice(0, -1);
                      setFieldValue('authors', newAuthors);
                    }}
                  >
                    Remove Last Author
                  </Button>
                )}
              </Space>
            </Form.Item>

            <Form.Item
              label={
                <span>
                  ISBN{' '}
                  <Tooltip title="International Standard Book Number - 10 or 13 digits with optional hyphens">
                    <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                  </Tooltip>
                </span>
              }
              required
              validateStatus={errors.isbn && touched.isbn ? 'error' : ''}
              help={errors.isbn && touched.isbn ? errors.isbn : ''}
              extra="Format: 10 or 13 digits with optional hyphens. Examples: 978-0-7475-3269-9, 0-7475-3269-9, 9780747532699"
            >
              <Input
                name="isbn"
                value={values.isbn}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter ISBN (e.g., 978-0-7475-3269-9)"
                size="large"
              />
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                <strong>Common formats:</strong> 978-0-7475-3269-9, 0-7475-3269-9, 9780747532699
              </div>
            </Form.Item>

            <Form.Item
              label="Category"
              required
              validateStatus={errors.category && touched.category ? 'error' : ''}
              help={errors.category && touched.category ? errors.category : ''}
            >
              <Select
                value={values.category}
                onChange={(value) => setFieldValue('category', value)}
                placeholder="Select category"
                size="large"
              >
                <Option value="fiction">Fiction</Option>
                <Option value="non-fiction">Non-Fiction</Option>
                <Option value="science">Science</Option>
                <Option value="technology">Technology</Option>
                <Option value="history">History</Option>
                <Option value="philosophy">Philosophy</Option>
                <Option value="literature">Literature</Option>
                <Option value="art">Art</Option>
                <Option value="biography">Biography</Option>
                <Option value="reference">Reference</Option>
                <Option value="textbook">Textbook</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                label="Publication Year"
                validateStatus={errors.publicationYear && touched.publicationYear ? 'error' : ''}
                help={errors.publicationYear && touched.publicationYear ? errors.publicationYear : ''}
              >
                <InputNumber
                  name="publicationYear"
                  value={values.publicationYear}
                  onChange={(value) => setFieldValue('publicationYear', value)}
                  placeholder="Year"
                  min={1800}
                  max={new Date().getFullYear()}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Number of Copies"
                required
                validateStatus={errors.copies && touched.copies ? 'error' : ''}
                help={errors.copies && touched.copies ? errors.copies : ''}
              >
                <InputNumber
                  name="copies"
                  value={values.copies}
                  onChange={(value) => setFieldValue('copies', value)}
                  placeholder="Copies"
                  min={1}
                  max={1000}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Publisher"
              validateStatus={errors.publisher && touched.publisher ? 'error' : ''}
              help={errors.publisher && touched.publisher ? errors.publisher : ''}
            >
              <Input
                name="publisher"
                value={values.publisher}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter publisher name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Location"
              validateStatus={errors.location && touched.location ? 'error' : ''}
              help={errors.location && touched.location ? errors.location : ''}
            >
              <Input
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter book location (e.g., Shelf A, Row 3)"
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
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter book description"
                rows={4}
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
                {book ? 'Update Book' : 'Add Book'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BookForm;
