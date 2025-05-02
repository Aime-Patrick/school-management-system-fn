import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createClass, getClass, updateClass } from "../services/api/classApi";
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
            toast.error(isArr(error.response.data.message) || "Failed to fetch teachers");

        }
    })

    const updateClassMutation = useMutation({
        mutationFn: updateClass,
        onSuccess: (data) => {
            toast.success(data.message || "Updated successfully");
            queryClient.invalidateQueries("teacher");
        },
        onError: (error) => {
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
        updateClass:updateClassMutation.mutate,
        updateClassLoading:updateClassMutation.isPending,
        updateClassSuccess:updateClassMutation.isSuccess,
    }
}