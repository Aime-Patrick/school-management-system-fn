import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllUsersInSystem } from "../services/api/usersApi";

export const useUsers = () => {
    const queryClient = new QueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsersInSystem,
        onError: (error) => {
            toast.error(error.message || "Failed to fetch users");
        }
    });

    return { users: data, isLoading, error };
}