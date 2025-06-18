import React, { useState } from "react";
import { Loader, Lock, Eye, EyeOff } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      await resetPassword.mutateAsync({
        token,
        newPassword: password,
      });
      setMessage("Password reset successful. You can now log in.");
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/AuthPage", {
      state: { from: "resetPassword" },
      replace: true,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full mb-2">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-1">
            Reset your password
          </h2>
          <p className="text-gray-500 text-center">
            Enter your new password below. Make sure it is strong and unique.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition pr-10"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="confirm"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition pr-10"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500"
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold shadow ${
              resetPassword.isSuccess ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={resetPassword.isPending || resetPassword.isSuccess || resetPassword.isError}
          >
            {resetPassword.isPending ? <Loader className="h-4 w-4 animate-spin" /> : null}
            Reset Password
          </button>
          {message && (
            <div
              className={`text-center text-sm mt-2 px-2 py-2 rounded border ${
                resetPassword.isSuccess
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-red-50 text-red-700 border-red-100"
              }`}
            >
              {message}
            </div>
          )}
        </form>
        <div className="mt-8 flex flex-col items-center">
          <button
            className="text-blue-600 hover:underline text-sm font-medium"
            onClick={handleBack}
            disabled={resetPassword.isPending || resetPassword.isSuccess || resetPassword.isError}
          >
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
