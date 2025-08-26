import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClassBySchoolId, assignTimetableToCombination, updateTimetableForCombination, updateScheduleItem, deleteScheduleItem, deleteDayFromTimetable } from "../services/api/classApi";
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
export const useTimeTable = () => {
  const queryClient = useQueryClient();

  const assignTimetableToCombinationMutation = useMutation({
      mutationFn: assignTimetableToCombination,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["class"] });
          toast.success("Timetable assigned successfully");
      },
      onError: (error) => {
          toast.error(error.message || "Failed to assign timetable");
      }
  })

  const updateTimetableForCombinationMutation = useMutation({
      mutationFn: updateTimetableForCombination,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["class"] });
          toast.success("Timetable updated successfully");
      },
      onError: (error) => {
          toast.error(error.message || "Failed to update timetable");
      }
  })
  const updateScheduleItemMutation = useMutation({
    mutationFn: updateScheduleItem,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["class"] });
        toast.success("Schedule item updated successfully");
    },
    onError: (error) => {
        toast.error(error.message || "Failed to update schedule item");
    }
})
const deleteScheduleItemMutation = useMutation({
  mutationFn: deleteScheduleItem,
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Schedule item deleted successfully");
  },
  onError: (error) => {
      toast.error(error.message || "Failed to delete schedule item");
  }
})

const deleteDayFromTimetableMutation = useMutation({
  mutationFn: deleteDayFromTimetable,
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("Day deleted from timetable successfully");
  },
  onError: (error) => {
      toast.error(error.message || "Failed to delete day from timetable");
  }
})

  return {
      assignTimetableToCombinationMutation,
      updateTimetableForCombinationMutation,
      updateScheduleItemMutation,
      deleteScheduleItemMutation,
      deleteDayFromTimetableMutation,
  }
}