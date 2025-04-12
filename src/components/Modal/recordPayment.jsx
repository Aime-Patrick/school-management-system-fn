import React, {useEffect, useState} from "react";
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
const planOptions = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Yearly", value: "yearly" },
];

const validationSchema = Yup.object().shape({
  schoolId: Yup.string().required("School ID is required"),
  amount: Yup.number()
    .required("Amount is required")
    .typeError("Must be a number"),
  date: Yup.date().required("Date is required"),
  plan: Yup.string().required("Plan is required"),
});

export const RecordPayment = ({visible,onClose}) => {
  const { addPaymentRecord, addPaymentRecordLoading, addPaymentRecordSuccess } = usePayment();
  const {schools} = useSchools();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const formik = useFormik({
    initialValues: {
      schoolId: "",
      amount: "",
      date: null,
      plan: "",
      proof: [],
    },
    validationSchema,
    onSubmit: (values) => {
        addPaymentRecord({...values});
    },
  });

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Record payment</span>
    </div>
  );

  const handleFileUpload = (file) => {
    if (!file) return;
  
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, file.originFileObj || file];
      formik.setFieldValue("proof", updatedFiles);
      return updatedFiles;
    });
  };
  
const schoolOptions = schools?.map((school) => ({
    label: school.schoolName,
    value: school._id,
  }));

  const handleClose = () =>{
    formik.resetForm();
    setUploadedFiles([]);
    onClose()
  }

  useEffect(()=>{
    if(addPaymentRecordSuccess){
        handleClose()
    }
  },[addPaymentRecordSuccess])
  
  return (
    <div>
      <Dialog
        visible={visible}
        header={headerElement}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          handleClose()
        }}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="p-fluid space-y-4 p-4"
        >
          <div className="py-2 mb-2">
          <FloatLabel >
          <Dropdown
              id="schoolId"
              name="schoolId"
              value={formik.values.schoolId}
              options={schoolOptions}
              onChange={(e) => formik.setFieldValue("schoolId", e.value)}
              className="border border-gray-500 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="schoolId">School ID</label>
          </FloatLabel>
          {formik.touched.schoolId && formik.errors.schoolId && (
            <small className="p-error">{formik.errors.schoolId}</small>
          )}
          </div>
          <div className="py-2 mb-2">
          <FloatLabel >
            <InputText
              id="amount"
              name="amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="amount">Amount</label>
          </FloatLabel>
          {formik.touched.amount && formik.errors.amount && (
            <small className="p-error">{formik.errors.amount}</small>
          )}
          </div>

          <div className="py-2 mb-2">
          <FloatLabel >
            <Calendar
              id="date"
              name="date"
              value={formik.values.date}
              onChange={(e) => formik.setFieldValue("date", e.value)}
              dateFormat="yy-mm-dd"
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="date">Date</label>
          </FloatLabel>
          {formik.touched.date && formik.errors.date && (
            <small className="p-error">{formik.errors.date}</small>
          )}
          </div>
          <div className="py-2 mb-2">
          <FloatLabel >
            <Dropdown
              id="plan"
              name="plan"
              value={formik.values.plan}
              options={planOptions}
              onChange={(e) => formik.setFieldValue("plan", e.value)}
              className="border border-gray-500 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="plan">Plan</label>
          </FloatLabel>
          {formik.touched.plan && formik.errors.plan && (
            <small className="p-error">{formik.errors.plan}</small>
          )}
          </div>
          <FileUploader
            createSuccess={addPaymentRecordSuccess}
            multiple={true}
            accept="image/*,application/pdf"
            onFileChange={handleFileUpload}
          />
          <button type="submit" className="bg-navy-800 w-full items-center justify-center flex gap-2 text-white btn text-sm focus:outline-none focus:ring-0">
            <i className={addPaymentRecordLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}></i>
            <span>{addPaymentRecordLoading ? "saving..." : "Save"}</span>
          </button>
        </form>
      </Dialog>
    </div>
  );
};
