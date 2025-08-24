import { useQuery } from '@tanstack/react-query';
import { getFeeStructures } from '../services/api/feesApi';
import { getClass } from '../services/api/classApi';
import { getStudentBySchool } from '../services/api/studentApi';

export const useAutoAssignData = () => {
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
    queryFn: getClass,
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
  const feeStructures = Array.isArray(feeStructuresResponse) 
    ? feeStructuresResponse 
    : feeStructuresResponse?.data || [];

  // Process classes data
  const classes = Array.isArray(classesResponse) 
    ? classesResponse 
    : classesResponse?.data || [];

  // Process students data
  const students = Array.isArray(studentsResponse) 
    ? studentsResponse 
    : studentsResponse?.data || [];

  return {
    feeStructures,
    classes,
    students,
    isLoading: feeStructuresLoading || classesLoading || studentsLoading,
    error: feeStructuresError || classesError || studentsError,
  };
};
