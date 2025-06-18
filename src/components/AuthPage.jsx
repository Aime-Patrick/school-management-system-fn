import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "../styles/global.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";
import { ForgotPassword } from "./ForgotPassword";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("admin");
  const [authView, setAuthView] = useState("login");
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
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex items-center justify-center font-sans">
      {authView === "login" && (
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-0 md:p-0 flex overflow-hidden border border-blue-100">
          {/* Left side: Branding/Visual */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-blue-400 w-1/2 p-10">
            <div className="flex flex-col items-center">
              <img
                src="/logo.jpg"
                alt="School Portal"
                className="w-20 h-20 mb-4 rounded-full shadow-lg border-4 border-white"
              />
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back!
              </h2>
              <p className="text-blue-100 text-center text-lg">
                School Management Portal
              </p>
            </div>
          </div>
          {/* Right side: Login Form */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-2 capitalize tracking-tight">
              {`${activeRole} Account Login`}
            </h1>
            <p className="text-center text-gray-500 text-sm mb-6">
              Please enter your details below to access your account.
            </p>

            <div className="flex justify-center space-x-2 mb-8">
              {[
                { role: "admin", label: "Admin" },
                { role: "super admin", label: "Super Admin" },
                { role: "student", label: "Student" },
                { role: "Teacher", label: "Teacher" },
              ].map(({ role, label }) => (
                <button
                  key={role}
                  onClick={() => handleRoleNavigation(role)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeRole === role
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
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
                    autoFocus={false}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={loginFormik.values.username}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    placeholder="Student Username"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {loginFormik.touched.username &&
                    loginFormik.errors.username && (
                      <div className="text-red-500 text-xs mt-1">
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
                    autoFocus={false}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    value={loginFormik.values.email}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <div className="text-red-500 text-xs mt-1">
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
                  autoFocus={false}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  value={loginFormik.values.password}
                  onChange={loginFormik.handleChange}
                  onBlur={loginFormik.handleBlur}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {loginFormik.touched.password &&
                  loginFormik.errors.password && (
                    <div className="text-red-500 text-xs mt-1">
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
                  <span className="ml-2 text-sm text-gray-600">
                    Remember Me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline font-medium"
                  onClick={() => setAuthView("forgot")}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow"
              >
                {loginLoading ? (
                  <i
                    className="pi pi-spin pi-spinner text-white"
                    style={{ fontSize: "1rem" }}
                  ></i>
                ) : (
                  "Sign in"
                )}
              </button>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back Home
                </button>
              </div>
            </form>

            <p className="mt-8 text-sm text-gray-500 leading-relaxed text-center">
              If you encounter issues logging in, please contact support.
            </p>
          </div>
        </div>
      )}
    </div>
      {authView === "forgot" && (
        <ForgotPassword onBack={() => setAuthView("login")} />
      )}
    </>
  );
};
