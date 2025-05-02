import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentById } from "../services/api/studentApi";
import toast from "react-hot-toast";
import { isArr } from "./useTeacher";
import { useState } from "react";

export const useStudentById = (studentId) => {
    const queryClient = useQueryClient();
    const [studentData, setStudentData] = useState(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["student", studentId],
        queryFn: () => getStudentById(studentId),
        onSuccess: (data) => {
            setStudentData(data);
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to fetch student data");
        },
    });

    return { data, isLoading, error, studentData };
}