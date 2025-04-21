import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect } from "react";
import {
  getSchools,
  isSchoolAdminRegisteredSchool,
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
