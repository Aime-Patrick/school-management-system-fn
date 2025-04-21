import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addTeacher } from "../services/api/teacherApi";

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


    return {
        createTeacher:createTeacherMutatuon.mutate,
        createTeacherLoading:createTeacherMutatuon.isPending,
        createTeacherSuccess:createTeacherMutatuon.isSuccess
    }

}

