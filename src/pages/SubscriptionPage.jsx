import React from "react";
import { Subscription } from "../components/reusable/subscription";
import { useSubscription } from "../hooks/useSubscription";
import { GraduationCap, Moon, Star } from "lucide-react";
export const SubscriptionPage = () => {
  const { subscriptions, isLoading, isSubscriptionActive } = useSubscription();
  console.log(isSubscriptionActive)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-400">Loading...</h1>
      </div>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-gray-400">
          No subscriptions available
        </h1>
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
    button: isSubscriptionActive === false ?  "Get Started" : "",
  }));
  
    
  return (
    <div className="h-screen">
      <div>
      <nav className="hero-gradient px-6 py-4 fixed w-full z-50 bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-white" size={32} />
            <span className="text-2xl font-bold text-white">Schol</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-white">
            <a href="#" className="hover:text-gray-200 transition-colors">
              Home
            </a>
            <a
              href="#features"
              className="hover:text-gray-200 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-gray-200 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-gray-200 transition-colors"
            >
              Testimonials
            </a>
          </div>

          <button
            onClick={() => navigate("/AuthPage")}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>
      </div>
      <div className="hero-gradient px-5 py-10 flex items-center flex-col justify-center h-screen">
      {!isSubscriptionActive && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 text-center">
            Choose a Subscription Plan
          </h1>
          <p className="text-gray-500 mt-2">
            You currently don't have an active subscription. Select a plan to
            get started.
          </p>
        </div>
      )}
      <div className="grid grid-flow-row lg:grid-flow-col gap-6">
        {updatedSubscriptions.map((plan, index) => (
          <Subscription key={index} plan={plan} index={index} />
        ))}
      </div>
      </div>
      
    </div>
  );
};