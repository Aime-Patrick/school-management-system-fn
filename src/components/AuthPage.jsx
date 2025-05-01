import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "../styles/global.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("admin");
  const { login, loginLoading } = useAuth();
  const isStudent = activeRole === "student";
  const loginFormik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: yup.object(
      isStudent
        ? {
            username: yup.string().required("Username is required"),
            password: yup.string().required("Password is required"),
          }
        : {
            email: yup
              .string()
              .email("Invalid email")
              .required("Email is required"),
            password: yup.string().required("Password is required"),
          }
    ),
    onSubmit: (values) => {
      const credentials = isStudent
        ? {
            identifier: values.username,
            password: values.password,
            rememberMe: values.rememberMe,
          }
        : {
            identifier: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
          };

      login(credentials);
    },
  });

  const handleRoleNavigation = (role) => {
    switch (role) {
      case "student":
        setActiveRole("student");
        break;
      case "Teacher":
        setActiveRole("Teacher");
        break;
      case "super admin":
        setActiveRole("super admin");
        break;
      case "admin":
      default:
        setActiveRole("admin");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2 capitalize">
          {`${activeRole} Account Login`}
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Please enter your details below to access your account.
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          {[
            { role: "admin", label: "Admin" },
            { role: "super admin", label: "Super Admin" },
            { role: "student", label: "Student" },
            { role: "Teacher", label: "Teacher" },
          ].map(({ role, label }) => (
            <button
              key={role}
              onClick={() => handleRoleNavigation(role)}
              className={`p-2 rounded-md w-36 text-center transition-all whitespace-nowrap ${
                activeRole === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={loginFormik.handleSubmit} className="space-y-6">
          {activeRole === "student" ? (
            <div>
              <input
                type="text"
                id="username"
                name="username"
                autoFocus= {false}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={loginFormik.username}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                placeholder="john-GHS123202500002-86dd"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {loginFormik.touched.username && loginFormik.errors.username && (
                <div className="text-red-500 text-xs">
                  {loginFormik.errors.username}
                </div>
              )}
            </div>
          ) : (
            <div>
              <input
                type="text"
                id="email"
                name="email"
                autoFocus= {false}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={loginFormik.email}
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                placeholder="Enter school admin email address"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {loginFormik.touched.email && loginFormik.errors.email && (
                <div className="text-red-500 text-xs">
                  {loginFormik.errors.email}
                </div>
              )}
            </div>
          )}

          <div>
            <input
              type="password"
              id="password"
              name="password"
              autoFocus= {false}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              value={loginFormik.password}
              onChange={loginFormik.handleChange}
              onBlur={loginFormik.handleBlur}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {loginFormik.touched.password && loginFormik.errors.password && (
              <div className="text-red-500 text-xs">
                {loginFormik.errors.password}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={loginFormik.values.rememberMe}
                onChange={loginFormik.handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot my password
            </button>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {loginLoading ? (
              <i
                className="pi pi-spin pi-spinner text-white"
                style={{ fontSize: "1rem" }}
              ></i>
            ) : (
              " Sign in"
            )}
          </button>
          <div mt-4 className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back Home
            </button>
          </div>
        </form>
        <p className="mt-8 text-sm text-gray-600 leading-relaxed">
          If you encounter issues logging in, please contact us for support.
        </p>
      </div>
    </div>
  );
};
