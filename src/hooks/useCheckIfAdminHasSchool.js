import {  useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {   registerSchool } from "../services/api/schoolApi";

export const useAdminAddSchool = () => {
    const queryClient = useQueryClient();

    const registerSchoolMutation = useMutation({
        mutationFn: registerSchool,
        onSuccess: (data) => {
            toast.success(data?.response?.message || "Created successfully");
            queryClient.invalidateQueries("has-school");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create user");
        }
    })

    return {
        createSchool:registerSchoolMutation.mutate,
        createSchoolLoading:registerSchoolMutation.isPending,
        createSchoolSuccess: registerSchoolMutation.isSuccess
    }
}