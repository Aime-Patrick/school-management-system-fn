import React, {useEffect, useState} from "react";
import { Dialog } from "primereact/dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useSubscription } from "../../hooks/useSubscription";
import { Select } from "antd";
const validationSchema = Yup.object().shape({
    planName: Yup.string().required("plan title is required"),
    planAmount: Yup.number()
        .required("Amount is required")
        .typeError("Must be a number"),
    planType: Yup.string().required("Plan type is required"),
    planDuration: Yup.date().required("plan duration is required"),
    planContent: Yup.array(Yup.string()).required("plan features are required"),
});

export const AddSubscription = ({visible,onClose}) => {
  const { addSubscription, addSubscriptionLoading, addSubscriptionSuccess } = useSubscription();
  const planContent = [
    "student-management",
    "teacher-management",
    "attendance-tracking",
    "report-generation",
    "finance-module",
  ];
  const formik = useFormik({
    initialValues: {
        planName: "",
        planAmount: 0,
        planType: null,
        planDuration: 0,
        planContent: [],
    },
    validationSchema,
    onSubmit: (values) => {
        addSubscription({...values});
    },
  });

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Add Subscription plan</span>
    </div>
  );

  useEffect(()=>{
    if(addSubscriptionSuccess){
      formik.resetForm();
      onClose()
    }
  },[addSubscriptionSuccess])


  const handleClose = () =>{
    formik.resetForm();
    onClose()
  }

  const planTypeOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  
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
            <InputText
              id="planName"
              name="planName"
              type="text"
              value={formik.values.planName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="planName">Plan title</label>
          </FloatLabel>
          {formik.touched.planName && formik.errors.planName && (
            <small className="p-error">{formik.errors.planName}</small>
          )}
          </div>

          <div className="py-2 mb-2">
          <FloatLabel >
            <InputText
              id="planAmount"
              name="planAmount"
              type="number"
              value={formik.values.planAmount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="planAmount">Plan amount ($)</label>
          </FloatLabel>
          {formik.touched.planAmount && formik.errors.planAmount && (
            <small className="p-error">{formik.errors.planAmount}</small>
          )}
          </div>

          <div className="mb-2">
            <FloatLabel>
            <InputText
                id="planDuration"
                name="planDuration"
                type="number"
                value={formik.values.planDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
          <label htmlFor="planDuration">Plan duration in months</label>
          
          {formik.touched.planDuration && formik.errors.planDuration && (
              <small className="p-error">{formik.errors.planDuration}</small>
          )}
          </FloatLabel>
          </div>
          <div className="py-2">
          <FloatLabel >
          <Dropdown
              id="planType"
              name="planType"
              value={formik.values.planType}
              options={planTypeOptions}
              onChange={(e) => formik.setFieldValue("planType", e.value)}
              className="border border-gray-500 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
            />
            <label htmlFor="planType">Plan type</label>
          </FloatLabel>
          {formik.touched.planType && formik.errors.planType && (
            <small className="p-error">{formik.errors.planType}</small>
          )}
          </div>
          <div className="mb-2">
          <Select
              mode="multiple"
              id="planContent"
              name="planContent"
              value={formik.values.planContent}
              onChange={(selectedFeatures) => {
                formik.setFieldValue("planContent", selectedFeatures);
              }}
              options={planContent.map((item) => ({ label: item, value: item }))}
              className="w-full rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              placeholder="Select plan features"
              getPopupContainer={(trigger) => trigger.parentNode}
              style={{
                padding: "8px",
                border: "1px solid #ccc",
              }}
            />
            {formik.touched.planContent && formik.errors.planContent && (
              <small className="p-error">{formik.errors.planContent}</small>
            )}
          </div>
          <button type="submit" className="bg-navy-800 w-full items-center justify-center flex gap-2 text-white btn text-sm focus:outline-none focus:ring-0">
            <i className={addSubscriptionLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}></i>
            <span>{addSubscriptionLoading ? "saving..." : "Save"}</span>
          </button>
        </form>
      </Dialog>
    </div>
  );
};
