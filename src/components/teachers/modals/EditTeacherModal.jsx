import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect"; // ADD
import { useTeacher } from "../../../hooks/useTeacher";
import { useCourses } from "../../../hooks/useCourses";
import { useCheckSchool } from "../../../hooks/useCheckSchool";
import  FileUploader  from "../../reusable/FileUploader";



const EditTeacherModal = ({ visible, onClose, teacher }) => {
  // Add CSS to remove focus border
  const customStyles = `
    .no-focus-border .p-dropdown:focus,
    .no-focus-border .p-dropdown:focus-within,
    .no-focus-border .p-dropdown.p-focus {
      box-shadow: none !important;
      border-color: #e0e0e0 !important;
    }
  `;
  const { schoolId } = useCheckSchool();
  const { courses } = useCourses(schoolId);
  const { updateTeacher, updateTeacherLoading, updateTeacherSuccess } = useTeacher();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    gender: "",
    hiredDate: null,
    status: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        email: teacher.accountCredentails?.email || "",
        phoneNumber: teacher.accountCredentails?.phoneNumber || "",
        address: teacher.address || "",
        city: teacher.city || "",
        gender: teacher.gender || "",
        hiredDate: teacher.hiredDate ? new Date(teacher.hiredDate) : null,
        status: teacher.status || "",
        profilePicture: teacher.profilePicture || "",
      });
    }
  }, [teacher]);

  useEffect(() => {
    if (updateTeacherSuccess) {
      onClose();
    }
  }, [updateTeacherSuccess, onClose]);

  // Debug: Log formData changes
  useEffect(() => {
    console.log('formData updated:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // PrimeReact Dropdown returns e.value (not e.target.value)
  const handleDropdownChange = (name) => (e) => {
    console.log('Dropdown change:', name, e.value);
    setFormData((prev) => ({ ...prev, [name]: e.value }));
  };
  const handleDateChange = (e) =>
    setFormData((prev) => ({ ...prev, hiredDate: e.value }));

  const handleFileChange = (url) => {
    setFormData((prev) => ({ ...prev, profilePicture: url }));
  };

  const handleSubmit = () => {
    console.log('Submitting formData:', formData);
    updateTeacher({ id: teacher._id, teacherData: formData });
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const courseOptions = Array.isArray(courses)
    ? courses
    : []; // pass course objects directly

  return (
    <>
      <style>{customStyles}</style>
      <Dialog
      header="Edit Teacher Information"
      visible={visible}
      onHide={onClose}
      modal
      closable
      className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5"
    >
      <div className="p-fluid grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="field">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-gray-700">First Name</label>
          <InputText
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-gray-700">Last Name</label>
          <InputText
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
          <InputText
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
          <InputText
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">Address</label>
          <InputText
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">City</label>
          <InputText
            id="city"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
          <Dropdown
            id="gender"
            value={formData.gender || ""}
            options={genderOptions}
            optionLabel="label"
            optionValue="value"
            onChange={handleDropdownChange("gender")}
            placeholder="Select a Gender"
            className="w-full no-focus-border"
            style={{ width: '100%', border: '1px solid #e0e0e0', outline: 'none' }}
          />
        </div>
        <div className="field">
          <label htmlFor="hiredDate" className="mb-2 block text-sm font-medium text-gray-700">Hired Date</label>
          <Calendar
            id="hiredDate"
            name="hiredDate"
            value={formData.hiredDate}
            onChange={handleDateChange}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="status" className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <Dropdown
            id="status"
            value={formData.status || ""}
            options={statusOptions}
            optionLabel="label"
            optionValue="value"
            onChange={handleDropdownChange("status")}
            placeholder="Select Status"
            className="w-full no-focus-border"
            style={{ width: '100%', border: '1px solid #e0e0e0', outline: 'none' }}
          />
        </div>
        <div className="field md:col-span-2">
          <label htmlFor="profilePicture" className="mb-2 block text-sm font-medium text-gray-700">Profile Picture</label>
          <FileUploader onFileChange={handleFileChange} currentFile={formData.profilePicture} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={onClose}
          className="p-button-text text-gray-700 hover:bg-gray-100 px-5 py-2.5 rounded-lg transition duration-300 ease-in-out"
        />
        <Button
          label={updateTeacherLoading ? "Updating..." : "Update"}
          icon="pi fa-check"
          onClick={handleSubmit}
          disabled={updateTeacherLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition duration-300 ease-in-out"
        />
      </div>
      </Dialog>
    </>
  );
};

export default EditTeacherModal;
