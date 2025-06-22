import { useQuery } from "@tanstack/react-query";
import { getTeacherById } from "../services/api/teacherApi";

export const useTeacherById = (id) => {
  const { data: teacher, isLoading, isError, error } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => getTeacherById(id),
    enabled: !!id,
  });

  return {
    teacher,
    isLoading,
    isError,
    error,
  };
}