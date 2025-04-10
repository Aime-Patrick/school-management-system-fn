import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createClass, getClass } from "../services/api/classApi";
import { isArr } from "./useTeacher";
export const useClasses = () => {
    const queryClient = useQueryClient()
    const { data: classes, isLoading, error } = useQuery({
        queryKey: ["classs"],
        queryFn: () => getClass(),
        onError: (error) => {
            toast.error(isArr(error.response.data.message) || "Failed to fetch teachers");
        },
      });
    const addClassesMutation = useMutation({
        mutationFn: createClass,
        onSuccess: (data) => {
            toast.success(data.message || "Created successfully");
            queryClient.invalidateQueries("teacher");
        },
        onError: (error) => {
            console.log(error)
            toast.error(isArr(error.response.data.message) || "Failed to fetch teachers");

        }
    })

    return {
        classes,
        isLoading,
        error,
        addClass:addClassesMutation.mutate,
        addClassLoading:addClassesMutation.isPending,
        addClassSuccess:addClassesMutation.isSuccess,
    }
}