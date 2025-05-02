import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";
import { isArr } from "./useTeacher";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                return true; 
            }
            return false;
        } catch (error) {
            return true;
        }
    };

    const { data: authData = { isAuthenticated: false, role: "", username: "", email: "" }, isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token || isTokenExpired(token)) {
                localStorage.removeItem("token");
                return { isAuthenticated: false, role: "" };
            }

            try {
                const decoded = jwtDecode(token);
                return { isAuthenticated: true, role: decoded.role, username:decoded.username, email:decoded.email, schoolId: decoded.schoolId , userId: decoded.id };
            } catch (error) {
                localStorage.removeItem("token");
                toast.error("Session expired. Please log in again.");
                return { isAuthenticated: false, role: "" };
            }
        },
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            toast.success("Login successful");

            try {
                const decoded = jwtDecode(data.token);
                queryClient.setQueryData(["auth"], { isAuthenticated: true, role: decoded.role , username: decoded.username, email: decoded.email});
                queryClient.invalidateQueries(["auth"]);

                setTimeout(() => {
                    switch (decoded.role) {
                        case "system-admin":
                            navigate("/sadmin");
                            break;
                        case "school-admin":
                            navigate("/school-admin");
                            break;
                        case "teacher":
                            navigate("/teacher");
                            break;
                        case "student":
                            navigate("/student");
                            break;
                        default:
                            localStorage.removeItem("token");
                            toast.error("Invalid user role");
                            queryClient.setQueryData(["auth"], { isAuthenticated: false, role: "" });
                            navigate("/");
                    }
                }, 500);
            } catch (error) {
                toast.error("Invalid token. Please try again.");
                localStorage.removeItem("token");
                queryClient.setQueryData(["auth"], { isAuthenticated: false, role: "" });
                navigate("/");
            }
        },

        onError: (error) => {
            toast.error(isArr(error.response.data.message)|| "Login failed");
            queryClient.setQueryData(["auth"], { isAuthenticated: false, role: "" });
            localStorage.removeItem("token");
        },
    });

    return { authData, isLoading, login: loginMutation.mutate, loginLoading: loginMutation.isPending };
};
