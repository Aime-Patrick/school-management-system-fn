import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isArr } from '../useTeacher';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from '../../services/api/library/books.api';

// Get all books
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: getBooks,
  });
};

// Get book by ID
export const useBookById = (id) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => getBookById(id),
    enabled: !!id,
  });
};

// Search books
export const useSearchBooks = (query) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => searchBooks(query),
    enabled: !!query && query.length > 2,
  });
};

// Create book
export const useCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      toast.success('Book created successfully');
      queryClient.invalidateQueries(['books']);
    },
  });
};

// Update book
export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      toast.success('Book updated successfully');
      queryClient.invalidateQueries(['books']);
    },
  });
};

// Delete book
export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast.success('Book deleted successfully');
      queryClient.invalidateQueries(['books']);
    },
  });
};
