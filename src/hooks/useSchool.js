import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getSchools, isSchoolAdminRegisteredSchool } from "../services/api/schoolApi";


export const useSchools = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error} = useQuery({
        queryKey: ["schools"],
        queryFn: getSchools,
        onError: (error) => {
            toast.error(error.message || "Failed to fetch schools");
        }
    })

    
    return { schools: data, isLoading, error};
}