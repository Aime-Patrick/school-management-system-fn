import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { getCourses, createCourse, deleteCourse, getCourseById, updateCourse, assignTeacherToCourse } from "../services/api/coursesApi";
import { isArr } from "./useTeacher";


export const useCourses = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
    });

    const createCourseMutation = useMutation({
        mutationFn: createCourse,
        onSuccess: (data) => {
            toast.success(data.message || "Course created successfully");
            queryClient.invalidateQueries(["courses"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to create course");
        },
    });

    const updateCourseMutation = useMutation({
        mutationFn: updateCourse,
        onSuccess: (data) => {
            toast.success(data.message || "Course updated successfully");
            queryClient.invalidateQueries(["courses"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to update course");
        },
    });



    const deleteCourseMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: () => {
            toast.success("Course deleted successfully");
            queryClient.invalidateQueries(["courses"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to delete course");
        },
    });

    const assignTeacherToCourseMutation = useMutation({
        mutationFn: assignTeacherToCourse,
        onSuccess: (data) => {
            toast.success(data.message || "Teacher assigned to course successfully");
            queryClient.invalidateQueries(["courses"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to assign teacher to course");
        },
    });

    useEffect(() => {
        if (error) {
            toast.error(isArr(error.response.data.message) || "Failed to fetch courses");
        } else {
            toast.dismiss();
        }
    }, [error]);

    return {
        courses: data,
        isLoading,
        createCourseMutation,
        createCourseIsLoading: createCourseMutation.isPending,
        updateCourseIsLoading: updateCourseMutation.isPending,
        deleteCourseIsLoading: deleteCourseMutation.isPending,
        updateCourseMutation,
        deleteCourseMutation,
        assignTeacherToCourseMutation,
        assignTeacherToCourseIsLoading: assignTeacherToCourseMutation.isPending,
        assignTeacherToCourseSuccess: assignTeacherToCourseMutation.isSuccess,
    };
}