import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isArr } from "./useTeacher";
import {
  createFeeCategory,
  getFeeCategories,
  updateFeeCategory,
  deleteFeeCategory,
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
  deleteFeeStructure,
  autoAssignFees,
  getAllFeeAssignments,
  createFeePayment,
  getFeePayments,
  approveFeePayment,
  rejectFeePayment,
  getOutstandingFeesReport,
  getPaymentSummaryReport,
  getDefaulterList,
} from "../services/api/feesApi";

// Fee Categories
export const useFeeCategories = () => {
  return useQuery({
    queryKey: ["feeCategories"],
    queryFn: getFeeCategories,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch fee categories");
    },
  });
};

export const useCreateFeeCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFeeCategory,
    onSuccess: () => {
      toast.success("Fee category created successfully");
      queryClient.invalidateQueries(["feeCategories"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to create fee category");
    },
  });
};

export const useUpdateFeeCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFeeCategory,
    onSuccess: () => {
      toast.success("Fee category updated successfully");
      queryClient.invalidateQueries(["feeCategories"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to update fee category");
    },
  });
};

export const useDeleteFeeCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFeeCategory,
    onSuccess: () => {
      toast.success("Fee category deleted successfully");
      queryClient.invalidateQueries(["feeCategories"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to delete fee category");
    },
  });
};

// Fee Structures
export const useFeeStructures = () => {
  return useQuery({
    queryKey: ["feeStructures"],
    queryFn: getFeeStructures,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch fee structures");
    },
  });
};

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFeeStructure,
    onSuccess: () => {
      toast.success("Fee structure created successfully");
      queryClient.invalidateQueries(["feeStructures"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to create fee structure");
    },
  });
};

export const useUpdateFeeStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFeeStructure,
    onSuccess: () => {
      toast.success("Fee structure updated successfully");
      queryClient.invalidateQueries(["feeStructures"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to update fee structure");
    },
  });
};

export const useDeleteFeeStructure = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteFeeStructure,
    onSuccess: () => {
      toast.success("Fee structure deleted successfully");
      queryClient.invalidateQueries(["feeStructures"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to delete fee structure");
    },
  });
};

// Fee Assignments
export const useFeeAssignments = () => {
  return useQuery({
    queryKey: ["feeAssignments"],
    queryFn: getAllFeeAssignments,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch fee assignments");
    },
  });
};

export const useAutoAssignFees = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: autoAssignFees,
    onSuccess: () => {
      toast.success("Fees assigned successfully");
      queryClient.invalidateQueries(["feeAssignments"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to assign fees");
    },
  });
};

// Fee Payments
export const useFeePayments = () => {
  return useQuery({
    queryKey: ["feePayments"],
    queryFn: getFeePayments,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch fee payments");
    },
  });
};

export const useCreateFeePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFeePayment,
    onSuccess: () => {
      toast.success("Payment recorded successfully");
      queryClient.invalidateQueries(["feePayments"]);
      queryClient.invalidateQueries(["feeAssignments"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to record payment");
    },
  });
};

export const useApproveFeePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveFeePayment,
    onSuccess: () => {
      toast.success("Payment approved successfully");
      queryClient.invalidateQueries(["feePayments"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to approve payment");
    },
  });
};

export const useRejectFeePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectFeePayment,
    onSuccess: () => {
      toast.success("Payment rejected successfully");
      queryClient.invalidateQueries(["feePayments"]);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to reject payment");
    },
  });
};

// Fee Reports
export const useOutstandingFeesReport = (schoolId, filters = {}) => {
  return useQuery({
    queryKey: ["outstandingFeesReport", schoolId, filters],
    queryFn: () => getOutstandingFeesReport(schoolId, filters),
    enabled: !!schoolId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch outstanding fees report");
    },
  });
};

export const usePaymentSummaryReport = (schoolId, dateRange) => {
  return useQuery({
    queryKey: ["paymentSummaryReport", schoolId, dateRange],
    queryFn: () => getPaymentSummaryReport(schoolId, dateRange),
    enabled: !!dateRange && !!schoolId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch payment summary report");
    },
  });
};

export const useDefaulterList = (schoolId, daysOverdue = 30) => {
  return useQuery({
    queryKey: ["defaulterList", schoolId, daysOverdue],
    queryFn: () => getDefaulterList(schoolId, daysOverdue),
    enabled: !!schoolId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch defaulter list");
    },
  });
};

export const useStudentPaymentHistory = (studentId) => {
  return useQuery({
    queryKey: ["studentPaymentHistory", studentId],
    queryFn: () => getStudentPaymentHistory(studentId),
    enabled: !!studentId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch student payment history");
    },
  });
};

export const useFeeCollectionReport = (schoolId, dateRange, groupBy = 'month') => {
  return useQuery({
    queryKey: ["feeCollectionReport", schoolId, dateRange, groupBy],
    queryFn: () => getFeeCollectionReport(schoolId, dateRange, groupBy),
    enabled: !!dateRange && !!schoolId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to fetch fee collection report");
    },
  });
};
