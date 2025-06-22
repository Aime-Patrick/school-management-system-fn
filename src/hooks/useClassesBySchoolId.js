import { useQuery } from "@tanstack/react-query";
import { getClassBySchoolId } from "../services/api/classApi";
import { isArr } from "./useTeacher";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const useClassBySchoolId = (id) => {
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ["class", id],
    queryFn: () => getClassBySchoolId(id),
   
  });

  useEffect(() => {
    if (error) {
      toast.error(isArr(error.response.data.message) || "Failed to fetch class");
    }
  }
  , [error]);

  return {
    classes,
    isLoading,
    error,
  };
}