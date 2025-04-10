import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {  isSchoolAdminRegisteredSchool, registerSchool } from "../services/api/schoolApi";
import { useState, useEffect } from "react";

export const useCheckIfAdminHasSchool = () => {
    const [schoolId,setSchoolId] = useState()
    const queryClient = useQueryClient();
    const {data, isLoading, error} = useQuery({
        queryKey: ["school-admin", "has-school"],
        queryFn: isSchoolAdminRegisteredSchool,
    });

    const registerSchoolMutation = useMutation({
        mutationFn: registerSchool,
        onSuccess: (data) => {
            toast.success(data?.response?.message || "Created successfully");
            queryClient.invalidateQueries("has-school");
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.response?.data?.message || "Failed to create user");
        }
    })
    useEffect(() => {
        if (data?.schoolId) {
          setSchoolId(data.schoolId);
        }
      }, [data]);
    
      useEffect(() => {
        if (error) {
          toast.error(error?.response?.data?.message || "Server error");
        }
      }, [error]);

    return {
        data,
        isLoading,
        error,
        schoolId,
        createSchool:registerSchoolMutation.mutate,
        createSchoolLoading:registerSchoolMutation.isPending,
        createSchoolSuccess: registerSchoolMutation.isSuccess
    }
}