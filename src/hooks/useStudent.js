import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAllStudentInSystem,
} from "../services/api/studentApi";
import { isArr } from "./useTeacher";
import { useEffect } from "react";
export const useStudents = () => {
  const queryClient = new QueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudentInSystem,
  });


  useEffect(() => {
    if (error ) {
      toast.error(isArr(error.response.data.message) || "Failed to fetch students");
    } else {
      toast.dismiss();
    }
  }, [error]);

  return {
    students: data,
    isLoading,
    error,
  };
};
