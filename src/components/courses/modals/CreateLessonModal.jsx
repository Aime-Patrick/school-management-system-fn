import React from "react";
import { X, Loader } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCourses } from "../../../hooks/useCourses";
export const CreateLessonModal = ({ onClose }) => {
  const { createCourseMutation, createCourseIsLoading } = useCourses();
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      courseCode: "",
      department: "",
      credits: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Lesson name is required"),
      credits: Yup.number()
        .required("Lesson credits is required")
        .min(1, "credits must be at least 1")
        .max(100, "Weight cannot exceed 100"),
      description: Yup.string().required("Description is required"),
      courseCode: Yup.string().required("Course code is required"),
      department: Yup.string().required("Department is required"),
    }),
    onSubmit: (values) => {
      createCourseMutation.mutate(
        {
          name: values.name,
          description: values.description,
          courseCode: values.courseCode,
          department: values.department,
          credits: values.credits,
        },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (error) => {
            console.error("Error creating lesson:", error);
          },
        }
      );
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[400px]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Create Lesson</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
                placeholder="C++"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>
           
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter lesson description"
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">{formik.errors.description}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={formik.values.courseCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
                placeholder="CS101"
              />
              {formik.touched.courseCode && formik.errors.courseCode && (
                <p className="text-red-500 text-sm">{formik.errors.courseCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
                placeholder="Computer Science"
              />
              {formik.touched.department && formik.errors.department && (
                <p className="text-red-500 text-sm">{formik.errors.department}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
              <input
                type="number"
                name="credits"
                value={formik.values.credits}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-lg"
                placeholder="3"
              />
              {formik.touched.credits && formik.errors.credits && (
                <p className="text-red-500 text-sm">{formik.errors.credits}</p>
              )}
            </div>
          </div>
          <div className="mt-6">
          <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                disabled={createCourseIsLoading}
              >
                {createCourseIsLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) :(
              "Create Lesson")
                }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
