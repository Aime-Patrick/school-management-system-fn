import React, { useState } from "react";
import { Loader, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const ForgotPassword = ({ onBack }) => {
    const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      forgotPassword.mutateAsync( email );
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full mb-2">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-1">
            Forgot your password?
          </h2>
          <p className="text-gray-500 text-center">
            Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-navy-800 hover:bg-blue-700 transition text-white py-2 rounded-lg flex items-center justify-center gap-2 font-semibold shadow"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : null}
            Send Reset Link
          </button>
          {message && (
            <div className="text-center text-sm mt-2 px-2 py-2 rounded bg-blue-50 text-blue-700 border border-blue-100">
              {message}
            </div>
          )}
        </form>
        <div className="mt-8 flex flex-col items-center">
          <button
            className="text-blue-600 hover:underline text-sm font-medium"
            onClick={onBack}
          >
            &larr; Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};