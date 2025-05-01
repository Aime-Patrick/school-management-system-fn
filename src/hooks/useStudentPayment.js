import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getStudentPayment, createStudentPayment, deleteStudentPayment, getStudentPaymentById, updateStudentPaymentStatus } from "../services/api/studentPayment";
import { isArr } from "./useTeacher";

export const useStudentPayment = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["studentPayment"],
    queryFn: getStudentPayment,
  });

  const createStudentPaymentMutation = useMutation({
    mutationFn: createStudentPayment,
    onSuccess: (data) => {
      toast.success(data.message || "Student payment created successfully");
      queryClient.invalidateQueries(["studentPayment"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to create student payment");
    },
  });

  const updateStudentPaymentStatusMutation = useMutation({
    mutationFn: updateStudentPaymentStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Student payment status updated successfully");
      queryClient.invalidateQueries(["studentPayment"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to update student payment status");
    },
  });

  const deleteStudentPaymentMutation = useMutation({
    mutationFn: deleteStudentPayment,
    onSuccess: () => {
      toast.success("Student payment deleted successfully");
      queryClient.invalidateQueries(["studentPayment"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to delete student payment");
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to fetch student payment");
    }
  }, [error]);

  return {
    data,
    isLoading,
    error,
    createStudentPaymentMutation,
    createStudentPaymentIsLoading: createStudentPaymentMutation.isPending,
    updateStudentPaymentStatusIsLoading: updateStudentPaymentStatusMutation.isPending,
    deleteStudentPaymentIsLoading: deleteStudentPaymentMutation.isPending,
    updateStudentPaymentStatusMutation,
    deleteStudentPaymentMutation,
  };
}