import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from "../../../hooks/useAuth";

export const TeacherLogin = () => {
  const navigate = useNavigate();
   const { login, loginLoading} = useAuth()

   const loginFormik = useFormik({
        initialValues: {
          email:"",
          password:"",
        },
        validationSchema: yup.object({
          email: yup.string().email().required('Email is required'),
          password: yup.string().required('Password is required'),
        }),
        onSubmit: (values) => {
          login({identifier:values.email, password:values.password})
        }
        }) 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <GraduationCap className="text-blue-600" size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Teacher Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={loginFormik.handleSubmit}>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={loginFormik.values.email}
                onChange={loginFormik.handleChange}
                onBlur = {loginFormik.handleBlur}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="teacher@school.com"
              />
              {loginFormik.touched.email && loginFormik.errors.email? (
                <div className="text-[#BA1500] text-sm">{loginFormik.errors.email}</div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={loginFormik.values.password}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/teacher/reset-password")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
            <button
            type="submit"
            disabled={loginFormik.isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {loginLoading ? <i className="pi pi-spin pi-spinner text-white" style={{ fontSize: '1rem' }}></i>  : " Sign in"}
          </button>
            </div>
            <div mt-4 className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Go to Home Page
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
