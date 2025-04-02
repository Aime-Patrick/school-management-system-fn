import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { authData,isLoading } = useAuth();
  const userRole = authData.role || ""; 
  if(isLoading ){
    return <div className="flex h-screen justify-center items-center"><i className="pi pi-spin pi-spinner text-red-700" style={{ fontSize: '2rem' }}></i></div>
  }
  return !authData.isAuthenticated && !allowedRoles.includes(userRole) ? <Navigate to="/" /> : <Outlet />;
};

export default ProtectedRoute;
