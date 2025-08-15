import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../services/axios';

export const useSchoolStaff = () => {
  return useQuery({
    queryKey: ['schoolStaff'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/users/school-staff');
      return data;
    },
  });
};

export const useCreateLibrarian = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/users/librarian', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['schoolStaff']);
    },
  });
};

export const useCreateAccountant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/users/accountant', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['schoolStaff']);
    },
  });
};
