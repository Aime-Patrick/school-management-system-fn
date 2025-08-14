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
  const { schoolId } = useCheckSchool();
  const { courses } = useCourses(schoolId);
  const { updateTeacher, updateTeacherLoading, updateTeacherSuccess } = useTeacher();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    gender: "",
    hiredDate: null,
    status: "",
    coursesTaught: [],
    profilePicture: "",
  });
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    if (teacher) {
      const initialCoursesTaught = Array.isArray(teacher.coursesTaught) ? teacher.coursesTaught : [];
      setFormData({
        firstName: teacher.firstName || "",
        lastName: teacher.lastName || "",
        email: teacher.accountCredentails?.email || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
        city: teacher.city || "",
        gender: teacher.gender || "",
        hiredDate: teacher.hiredDate ? new Date(teacher.hiredDate) : null,
        status: teacher.status || "",
        coursesTaught: initialCoursesTaught.map(c => c._id) || [],
        profilePicture: teacher.profilePicture || "",
      });
      setSelectedCourses(initialCoursesTaught);
    }
  }, [teacher]);

  useEffect(() => {
    if (updateTeacherSuccess) {
      onClose();
    }
  }, [updateTeacherSuccess, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // PrimeReact Dropdown returns e.value (not e.target.value)
  const handleDropdownChange = (name) => (e) =>
    setFormData((prev) => ({ ...prev, [name]: e.value }));

  const handleDateChange = (e) =>
    setFormData((prev) => ({ ...prev, hiredDate: e.value }));

  // MultiSelect returns an array in e.value
  const handleCourseChange = (e) => {
    const selected = Array.isArray(e.value) ? e.value : e.value ? [e.value] : [];
    const ids = selected
      .filter((c) => c && typeof c === "object" && "_id" in c)
      .map((c) => c._id);

    setSelectedCourses(selected);
    setFormData((prev) => ({ ...prev, coursesTaught: ids }));
  };

  const handleFileChange = (url) => {
    setFormData((prev) => ({ ...prev, profilePicture: url }));
  };

  const handleSubmit = () => {
    console.log("Submitting form data:", formData);
    updateTeacher({ id: teacher._id, data: formData });
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
            value={formData.firstName}
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
            value={formData.lastName}
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
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
          <InputText
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">Address</label>
          <InputText
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">City</label>
          <InputText
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="field">
          <label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
          <Dropdown
            id="gender"
            value={formData.gender}
            options={genderOptions}
            optionLabel="label"
            optionValue="value"
            onChange={handleDropdownChange("gender")}
            placeholder="Select a Gender"
            className="w-full"
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
            value={formData.status}
            options={statusOptions}
            optionLabel="label"
            optionValue="value"
            onChange={handleDropdownChange("status")}
            placeholder="Select Status"
            className="w-full"
          />
        </div>
        {/* Courses: use MultiSelect */}
        <div className="field md:col-span-2">
          <label htmlFor="coursesTaught" className="mb-2 block text-sm font-medium text-gray-700">Courses Taught</label>
          <MultiSelect
            id="coursesTaught"
            value={selectedCourses}
            options={courseOptions}
            optionLabel="name"
            onChange={handleCourseChange}
            placeholder="Select Courses"
            filter
            display="chip"
            className="w-full"
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
  );
};

export default EditTeacherModal;
