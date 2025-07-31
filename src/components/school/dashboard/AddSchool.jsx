import React, { useState } from "react";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import * as Yup from "yup";
import { useAdminAddSchool } from "../../../hooks/useCheckIfAdminHasSchool";
import FileUploader from "../../reusable/FileUploader";
export default function AddSchool({ visible, onClose }) {
  const { createSchool, createSchoolLoading, createSchoolSuccess } =
  useAdminAddSchool();
  const createSchoolFormik = useFormik({
    initialValues: {
      schoolCode: "",
      schoolName: "",
      address: "",
      file:null
    },
    validationSchema: Yup.object({
      schoolCode: Yup.string().required("School code is required"),
      schoolName: Yup.string().required("School name is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: (values) => {
      createSchool({schoolCode:values.schoolCode, schoolName:values.schoolCode, address:values.address, file: values.file})
    },
  });

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Register new school account</span>
    </div>
  );

  const handleFileUpload = (file) => {
    if (!file) return;
    createSchoolFormik.setFieldValue("file", file);
};

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        header={headerElement}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          onClose();
        }}
      >
        <form onSubmit={createSchoolFormik.handleSubmit}>
        <div className="py-2 my-2">
          <FloatLabel>
            <InputText
              id="schoolName"
              name="schoolName"
              type="text"
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100 "
              onChange={createSchoolFormik.handleChange}
              onBlur={createSchoolFormik.handleBlur}
              value={createSchoolFormik.values.title}
            />
            <label htmlFor="schoolName" className="text-sm">
              School name
            </label>
          </FloatLabel>
          {createSchoolFormik.touched.schoolName &&
            createSchoolFormik.errors.schoolName && (
              <div className="text-[#BA1500] text-sm" aria-live="polite">
                {createSchoolFormik.errors.schoolName}
              </div>
            )}
        </div>
        <div className="py-2 my-2">
          <FloatLabel>
            <InputText
              id="address"
              name="address"
              type="text"
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              onChange={createSchoolFormik.handleChange}
              onBlur={createSchoolFormik.handleBlur}
              value={createSchoolFormik.values.address}
            />
            <label htmlFor="address" className="text-sm">
              School Address
            </label>
          </FloatLabel>
          {createSchoolFormik.touched.address &&
            createSchoolFormik.errors.address && (
              <div className="text-[#BA1500] text-sm" aria-live="polite">
                {createSchoolFormik.errors.address}
              </div>
            )}
        </div>
        <div className="py-2 my-2">
          <FloatLabel>
            <InputText
              id="schoolCode"
              name="schoolCode"
              type="text"
              className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              onChange={createSchoolFormik.handleChange}
              onBlur={createSchoolFormik.handleBlur}
              value={createSchoolFormik.values.schoolCode}
            />
            <label htmlFor="schoolCode" className="text-sm">
              School code
            </label>
          </FloatLabel>
          {createSchoolFormik.touched.schoolCode &&
            createSchoolFormik.errors.schoolCode && (
              <div className="text-[#BA1500] text-sm" aria-live="polite">
                {createSchoolFormik.errors.schoolCode}
              </div>
            )}
        </div>
        <div className="py-2 my-2">
        <FileUploader onFileChange={handleFileUpload} createSuccess={createSchoolSuccess} accept='image/*'/>
        </div>
        <Button
          label={createSchoolLoading ? "saving..." : "Save"}
          type="submit"
          disabled={createSchoolLoading}
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
          icon={createSchoolLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
          autoFocus
        />
      </form>
      </Dialog>
    </div>
  );
}
