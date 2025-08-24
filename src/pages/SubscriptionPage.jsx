import React from "react";
import { Subscription } from "../components/reusable/subscription";
import { useSubscription } from "../hooks/useSubscription";
import { GraduationCap, Moon, Star, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SubscriptionPage = () => {
  const { subscriptions, isLoading, isSubscriptionActive } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 animate-pulse">
            <GraduationCap className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Plans</h2>
          <p className="text-gray-600">Please wait while we prepare your subscription options...</p>
        </div>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <GraduationCap className="text-gray-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Plans Available</h2>
          <p className="text-gray-600 mb-6">
            We're currently setting up our subscription plans. Please check back soon or contact our support team.
          </p>
          <button
            onClick={() => navigate("/AuthPage")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowRight size={20} />
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // Update `isActive` based on `hasNoPlan`
  const updatedSubscriptions = subscriptions.map((sub) => ({
    ...sub,
    isActive: isSubscriptionActive ? true : false,
    name: sub.planName,
    price: sub.planAmount,
    duration: sub.planDuration,
    planType: sub.planType,
    features: sub.planContent,
    button: isSubscriptionActive === false ? "Get Started" : "",
  }));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Schol
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Testimonials
            </a>
          </div>

          <button
            onClick={() => navigate("/AuthPage")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <ArrowRight size={18} />
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            {!isSubscriptionActive ? (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles size={16} />
                  Choose Your Plan
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Select the Perfect Plan for Your School
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  You currently don't have an active subscription. Choose a plan that best fits your school's needs and start transforming your educational experience.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <CheckCircle size={16} />
                  Active Subscription
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Your Current Subscription
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  You have an active subscription. Here's an overview of your current plan and other available options.
                </p>
              </div>
            )}
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {updatedSubscriptions.map((plan, index) => (
              <div key={index} className="transform hover:scale-105 transition-all duration-300">
                <Subscription plan={plan} index={index} />
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-20 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Need Help Choosing?
              </h3>
              <p className="text-gray-600 mb-6">
                Our team is here to help you find the perfect plan for your school. Contact us for personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  <CheckCircle size={18} />
                  Compare Plans
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium">
                  <ArrowRight size={18} />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};