import React, { useMemo, useState } from "react";
import { X, Loader } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import { useClassBySchoolId } from "../../hooks/useClassesBySchoolId";
import { useSchoolStudent } from "../../hooks/useSchoolStudent";
import { StudentAccountInfoModal } from "./modals/StudentAccountInfoModal"; // Import the new modal

export const AddStudentModal = ({ onClose }) => {
  const { authData } = useAuth();
  const { classes, isLoading } = useClassBySchoolId(authData.schoolId);
  const { registerStudentMutation, isSubmitting } = useSchoolStudent();
  const [selectedClassId, setSelectedClassId] = React.useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [accountCredentials, setAccountCredentials] = useState({ username: "", password: "" });

  // Find combinations for the selected class
  const selectedClass = useMemo(
    () => classes?.find((cls) => cls._id === selectedClassId),
    [selectedClassId, classes]
  );
  const combinationOptions = selectedClass?.combinations || [];

  const generatePassword = (base) => {
    // Using window.crypto.getRandomValues for browser compatibility
    const randomBytes = new Uint8Array(3);
    window.crypto.getRandomValues(randomBytes);
    const randomString = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const mixedCaseString = randomString.split('').map(char => {
        return Math.random() > 0.5 ? char.toUpperCase() : char;
    }).join('');
    return `${base}-${mixedCaseString}`;
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      dateOfBirth: "",
      enrollmentDate: "",
      phoneNumber: "",
      address: "",
      city: "",
      class: "",
      combination: "",
      profilePicture: null,
      password: "", // Added password field
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email address"),
      gender: Yup.string().required("Gender is required"),
      dateOfBirth: Yup.date().required("Date of birth is required"),
      enrollmentDate: Yup.date().required("Enrollment date is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      class: Yup.string().required("Class is required"),
      combination: Yup.string().required("Combination is required"),
      profilePicture: Yup.mixed().required("Profile picture is required"),
      password: Yup.string(), // Added password validation
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      registerStudentMutation.mutate(formData, {
        onSuccess: (data) => {
          setAccountCredentials({
            username: data.accountCredentials.username,
            password: data.studentPassword,
          });
          setShowAccountInfoModal(true);
          formik.resetForm();
        },
      });
    },
  });

  // When class changes, reset combination
  React.useEffect(() => {
    formik.setFieldValue("combination", "");
    setSelectedClassId(formik.values.class);
    // eslint-disable-next-line
  }, [formik.values.class]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className=" rounded-xl w-full max-w-2xl p-6">
          <p className="text-center text-gray-500">
            <Loader className="h-6 w-6 animate-spin" />
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-xl w-full max-w-2xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Add Students</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-500 text-sm">{formik.errors.gender}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enrollment Date
                  </label>
                  <input
                    type="date"
                    name="enrollmentDate"
                    value={formik.values.enrollmentDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.enrollmentDate && formik.errors.enrollmentDate && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.enrollmentDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.address}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-red-500 text-sm">{formik.errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    name="class"
                    value={formik.values.class}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.class && formik.errors.class && (
                    <p className="text-red-500 text-sm">{formik.errors.class}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Combination
                  </label>
                  <select
                    name="combination"
                    value={formik.values.combination}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={!selectedClassId}
                  >
                    <option value="">Select combination</option>
                    {combinationOptions.map((comb) => (
                      <option key={comb._id} value={comb._id}>
                        {comb.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.combination && formik.errors.combination && (
                    <p className="text-red-500 text-sm">{formik.errors.combination}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={(event) => {
                      formik.setFieldValue("profilePicture", event.currentTarget.files[0]);
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  {formik.touched.profilePicture && formik.errors.profilePicture && (
                    <p className="text-red-500 text-sm">{formik.errors.profilePicture}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border rounded-lg mr-2"
                      disabled
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formik.values.firstName) {
                          const newPassword = generatePassword(formik.values.firstName);
                          formik.setFieldValue("password", newPassword);
                        } else {
                          alert("Please enter First Name to generate password.");
                        }
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Generate
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => formik.resetForm()}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-navy-800 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Student"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showAccountInfoModal && (
        <StudentAccountInfoModal
          onClose={() => {
            setShowAccountInfoModal(false);
            onClose(); // Close the AddStudentModal as well
          }}
          username={accountCredentials.username}
          password={accountCredentials.password}
        />
      )}
    </>
  );
};

export default AddStudentModal;
