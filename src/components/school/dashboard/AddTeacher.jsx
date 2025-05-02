import React, { useEffect } from "react";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import * as Yup from "yup";
import { useTeacher } from "../../../hooks/useTeacher";
const AddTeacher = ({ visible, onClose }) => {
  const { createTeacher, createTeacherLoading, createTeacherSuccess } =
    useTeacher();
  const addTeacherFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      city: "",
      hiredDate: "",
      department: "",
      gender: "",
      status: "",
      profilePicture: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("invalid email").required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      dateOfBirth: Yup.string().required("Date of birth is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      hiredDate: Yup.string().required("Hired date required"),
      department: Yup.string().required("Department is required"),
      status: Yup.string().required("Status required"),
      gender: Yup.string().required("Gender required"),
      profilePicture: Yup.mixed().nullable(),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      formData.set("phoneNumber", String(values.phoneNumber));
      createTeacher(formData);
    },
  });
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">Add Teacher</span>
    </div>
  );

  const handleClose = () => {
    addTeacherFormik.resetForm();
    onClose();
  };

  useEffect(() => {
    if (createTeacherSuccess) {
      handleClose();
    }
  }, [createTeacherSuccess]);

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        header={headerElement}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          handleClose();
        }}
      >
        <form onSubmit={addTeacherFormik.handleSubmit}>
          <div className="grid grid-flow-row grid-cols-2 gap-5 my-2">
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100 "
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.title}
                />
                <label htmlFor="firstName" className="text-sm">
                  First name
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.firstName &&
                addTeacherFormik.errors.firstName && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.firstName}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.lastName}
                />
                <label htmlFor="lastName" className="text-sm">
                  Last name
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.lastName &&
                addTeacherFormik.errors.lastName && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.lastName}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="email"
                  name="email"
                  type="text"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.email}
                />
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.email &&
                addTeacherFormik.errors.email && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.email}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="phoneNumber"
                  name="phoneNumber"
                  type="number"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.phoneNumber}
                />
                <label htmlFor="phoneNumber" className="text-sm">
                  Phone number
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.phoneNumber &&
                addTeacherFormik.errors.phoneNumber && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.phoneNumber}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="address"
                  name="address"
                  type="text"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.address}
                />
                <label htmlFor="address" className="text-sm">
                  Teacher Address
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.address &&
                addTeacherFormik.errors.address && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.address}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="city"
                  name="city"
                  type="text"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.city}
                />
                <label htmlFor="city" className="text-sm">
                  City
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.city &&
                addTeacherFormik.errors.city && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.city}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <FloatLabel>
                <InputText
                  id="department"
                  name="department"
                  type="text"
                  className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                  onChange={addTeacherFormik.handleChange}
                  onBlur={addTeacherFormik.handleBlur}
                  value={addTeacherFormik.values.department}
                />
                <label htmlFor="department" className="text-sm">
                  Teacher department
                </label>
              </FloatLabel>
              {addTeacherFormik.touched.department &&
                addTeacherFormik.errors.department && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.department}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <select
                name="status"
                id="status"
                onChange={addTeacherFormik.handleChange}
                onBlur={addTeacherFormik.handleBlur}
                value={addTeacherFormik.values.status}
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="disactive">Disactive</option>
              </select>
              {addTeacherFormik.touched.status &&
                addTeacherFormik.errors.status && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.status}
                  </div>
                )}
            </div>

            <div className="">
              <label htmlFor="dateOfBirth" className="text-sm">
                Date Of Birth
              </label>
              <InputText
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                onChange={addTeacherFormik.handleChange}
                onBlur={addTeacherFormik.handleBlur}
                value={addTeacherFormik.values.dateOfBirth}
                max={new Date().toISOString().split("T")[0]}
              />

              {addTeacherFormik.touched.dateOfBirth &&
                addTeacherFormik.errors.dateOfBirth && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.dateOfBirth}
                  </div>
                )}
            </div>
            <div className="">
              <label htmlFor="hiredDate" className="text-sm">
                Hired date
              </label>
              <InputText
                id="hiredDate"
                name="hiredDate"
                type="date"
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
                onChange={addTeacherFormik.handleChange}
                onBlur={addTeacherFormik.handleBlur}
                value={addTeacherFormik.values.hiredDate}
                max={new Date().toISOString().split("T")[0]}
              />

              {addTeacherFormik.touched.hiredDate &&
                addTeacherFormik.errors.hiredDate && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.hiredDate}
                  </div>
                )}
            </div>
            <div className="py-2 ">
              <select
                name="gender"
                id="gender"
                onChange={addTeacherFormik.handleChange}
                onBlur={addTeacherFormik.handleBlur}
                value={addTeacherFormik.values.gender}
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {addTeacherFormik.touched.gender &&
                addTeacherFormik.errors.gender && (
                  <div className="text-[#BA1500] text-sm" aria-live="polite">
                    {addTeacherFormik.errors.gender}
                  </div>
                )}
            </div>
            <div>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={(event) => {
                  addTeacherFormik.setFieldValue(
                    "profilePicture",
                    event.currentTarget.files[0]
                  );
                }}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {addTeacherFormik.touched.profilePicture &&
                addTeacherFormik.errors.profilePicture && (
                  <p className="text-red-500 text-sm">
                    {addTeacherFormik.errors.profilePicture}
                  </p>
                )}
            </div>
          </div>

          <Button
            label={createTeacherLoading ? "saving..." : "Save"}
            type="submit"
            disabled={createTeacherLoading}
            className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
            icon={createTeacherLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
            autoFocus
          />
        </form>
      </Dialog>
    </div>
  );
};

export default AddTeacher;
