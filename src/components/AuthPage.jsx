import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "../styles/global.css";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";
import { ForgotPassword } from "./ForgotPassword";
import { Eye, EyeOff } from "lucide-react";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [authView, setAuthView] = useState("login");
  const { login, loginLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: yup.object({
      email: yup.string().required("field is required"),
      password: yup.string().required("field is required"),
    }),
    onSubmit: (values) => {
      const credentials = {
        identifier: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      };

      login(credentials);
    },
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-navy-100 via-navy-50 to-navy-200 flex items-center justify-center font-sans">
        {authView === "login" && (
          <div className="w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-2xl p-0 md:p-0 flex overflow-hidden border border-blue-100">
            {/* Left side: Branding/Visual */}
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-navy-600 to-navy-400 w-1/2 p-12">
              <div className="flex flex-col items-center">
                <img
                  src="/logo.jpg"
                  alt="School Portal"
                  className="w-24 h-24 mb-4 rounded-full shadow-lg border-4 border-white"
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
            <div className="flex-1 p-10 md:p-16 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-center text-navy-800 mb-2 capitalize tracking-tight">
                {`Login into account`}
              </h1>
              <p className="text-center text-gray-500 text-base mb-6">
                Please enter your details below to access your account.
              </p>
              <form onSubmit={loginFormik.handleSubmit} className="space-y-6">
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
                    placeholder="Email or Username"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {loginFormik.touched.email && loginFormik.errors.email && (
                    <div className="text-red-500 text-xs mt-1">
                      {loginFormik.errors.email}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
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
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {loginFormik.touched.password && loginFormik.errors.password && (
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
                      className="h-4 w-4 text-navy-600 focus:ring-navy-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember Me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-navy-600 hover:underline font-medium"
                    onClick={() => setAuthView("forgot")}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-navy-600 text-white py-3 rounded-lg hover:bg-navy-700 transition-colors font-semibold shadow"
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
                    className="font-medium text-navy-600 hover:text-navy-500"
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
