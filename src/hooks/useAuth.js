import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/api/authApi";
import { jwtDecode } from "jwt-decode";

export const useAuth = () =>{
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const  { data: authData ={isAuthenticated: false,role: ""}, isLoading} = useQuery({
        queryKey: ['auth'],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            if (!token) return { isAuthenticated: false, role: "" };

            try {
                const decoded = jwtDecode(token);
                return { isAuthenticated: true, role: decoded.role };
            } catch (error) {
                localStorage.removeItem("token");
                return { isAuthenticated: false, role: "" };
            }
        },
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess : (data) =>{
            localStorage.setItem("token", data.token);
            toast.success("Login successful");
            const decoded = jwtDecode(data.token);
            queryClient.invalidateQueries(['auth'],{isAuthenticated: true, role: decoded.role});

            setTimeout(()=>{
                if(decoded.role === "system-admin"){
                    navigate('/sadmin');
                }else if (decoded.role === "school-admin"){
                    navigate('/school-admin/dashboard');
                }else if (decoded.role === "teacher"){
                    navigate('/teacher/dashboard');
                }else if (decoded.role === "student"){
                    navigate('/student/dashboard');
                }else {
                    localStorage.removeItem("token");
                    toast.error("Invalid user role");
                    queryClient.invalidateQueries(['auth'],{isAuthenticated: false, role: ""});
                    navigate("/");
                }
            }, 500)
        },

        onError: (error) => {
            toast.error("Invalid credentials");
            queryClient.setQueryData(['auth'], { isAuthenticated: false, role: "" });
            localStorage.removeItem("token");
        },
    });

    return {authData, isLoading, login:loginMutation.mutate, loginLoading:loginMutation.isPaused}
}