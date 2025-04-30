import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAcademicYear, createAcademicYear, getAcademicYearById, deleteAcademicYear, updateAcademicYear, createAcademicTerms, getAcademicTerms, deleteAcademicTerms, updateAcademicTerms } from "../services/api/academicApi";
import toast from "react-hot-toast";
import { isArr } from "./useTeacher";

export const useAcademic = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["academic"],
        queryFn: getAcademicYear,
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to fetch academic year");
        },
    });

    const createAcademicYearMutation = useMutation({
        mutationFn: createAcademicYear,
        onSuccess: (data) => {
            toast.success(data.message || "Academic year created successfully");
            queryClient.invalidateQueries(["academic"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to create academic year");
        },
    });

    const updateAcademicYearMutation = useMutation({
        mutationFn: updateAcademicYear,
        onSuccess: (data) => {
            toast.success(data.message || "Academic year updated successfully");
            queryClient.invalidateQueries(["academic"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to update academic year");
        },
    });

    const deleteAcademicYearMutation = useMutation({
        mutationFn: deleteAcademicYear,
        onSuccess: () => {
            toast.success("Academic year deleted successfully");
            queryClient.invalidateQueries(["academic"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to delete academic year");
        },
    });

    const createAcademicTermsMutation = useMutation({
        mutationFn: createAcademicTerms,
        onSuccess: (data) => {
            toast.success(data.message || "Academic terms created successfully");
            queryClient.invalidateQueries(["academicTerms"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to create academic terms");
        },
    });
    const updateAcademicTermsMutation = useMutation({
        mutationFn: updateAcademicTerms,
        onSuccess: (data) => {
            toast.success(data.message || "Academic terms updated successfully");
            queryClient.invalidateQueries(["academicTerms"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to update academic terms");
        },
    });
    const deleteAcademicTermsMutation = useMutation({
        mutationFn: deleteAcademicTerms,
        onSuccess: () => {
            toast.success("Academic terms deleted successfully");
            queryClient.invalidateQueries(["academicTerms"], { refetchActive: true });
        },
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to delete academic terms");
        },
    });

    const { data: academicTerms, isLoading: isLoadingTerms, error: errorTerms } = useQuery({
        queryKey: ["academicTerms"],
        queryFn: getAcademicTerms,
        onError: (error) => {
            toast.error(isArr(error?.response?.data?.message )|| "Failed to fetch academic terms");
        },
    });

    return {
        academicYears:data,
        isLoading,
        error,
        createAcademicYearMutation,
        updateAcademicYearMutation,
        deleteAcademicYearMutation,
        createAcademicTermsMutation,
        createAcademicTermsIsloading:createAcademicTermsMutation.isPending,
        updateAcademicTermsMutation,
        updateAcademicTermsIsloading:updateAcademicTermsMutation.isPending,
        deleteAcademicTermsIsloading:deleteAcademicTermsMutation.isPending,
        deleteAcademicTermsMutation,
        academicTerms,
        isLoadingTerms,
        errorTerms,
    };
}