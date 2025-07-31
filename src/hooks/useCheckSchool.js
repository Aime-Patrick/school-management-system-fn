import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {  isSchoolAdminRegisteredSchool,  } from "../services/api/schoolApi";
import { useState, useEffect } from "react";

export const useCheckSchool = () => {
    const [schoolId,setSchoolId] = useState()
    const {data, isLoading, error} = useQuery({
        queryKey: ["school-admin", "has-school"],
        queryFn: isSchoolAdminRegisteredSchool,
    });

    useEffect(() => {
        if (data?.schoolId) {
          setSchoolId(data.schoolId);
        }
      }, [data]);

      useEffect(() => {
        if (error) {
          toast.error(error?.response?.data?.message || "Server error");
        }
      }, [error]);

      return {
        data,
        isLoading,
        error,
        schoolId,
    }
}