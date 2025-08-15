import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isArr } from '../useTeacher';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getMemberBorrowHistory,
} from '../../services/api/library/members.api';

// Get all members
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch members');
    },
  });
};

// Get member by ID
export const useMemberById = (id) => {
  return useQuery({
    queryKey: ['members', id],
    queryFn: () => getMemberById(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch member');
    },
  });
};

// Search members
export const useSearchMembers = (query) => {
  return useQuery({
    queryKey: ['members', 'search', query],
    queryFn: () => searchMembers(query),
    enabled: !!query && query.length > 2,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to search members');
    },
  });
};

// Create member
export const useCreateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast.success('Member created successfully');
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to create member');
    },
  });
};

// Update member
export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateMember,
    onSuccess: () => {
      toast.success('Member updated successfully');
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to update member');
    },
  });
};

// Delete member
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      toast.success('Member deleted successfully');
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to delete member');
    },
  });
};

// Get member borrow history
export const useMemberBorrowHistory = (memberId) => {
  return useQuery({
    queryKey: ['members', memberId, 'borrow-history'],
    queryFn: () => getMemberBorrowHistory(memberId),
    enabled: !!memberId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch member borrow history');
    },
  });
};
