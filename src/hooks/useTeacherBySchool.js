import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getTeachers } from "../services/api/teacherApi";
import { isArr } from "./useTeacher";
import { useEffect } from "react";

export const useTeacherBySchoolId = (schoolId) => {
    const { data: teachers, isLoading, error } = useQuery({
      queryKey: ["teacher", schoolId],
      queryFn: () => getTeachers(schoolId),
      enabled: !!schoolId,
    });

    useEffect(() => {
      if (error) {
        toast.error(isArr(error?.response?.data?.message) || "Failed to fetch teachers");
      }
    }
    , [error]);
  
    return {
      teachers,
      isLoading,
      error,
    };
  };
  