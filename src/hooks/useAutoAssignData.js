import { useQuery } from '@tanstack/react-query';
import { getFeeStructures } from '../services/api/feesApi';
import { getStudentBySchool } from '../services/api/studentApi';
import { getClassBySchoolId } from '../services/api/classApi';

export const useAutoAssignData = (schoolId) => {
  // Fetch fee structures
  const { 
    data: feeStructuresResponse, 
    isLoading: feeStructuresLoading,
    error: feeStructuresError 
  } = useQuery({
    queryKey: ['fee-structures'],
    queryFn: getFeeStructures,
  });

  // Fetch classes
  const { 
    data: classesResponse, 
    isLoading: classesLoading,
    error: classesError 
  } = useQuery({
    queryKey: ['classes'],
    queryFn: () => getClassBySchoolId(schoolId),
  });

  // Fetch students
  const { 
    data: studentsResponse, 
    isLoading: studentsLoading,
    error: studentsError 
  } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentBySchool,
  });

  // Process fee structures data
  const feeStructures = Array.isArray(feeStructuresResponse?.data) 
    ? feeStructuresResponse.data 
    : Array.isArray(feeStructuresResponse) 
      ? feeStructuresResponse 
      : [];

  // Process classes data
  const classes = Array.isArray(classesResponse?.data) 
    ? classesResponse.data 
    : Array.isArray(classesResponse) 
      ? classesResponse 
      : [];

  // Process students data
  const students = Array.isArray(studentsResponse?.data) 
    ? studentsResponse.data 
    : Array.isArray(studentsResponse) 
      ? studentsResponse 
      : [];

  return {
    feeStructures,
    classes,
    students,
    isLoading: feeStructuresLoading || classesLoading || studentsLoading,
    error: feeStructuresError || classesError || studentsError,
  };
};
