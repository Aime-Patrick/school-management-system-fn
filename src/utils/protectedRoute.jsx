import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscriptionContext } from "../utils/subscriptionContext";
import { useEffect, useState } from "react";
import { checkSubscriptionStatus } from "../services/api/subscriptionApi"; // Adjust the import path as necessary

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { authData, isLoading: authLoading } = useAuth();
  const {
    isSubscriptionActive,
    setIsSubscriptionActive,
    subscriptionDetails,
    setSubscriptionDetails,
  } = useSubscriptionContext();

  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true); // New loading state

  const userRole = authData.role || "";
  const schoolId = authData.schoolId || null;

  useEffect(() => {
    if (!authLoading && userRole !== "system-admin" && schoolId) {
      setIsCheckingSubscription(true); // Start checking subscription
      checkSubscriptionStatus({ id: schoolId })
        .then((data) => {
          setIsSubscriptionActive(data.isActive);
          setSubscriptionDetails(data.plan);
        })
        .finally(() => {
          setIsCheckingSubscription(false); // Done checking subscription
        });
    } else {
      setIsCheckingSubscription(false); // No need to check subscription
    }
  }, [authLoading, userRole, schoolId, setIsSubscriptionActive, setSubscriptionDetails]);

  if (authLoading || isCheckingSubscription) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i className="pi pi-spin pi-spinner text-blue-700" style={{ fontSize: "2rem" }}></i>
      </div>
    );
  }

  if (!authData.isAuthenticated || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  if (userRole !== "system-admin" && !isSubscriptionActive) {
    return <Navigate to="/subscription-required" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
