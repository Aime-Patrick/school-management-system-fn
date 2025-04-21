import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { authData, isLoading: authLoading } = useAuth();
  const {
    checkSubscriptionStatus,
    checkSubscriptionStatusLoading,
    checkSubscriptionStatusSuccess,
  } = useSubscription();

  const userRole = authData.role || "";
  const schoolId = authData.schoolId || null; // Assuming `schoolId` is available in `authData`

  // Skip subscription check for system-admin
  if (!authLoading && userRole !== "system-admin" && schoolId) {
    checkSubscriptionStatus({ id: schoolId });
  }

  if (authLoading || checkSubscriptionStatusLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <i
          className="pi pi-spin pi-spinner text-blue-700"
          style={{ fontSize: "2rem" }}
        ></i>
      </div>
    );
  }

  // Redirect if the user is not authenticated or doesn't have the required role
  if (!authData.isAuthenticated || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Redirect if the subscription is invalid (only for non-system-admin users)
  if (userRole !== "system-admin" && !checkSubscriptionStatusSuccess) {
    return <Navigate to="/subscription-required" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
