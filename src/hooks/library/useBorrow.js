import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isArr } from '../useTeacher';
import {
  getBorrowTransactions,
  getBorrowTransactionById,
  getActiveBorrows,
  getOverdueBorrows,
  createBorrowTransaction,
  returnBook,
  extendDueDate,
  markAsLost,
  getMemberBorrows,
  getBookBorrows,
} from '../../services/api/library/borrow.api';

// Get all borrow transactions
export const useBorrowTransactions = () => {
  return useQuery({
    queryKey: ['borrow-transactions'],
    queryFn: getBorrowTransactions,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch borrow transactions');
    },
  });
};

// Get borrow transaction by ID
export const useBorrowTransactionById = (id) => {
  return useQuery({
    queryKey: ['borrow-transactions', id],
    queryFn: () => getBorrowTransactionById(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch borrow transaction');
    },
  });
};

// Get active borrows
export const useActiveBorrows = () => {
  return useQuery({
    queryKey: ['borrow-transactions', 'active'],
    queryFn: getActiveBorrows,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch active borrows');
    },
  });
};

// Get overdue borrows
export const useOverdueBorrows = () => {
  return useQuery({
    queryKey: ['borrow-transactions', 'overdue'],
    queryFn: getOverdueBorrows,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch overdue borrows');
    },
  });
};

// Create borrow transaction
export const useCreateBorrowTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBorrowTransaction,
    onSuccess: () => {
      toast.success('Book borrowed successfully');
      queryClient.invalidateQueries(['borrow-transactions']);
      queryClient.invalidateQueries(['books']);
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to borrow book');
    },
  });
};

// Return book
export const useReturnBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: returnBook,
    onSuccess: () => {
      toast.success('Book returned successfully');
      queryClient.invalidateQueries(['borrow-transactions']);
      queryClient.invalidateQueries(['books']);
      queryClient.invalidateQueries(['members']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to return book');
    },
  });
};

// Extend due date
export const useExtendDueDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ borrowId, newDueDate }) =>
      extendDueDate(borrowId, newDueDate),
    onSuccess: () => {
      toast.success('Due date extended successfully');
      queryClient.invalidateQueries(['borrow-transactions']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to extend due date');
    },
  });
};

// Mark book as lost
export const useMarkAsLost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ borrowId, notes }) =>
      markAsLost(borrowId, notes),
    onSuccess: () => {
      toast.success('Book marked as lost');
      queryClient.invalidateQueries(['borrow-transactions']);
      queryClient.invalidateQueries(['books']);
    },
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to mark book as lost');
    },
  });
};

// Get member borrows
export const useMemberBorrows = (memberId) => {
  return useQuery({
    queryKey: ['borrow-transactions', 'member', memberId],
    queryFn: () => getMemberBorrows(memberId),
    enabled: !!memberId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch member borrows');
    },
  });
};

// Get book borrows
export const useBookBorrows = (bookId) => {
  return useQuery({
    queryKey: ['borrow-transactions', 'book', bookId],
    queryFn: () => getBookBorrows(bookId),
    enabled: !!bookId,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch book borrows');
    },
  });
};
