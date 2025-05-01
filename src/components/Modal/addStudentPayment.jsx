import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import FileUploader from "../reusable/FileUploader";
import { usePayment } from "../../hooks/usePayment";
import { FloatLabel } from "primereact/floatlabel";
import { useSchools } from "../../hooks/useSchool";

const validationSchema = Yup.object().shape({
  studentId: Yup.string().required("Student ID is required"),
  schoolFees: Yup.number()
    .required("School fees amount is required")
    .typeError("Must be a number"),
  status: Yup.string().required("Payment status is required"),
  proof: Yup.array().min(1, "At least one proof of payment is required"),
  date: Yup.date().required("Date is required"),
  termId: Yup.string().required("Term ID is required"),
  academicId: Yup.string().required("Academic year ID is required"),
  paymentMethod: Yup.string().required("Payment method is required"),
});

export const AddStudentPayment = ({ visible, onClose }) => {
  const { addPaymentRecord, addPaymentRecordLoading, addPaymentRecordSuccess } = usePayment();
  const { schools } = useSchools();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const formik = useFormik({
    initialValues: {
      studentId: "",
      schoolFees: "",
      status: "",
      proof: [],
      date: null,
      termId: "",
      academicId: "",
      paymentMethod: "",
    },
    validationSchema,
    onSubmit: (values) => {
      addPaymentRecord({ ...values });
    },
  });

  const handleFileUpload = (file) => {
    if (!file) return;

    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, file.originFileObj || file];
      formik.setFieldValue("proof", updatedFiles);
      return updatedFiles;
    });
  };

  const handleClose = () => {
    formik.resetForm();
    setUploadedFiles([]);
    onClose();
  };

  useEffect(() => {
    if (addPaymentRecordSuccess) {
      handleClose();
    }
  }, [addPaymentRecordSuccess]);

  const paymentStatusOptions = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
  ];

  const paymentMethodOptions = [
    { label: "Cash", value: "CASH" },
    { label: "Bank Transfer", value: "BANK_TRANSFER" },
    { label: "Credit Card", value: "CREDIT_CARD" },
  ];

  return (
    <div>
      <Dialog
        visible={visible}
        header="Record Payment"
        style={{ width: "50vw" }}
        onHide={handleClose}
      >
        <form onSubmit={formik.handleSubmit} className="p-4">
          {/* Student ID */}
          <div className="grid grid-cols-2 gap-2">
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="studentId"
                name="studentId"
                value={formik.values.studentId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md"
              />
              <label htmlFor="studentId">Student ID</label>
            </FloatLabel>
            {formik.touched.studentId && formik.errors.studentId && (
              <small className="p-error">{formik.errors.studentId}</small>
            )}
          </div>

          {/* School Fees */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="schoolFees"
                name="schoolFees"
                type="number"
                value={formik.values.schoolFees}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md"
              />
              <label htmlFor="schoolFees">School Fees</label>
            </FloatLabel>
            {formik.touched.schoolFees && formik.errors.schoolFees && (
              <small className="p-error">{formik.errors.schoolFees}</small>
            )}
          </div>

          {/* Payment Status */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <Dropdown
                id="status"
                name="status"
                value={formik.values.status}
                options={paymentStatusOptions}
                onChange={(e) => formik.setFieldValue("status", e.value)}
                className="w-full border border-gray-500 rounded-md"
              />
              <label htmlFor="status">Payment Status</label>
            </FloatLabel>
            {formik.touched.status && formik.errors.status && (
              <small className="p-error">{formik.errors.status}</small>
            )}
          </div>

          {/* Date */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <Calendar
                id="date"
                name="date"
                value={formik.values.date}
                onChange={(e) => formik.setFieldValue("date", e.value)}
                dateFormat="yy-mm-dd"
                className="w-full border border-gray-500 p-2 rounded-md"
              />
              <label htmlFor="date">Date</label>
            </FloatLabel>
            {formik.touched.date && formik.errors.date && (
              <small className="p-error">{formik.errors.date}</small>
            )}
          </div>

          {/* Term ID */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="termId"
                name="termId"
                value={formik.values.termId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md"
              />
              <label htmlFor="termId">Term ID</label>
            </FloatLabel>
            {formik.touched.termId && formik.errors.termId && (
              <small className="p-error">{formik.errors.termId}</small>
            )}
          </div>

          {/* Academic Year ID */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="academicId"
                name="academicId"
                value={formik.values.academicId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md"
              />
              <label htmlFor="academicId">Academic Year ID</label>
            </FloatLabel>
            {formik.touched.academicId && formik.errors.academicId && (
              <small className="p-error">{formik.errors.academicId}</small>
            )}
          </div>

          {/* Payment Method */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <Dropdown
                id="paymentMethod"
                name="paymentMethod"
                value={formik.values.paymentMethod}
                options={paymentMethodOptions}
                onChange={(e) => formik.setFieldValue("paymentMethod", e.value)}
                className="w-full border border-gray-500 rounded-md"
              />
              <label htmlFor="paymentMethod">Payment Method</label>
            </FloatLabel>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <small className="p-error">{formik.errors.paymentMethod}</small>
            )}
          </div>

          {/* Proof of Payment */}
          <FileUploader
            createSuccess={addPaymentRecordSuccess}
            multiple={true}
            accept="image/*,application/pdf"
            onFileChange={handleFileUpload}
            className="col-span-2"
          />
          </div>
          

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-navy-800 w-full items-center justify-center flex gap-2 text-white btn text-sm"
          >
            <i className={addPaymentRecordLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}></i>
            <span>{addPaymentRecordLoading ? "Saving..." : "Save"}</span>
          </button>
        </form>
      </Dialog>
    </div>
  );
};
