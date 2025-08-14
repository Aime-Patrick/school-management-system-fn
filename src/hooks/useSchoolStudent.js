import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  getStudentBySchool,
  registerStudent,
  deleteStudent,
  updateStudent
} from "../services/api/studentApi";
import { isArr } from "./useTeacher";

export const useSchoolStudent = () => {
  const queryClient = useQueryClient();

  const {
    data: students,
    isLoading,
    error,
  } = useQuery({
    queryFn: getStudentBySchool,
    queryKey: ["schoolStudents"],
  });
  const registerStudentMutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: (data) => {
      toast.success(data.message || "Student registered successfully");
      queryClient.invalidateQueries(["students"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(
        isArr(error.response.data.message) || "Failed to register student"
      );
    },
  });
  const deleteStudentMutation = useMutation({
      mutationFn: deleteStudent,
      onSuccess: (data) => {
          toast.success(data.message || "Student deleted successfully");
          queryClient.invalidateQueries(["students"], { refetchActive: true });
      },
      onError: (error) => {
          toast.error(error.message || "Failed to delete student");
      },
  });
  const updateStudentMutation = useMutation({
      mutationFn: updateStudent,
      onSuccess: (data) => {
          toast.success(data.message || "Student updated successfully");
          queryClient.invalidateQueries(["schoolStudents"], { refetchActive: true });
      },
      onError: (error) => {
          toast.error(isArr(error.response.data.message) || "Failed to update student");
      },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        isArr(error.response.data.message) || "Failed to fetch students"
      );
    } else {
      toast.dismiss();
    }
  }, [error]);

  return {
    error,
    students,
    registerStudentMutation,
    isSubmitting: registerStudentMutation.isPending,
    isLoading,
    deleteStudentMutation,
    deleteStudentLoading: deleteStudentMutation.isPending,
    updateStudentMutation,
    updateStudentLoading: updateStudentMutation.isPending,
  };
};
