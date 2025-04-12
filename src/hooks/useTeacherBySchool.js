import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getTeachers } from "../services/api/teacherApi";
import { isArr } from "./useTeacher";

export const useTeacherBySchoolId = (schoolId) => {
    const { data: teachers, isLoading, error } = useQuery({
      queryKey: ["teacher", schoolId],
      queryFn: () => getTeachers(schoolId),
      enabled: !!schoolId,
      onError: (error) => {
        toast.error(isArr(error.response?.data?.message )|| "Failed to fetch teachers");
      },
    });
  
    return {
      teachers,
      isLoading,
      error,
    };
  };
  