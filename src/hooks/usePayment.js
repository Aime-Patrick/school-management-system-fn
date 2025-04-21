import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { isArr } from "./useTeacher";
import { recordPayment, getRecordPayment } from "../services/api/paymentApi";
import { useEffect } from "react";

export const usePayment = () =>{
    const queryClient=useQueryClient();

    const {data, isLoading, error}=useQuery({
        queryKey:["payment"],
        queryFn:getRecordPayment,
    })

    const recordPaymentMutation =useMutation({
        mutationFn:recordPayment,
        onSuccess:(data)=>{
            toast.success(isArr(data.message))
            queryClient.invalidateQueries("payment");
        },
        onError:(error)=>{
            toast.error(isArr(error?.response?.data?.message))
        }
    })

    useEffect(()=>{
        if (error) {
            toast.error(isArr(error?.response?.data?.message))
        }
    },[error])

    return {
        payments:data,
        isLoading,
        addPaymentRecord:recordPaymentMutation.mutate,
        addPaymentRecordLoading:recordPaymentMutation.isPending,
        addPaymentRecordSuccess:recordPaymentMutation.isSuccess,
    }

}