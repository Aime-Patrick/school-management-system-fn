import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, changePassword } from "../services/api/usersApi";
import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

export const useProfile = () => {
    const queryClient = useQueryClient();
    const { authData } = useAuth();

    const updateProfileMutation = useMutation({
        mutationFn: ({ profileData }) => updateUserProfile(authData.userId, profileData),
        onSuccess: (data) => {
            toast.success("Profile updated successfully!");
            // Update the auth data in the cache
            queryClient.setQueryData(["auth"], {
                ...authData,
                username: data.username || authData.username,
                email: data.email || authData.email,
                profilePicture: data.profilePicture || authData.profilePicture,
            });
            queryClient.invalidateQueries(["auth"]);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Failed to update profile";
            toast.error(errorMessage);
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: ({ currentPassword, newPassword }) => 
            changePassword(authData.userId, { currentPassword, newPassword }),
        onSuccess: () => {
            toast.success("Password changed successfully!");
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || "Failed to change password";
            toast.error(errorMessage);
        },
    });

    return {
        updateProfile: updateProfileMutation.mutate,
        updateProfileLoading: updateProfileMutation.isPending,
        changePassword: changePasswordMutation.mutate,
        changePasswordLoading: changePasswordMutation.isPending,
    };
}; 