import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isArr } from '../useTeacher';
import {
  getFines,
  getFineById,
  getUnpaidFines,
  getPaidFines,
  createFine,
  updateFine,
  payFine,
  waiveFine,
  getMemberFines,
  getBookFines,
  calculateOverdueFine,

} from '../../services/api/library/fines.api';

// Get all fines
export const useFines = () => {
  return useQuery({
    queryKey: ['fines'],
    queryFn: getFines,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch fines');
    },
  });
};

// Get fine by ID
export const useFineById = (id) => {
  return useQuery({
    queryKey: ['fines', id],
    queryFn: () => getFineById(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch fine');
    },
  });
};

// Get unpaid fines
export const useUnpaidFines = () => {
  return useQuery({
    queryKey: ['fines', 'unpaid'],
    queryFn: getUnpaidFines,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch unpaid fines');
    },
  });
};

// Get paid fines
export const usePaidFines = () => {
  return useQuery({
    queryKey: ['fines', 'paid'],
    queryFn: getPaidFines,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch paid fines');
    },
  });
};

// Create fine
export const useCreateFine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFine,
    onSuccess: () => {
      toast.success('Fine created successfully');
      queryClient.invalidateQueries(['fines']);
      queryClient.invalidateQueries(['borrow-transactions']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to create fine');
    },
  });
};

// Update fine
export const useUpdateFine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFine,
    onSuccess: () => {
      toast.success('Fine updated successfully');
      queryClient.invalidateQueries(['fines']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to update fine');
    },
  });
};

// Pay fine
export const usePayFine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: payFine,
    onSuccess: () => {
      toast.success('Fine paid successfully');
      queryClient.invalidateQueries(['fines']);
      queryClient.invalidateQueries(['borrow-transactions']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to pay fine');
    },
  });
};

// Waive fine
export const useWaiveFine = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ fineId, waivedBy, notes }) =>
      waiveFine(fineId, waivedBy, notes),
    onSuccess: () => {
      toast.success('Fine waived successfully');
      queryClient.invalidateQueries(['fines']);
      queryClient.invalidateQueries(['borrow-transactions']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to waive fine');
    },
  });
};

// Get member fines
export const useMemberFines = (memberId) => {
  return useQuery({
    queryKey: ['fines', 'member', memberId],
    queryFn: () => getMemberFines(memberId),
    enabled: !!memberId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch member fines');
    },
  });
};

// Get book fines
export const useBookFines = (bookId) => {
  return useQuery({
    queryKey: ['fines', 'book', bookId],
    queryFn: () => getBookFines(bookId),
    enabled: !!bookId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch book fines');
    },
  });
};

// Calculate overdue fine
export const useCalculateOverdueFine = (borrowId) => {
  return useQuery({
    queryKey: ['fines', 'calculate-overdue', borrowId],
    queryFn: () => calculateOverdueFine(borrowId),
    enabled: !!borrowId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to calculate overdue fine');
    },
  });
};
