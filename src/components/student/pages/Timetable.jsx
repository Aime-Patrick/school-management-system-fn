import React from "react";
import { useClassById } from "../../../hooks/useClassById";
import { useStudentById } from "../../../hooks/useStudentById";
import { useAuth } from "../../../hooks/useAuth";
import TimetableTable from "../dashboard/transformTimetable";

export const Timetable = () => {
  const { authData } = useAuth();
  const { data } = useStudentById(authData?.userId);
  const { classData, isLoading } = useClassById(data?.class?._id);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Student Timetable
      </h1>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <TimetableTable timetableData={classData.timetable} />
      </div>
    </div>
  );
};
