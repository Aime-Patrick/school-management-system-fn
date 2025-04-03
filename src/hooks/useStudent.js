import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllStudentInSystem } from "../services/api/studentApi";

export const useStudents = () => {
    const queryClient = new QueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["students"],
        queryFn: getAllStudentInSystem,
        onError: (error) => {
            toast.error(error.message || "Failed to fetch students");
        }
    });

    return { students: data, isLoading, error };
}