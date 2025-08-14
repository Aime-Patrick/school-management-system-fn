
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTeacher, deleteTeacher, resetTeacherPassword, updateTeacher } from "../services/api/teacherApi";

export const isArr = (val) => Array.isArray(val) ? val[0] : val;
export const useTeacher = () => {
    const queryClient = useQueryClient();
    const createTeacherMutatuon = useMutation({
        mutationFn: addTeacher,
        onSuccess: (data) => {
            toast.success(data.message || "Created successfully");
            queryClient.invalidateQueries("teacher");
        },
        onError: (error) => {
            toast.error(isArr(error.response.data.message) || "Failed to fetch teachers");

        }
    })

    const deleteTeacherMutation = useMutation({
        mutationFn: deleteTeacher,
        onSuccess: (data) => {
            toast.success(data.message || "Deleted successfully");
            queryClient.invalidateQueries("teacher");
        },
        onError: (error) => {
            toast.error(isArr(error.response.data.message) || "Failed to fetch teachers");

        }
    })

    const resetTeacherPasswordMutation = useMutation({
        mutationFn: resetTeacherPassword,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successfully");
            queryClient.invalidateQueries("teacher");
        },
        onError: (error) => {
            toast.error(isArr(error.response.data.message) || "Failed to reset password");
        }
    })

    const updateTeacherMutation = useMutation({
        mutationFn: updateTeacher,
        onSuccess: (data) => {
            toast.success(data.message || "Updated successfully");
            queryClient.invalidateQueries("teacher");
        },
        onError: (error) => {
            toast.error(isArr(error.response.data.message) || "Failed to update teacher");
        }
    })

    return {
        deleteTeacher: deleteTeacherMutation.mutate,
        deleteTeacherLoading: deleteTeacherMutation.isPending,
        deleteTeacherSuccess: deleteTeacherMutation.isSuccess,
        createTeacher:createTeacherMutatuon.mutate,
        createTeacherLoading:createTeacherMutatuon.isPending,
        createTeacherSuccess:createTeacherMutatuon.isSuccess,
        resetTeacherPassword: resetTeacherPasswordMutation.mutate,
        resetPasswordLoading: resetTeacherPasswordMutation.isPending,
        resetPasswordSuccess: resetTeacherPasswordMutation.isSuccess,
        updateTeacher: updateTeacherMutation.mutate,
        updateTeacherLoading: updateTeacherMutation.isPending,
        updateTeacherSuccess: updateTeacherMutation.isSuccess,
    }

}

