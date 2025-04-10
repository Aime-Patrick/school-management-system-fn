import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllUsersInSystem,createUser } from "../services/api/usersApi";

export const useUsers = () => {
    const queryClient = new QueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsersInSystem,
        onError: (error) => {
            toast.error(error.message || "Failed to fetch users");
        }
    });

    const createUserMutatuon = useMutation({
        mutationFn: createUser,
        onSuccess: (user) => {
            toast.success(user.message || "Created successfully");
            queryClient.invalidateQueries("users");
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.message || "Failed to create user");
        }
    })

    return { users: data, isLoading, error,
        createUsers: createUserMutatuon.mutate,
        createUserLoading: createUserMutatuon.isPending,
        createUserError: createUserMutatuon.error,
        createUserIsSuccess: createUserMutatuon.isSuccess,
     };
}