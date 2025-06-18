import { useQuery } from "@tanstack/react-query";
import { getClassById } from "../services/api/classApi";
import { isArr } from "./useTeacher";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const useClassById = (id) => {
  const { data: classData, isLoading, error } = useQuery({
    queryKey: ["class", id],
    queryFn: () => getClassById(id),
   
  });

  useEffect(() => {
    if (error) {
      toast.error(isArr(error.response.data.message) || "Failed to fetch class");
    }
  }
  , [error]);

  return {
    classData,
    isLoading,
    error,
  };
}