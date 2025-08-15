import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isArr } from '../useTeacher';
import {
  getReservations,
  getReservationById,
  getPendingReservations,
  createReservation,
  updateReservation,
  cancelReservation,
  fulfillReservation,
  getMemberReservations,
  getBookReservations,
} from '../../services/api/library/reservations.api';

// Get all reservations
export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservations,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch reservations');
    },
  });
};

// Get reservation by ID
export const useReservationById = (id) => {
  return useQuery({
    queryKey: ['reservations', id],
    queryFn: () => getReservationById(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch reservation');
    },
  });
};

// Get pending reservations
export const usePendingReservations = () => {
  return useQuery({
    queryKey: ['reservations', 'pending'],
    queryFn: getPendingReservations,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch pending reservations');
    },
  });
};

// Create reservation
export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      toast.success('Reservation created successfully');
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['books']);
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to create reservation');
    },
  });
};

// Update reservation
export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateReservation,
    onSuccess: () => {
      toast.success('Reservation updated successfully');
      queryClient.invalidateQueries(['reservations']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to update reservation');
    },
  });
};

// Cancel reservation
export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      toast.success('Reservation cancelled successfully');
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['books']);
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to cancel reservation');
    },
  });
};

// Fulfill reservation
export const useFulfillReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: fulfillReservation,
    onSuccess: () => {
      toast.success('Reservation fulfilled successfully');
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['books']);
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fulfill reservation');
    },
  });
};

// Get member reservations
export const useMemberReservations = (memberId) => {
  return useQuery({
    queryKey: ['reservations', 'member', memberId],
    queryFn: () => getMemberReservations(memberId),
    enabled: !!memberId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch member reservations');
    },
  });
};

// Get book reservations
export const useBookReservations = (bookId) => {
  return useQuery({
    queryKey: ['reservations', 'book', bookId],
    queryFn: () => getBookReservations(bookId),
    enabled: !!bookId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch book reservations');
    },
  });
};
