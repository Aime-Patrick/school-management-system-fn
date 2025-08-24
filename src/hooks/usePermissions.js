import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPermissions, 
  getFormattedPermissions, 
  getMyPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  seedDefaultPermissions,
  // New endpoints
  bulkAssignPermissions,
  assignPermissionSet,
  copyPermissionsFromUser,
  batchPermissionOperations,
  revokePermissions,
  getUserPermissions,
  getUsersWithPermissions,
  getAvailablePermissionSets,
  getDataIntegrityIssues,
  fixDataIntegrityIssues
} from '../services/api/permissionsApi';
import { getSchools } from '../services/api/schoolApi';

// Existing hooks (keeping for backward compatibility)
export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });
};

export const useFormattedPermissions = () => {
  return useQuery({
    queryKey: ['formatted-permissions'],
    queryFn: getFormattedPermissions,
  });
};

export const useMyPermissions = () => {
  return useQuery({
    queryKey: ['my-permissions'],
    queryFn: getMyPermissions,
  });
};

// NEW HOOKS FOLLOWING IMPLEMENTATION GUIDE PATTERNS

// Get users with permissions - handles both school admin and system admin cases
export const useUsersWithPermissions = (schoolId, isSystemAdmin = false) => {
  return useQuery({
    queryKey: ['usersWithPermissions', schoolId, isSystemAdmin],
    queryFn: async () => {
      const data = await getUsersWithPermissions(schoolId, isSystemAdmin);
      return data;
    },
    enabled: true, // Always run query - handle null case in queryFn
  });
};

// Get available permission sets (cached indefinitely as they rarely change)
// Only accessible to School Administrators
export const usePermissionSets = () => {
  return useQuery({
    queryKey: ['permissionSets'],
    queryFn: async () => {
      const data = await getAvailablePermissionSets();
      return data;
    },
    staleTime: Infinity, // These rarely change, so they can be cached indefinitely
    retry: (failureCount, error) => {
      // Don't retry if it's a 403 (Forbidden) error - user doesn't have access
      if (error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Get specific user permissions
export const useUserPermissions = (userId, schoolId, isSystemAdmin = false) => {
  return useQuery({
    queryKey: ['userPermissions', userId, schoolId, isSystemAdmin],
    queryFn: async () => {
      const data = await getUserPermissions(userId);
      return data;
    },
    enabled: !!userId,
  });
};

// Get all permissions in the system
export const useAllPermissions = () => {
  return useQuery({
    queryKey: ['allPermissions'],
    queryFn: async () => {
      const data = await getPermissions();
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Get all schools in the system
export const useAllSchools = () => {
  return useQuery({
    queryKey: ['allSchools'],
    queryFn: async () => {
      const data = await getSchools();
      return data;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

// Get data integrity issues
export const useDataIntegrityIssues = () => {
  return useQuery({
    queryKey: ['data-integrity'],
    queryFn: async () => {
      const data = await getDataIntegrityIssues();
      return data;
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (integrity issues can change frequently)
  });
};

// Fix data integrity issues
export const useFixDataIntegrityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assignments) => fixDataIntegrityIssues(assignments),
    onSuccess: () => {
      queryClient.invalidateQueries(['data-integrity']);
      queryClient.invalidateQueries(['usersWithPermissions']);
    },
    onError: (error) => {
      console.error('Fix data integrity failed:', error);
    },
  });
};

// MUTATION HOOKS

// Bulk assign permissions
export const useBulkAssignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => bulkAssignPermissions(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch the users list to show the new permissions
      queryClient.invalidateQueries({ queryKey: ['usersWithPermissions'] });
      // Also invalidate specific user permissions if they were included
      if (variables.userIds) {
        variables.userIds.forEach(userId => {
          queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
        });
      }
    },
    onError: (error) => {
      console.error('Bulk assign failed:', error);
    },
  });
};

// Assign permission set
export const useAssignPermissionSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => assignPermissionSet(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usersWithPermissions'] });
      if (variables.userIds) {
        variables.userIds.forEach(userId => {
          queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
        });
      }
    },
  });
};

// Copy permissions from user
export const useCopyPermissionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => copyPermissionsFromUser(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usersWithPermissions'] });
      queryClient.invalidateQueries({ queryKey: ['userPermissions', variables.targetUserId] });
    },
  });
};

// Batch operations
export const useBatchOperationsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => batchPermissionOperations(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usersWithPermissions'] });
      // Invalidate all user permissions as batch operations might affect multiple users
      queryClient.invalidateQueries({ queryKey: ['userPermissions'] });
    },
  });
};

// Revoke permissions
export const useRevokePermissionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, permissions }) => revokePermissions(userId, permissions),
    onSuccess: (data, variables) => {
      // Immediately update the specific user's permissions in the cache
      queryClient.invalidateQueries({ queryKey: ['usersWithPermissions'] });
      queryClient.invalidateQueries({ queryKey: ['userPermissions', variables.userId] });
    },
  });
};

// Existing mutation hooks (keeping for backward compatibility)
export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
    },
  });
};

export const useSeedDefaultPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seedDefaultPermissions,
    onSuccess: () => {
      queryClient.invalidateQueries(['permissions']);
      queryClient.invalidateQueries(['formatted-permissions']);
    },
  });
};
