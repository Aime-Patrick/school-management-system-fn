import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { isArr } from '../useTeacher';
import {
  getOverdueReport,
  getMostBorrowedReport,
  getLostDamagedReport,
  getCategoryTrendsReport,
  getMemberActivityReport,
  getFineCollectionReport,
  getBorrowingTrendsReport,
  getBookInventoryReport,
} from '../../services/api/library/reports.api';

// Get overdue report
export const useOverdueReport = () => {
  return useQuery({
    queryKey: ['library-reports', 'overdue'],
    queryFn: getOverdueReport,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch overdue report');
    },
  });
};

// Get most borrowed report
export const useMostBorrowedReport = (limit = 10) => {
  return useQuery({
    queryKey: ['library-reports', 'most-borrowed', limit],
    queryFn: () => getMostBorrowedReport(limit),
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch most borrowed report');
    },
  });
};

// Get lost/damaged report
export const useLostDamagedReport = () => {
  return useQuery({
    queryKey: ['library-reports', 'lost-damaged'],
    queryFn: getLostDamagedReport,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch lost/damaged report');
    },
  });
};

// Get category trends report
export const useCategoryTrendsReport = () => {
  return useQuery({
    queryKey: ['library-reports', 'category-trends'],
    queryFn: getCategoryTrendsReport,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch category trends report');
    },
  });
};

// Get member activity report
export const useMemberActivityReport = () => {
  return useQuery({
    queryKey: ['library-reports', 'member-activity'],
    queryFn: getMemberActivityReport,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch member activity report');
    },
  });
};

// Get fine collection report
export const useFineCollectionReport = (startDate, endDate) => {
  return useQuery({
    queryKey: ['library-reports', 'fine-collection', startDate, endDate],
    queryFn: () => getFineCollectionReport(startDate, endDate),
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch fine collection report');
    },
  });
};

// Get borrowing trends report
export const useBorrowingTrendsReport = (period = 'monthly') => {
  return useQuery({
    queryKey: ['library-reports', 'borrowing-trends', period],
    queryFn: () => getBorrowingTrendsReport(period),
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch borrowing trends report');
    },
  });
};

// Get book inventory report
export const useBookInventoryReport = () => {
  return useQuery({
    queryKey: ['library-reports', 'book-inventory'],
    queryFn: getBookInventoryReport,
    onError: (error) => {
      toast.error(isArr(error?.response?.data?.message) || 'Failed to fetch book inventory report');
    },
  });
};
