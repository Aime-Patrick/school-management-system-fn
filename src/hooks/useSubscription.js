import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  addSubscription,
  deleteSubscription,
  getSubscription,
  addSubscriptionFeature,
  updateSubscription,
  deleteSubscriptionFeature,
  checkSubscriptionStatus,
} from "../services/api/subscriptionApi";
import { isArr } from "./useTeacher";
import { useState } from "react";
export const useSubscription = () => {
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to fetch subscription");
    },
  });

  const addSubscriptionMutation = useMutation({
    mutationFn: addSubscription,
    onSuccess: (data) => {
      toast.success(data.message || "Subscription added successfully");
      queryClient.invalidateQueries(["subscription"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to add subscription");
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: (data) => {
      toast.success(data.message || "Subscription updated successfully");
      queryClient.invalidateQueries(["subscription"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to update subscription");
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      toast.success("Subscription deleted successfully");
      queryClient.invalidateQueries(["subscription"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to delete subscription");
    },
  });

  const addSubscriptionFeatureMutation = useMutation({
    mutationFn: addSubscriptionFeature,
    onSuccess: (data) => {
      toast.success(data.message || "Subscription feature added successfully");
      queryClient.invalidateQueries(["subscription"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to add subscription feature");
    },
  });

  const deleteSubscriptionFeatureMutation = useMutation({
    mutationFn: deleteSubscriptionFeature,
    onSuccess: (data) => {
      toast.success(data.message || "Subscription feature deleted successfully");
      queryClient.invalidateQueries(["subscription"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message )|| "Failed to delete subscription feature");
    },
  });

  const checkSubscriptionStatusMutation = useMutation({
    mutationFn: checkSubscriptionStatus,
    onSuccess: (data) => {
      setIsSubscriptionActive(data.isActive);
      setSubscriptionDetails(data.plan);
      queryClient.invalidateQueries(["subscription"], { refetchActive: true });
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || "Failed to check subscription status");
    },
  });

  return {
    subscriptions: data,
    isLoading,
    error,
    isSubscriptionActive,
    subscriptionDetails,
    addSubscription: addSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    deleteSubscription: deleteSubscriptionMutation.mutate,
    addSubscriptionLoading: addSubscriptionMutation.isPending,
    addSubscriptionSuccess: addSubscriptionMutation.isSuccess,
    updateSubscriptionLoading: updateSubscriptionMutation.isPending,
    updateSubscriptionSuccess: updateSubscriptionMutation.isSuccess,
    deleteSubscriptionLoading: updateSubscriptionMutation.isPending,
    addSubscriptionFeature: addSubscriptionFeatureMutation.mutate,
    addSubscriptionFeatureLoading: addSubscriptionFeatureMutation.isPending,
    addSubscriptionFeatureSuccess: addSubscriptionFeatureMutation.isSuccess,
    deleteSubscriptionFeature: deleteSubscriptionFeatureMutation.mutate,
    deleteSubscriptionFeatureLoading: deleteSubscriptionFeatureMutation.isPending,
    deleteSubscriptionFeatureSuccess: deleteSubscriptionFeatureMutation.isSuccess,
    checkSubscriptionStatus: checkSubscriptionStatusMutation.mutate,
    checkSubscriptionStatusLoading: checkSubscriptionStatusMutation.isPending,
    checkSubscriptionStatusSuccess: checkSubscriptionStatusMutation.isSuccess,
  };
};
