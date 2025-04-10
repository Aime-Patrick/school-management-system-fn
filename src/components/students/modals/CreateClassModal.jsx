import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import { useClasses } from "../../../hooks/useClasses";
import { Button } from "primereact/button";
export const CreateClassModal = ({ onClose }) => {
  const { addClass, addClassLoading, addClassSuccess } = useClasses();
  const formik = useFormik({
    initialValues: {
      className: "",
    },
    validationSchema: Yup.object({
      className: Yup.string().required("Class name is required"),
    }),
    onSubmit: (values) => {
      addClass({ name:values.className });
    },
  });

  useEffect(() => {
    if (addClassSuccess) {
      onClose();
      formik.resetForm();
    }
  }, [addClassSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create Class</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name
            </label>
            <input
              type="text"
              name="className"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.className}
              placeholder="Year 1"
              className={`w-full p-2 border rounded-lg ${
                formik.touched.className && formik.errors.className
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.className && formik.errors.className && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.className}
              </div>
            )}
          </div>

          <Button
            label={addClassLoading ? "saving..." : "Add class"}
            type="submit"
            disabled={addClassLoading}
            className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
            icon={addClassLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};
