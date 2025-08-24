import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {
  getSchools,
  isSchoolAdminRegisteredSchool,
  suspendSchool,
  activateSchool,
  checkSchoolStatus,
} from "../services/api/schoolApi";
import { isArr } from "./useTeacher";
export const useSchools = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  useEffect(() => {
    if (error) {
      toast.error(
        isArr(error?.response?.data?.message || "Fail to fetch schools.")
      );
    }
  }, [error]);

  return { schools: data, isLoading, error };
};

// Suspend school mutation
export const useSuspendSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, reason }) => suspendSchool(schoolId, reason),
    onSuccess: (data) => {
      toast.success(data?.message || "School suspended successfully");
      queryClient.invalidateQueries(["schools"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to suspend school");
    },
  });
};

// Activate school mutation
export const useActivateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, reason }) => activateSchool(schoolId, reason),
    onSuccess: (data) => {
      toast.success(data?.message || "School activated successfully");
      queryClient.invalidateQueries(["schools"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to activate school");
    },
  });
};

// Check school status query
export const useSchoolStatus = (schoolId) => {
  return useQuery({
    queryKey: ["schoolStatus", schoolId],
    queryFn: () => checkSchoolStatus(schoolId),
    enabled: !!schoolId,
  });
};
