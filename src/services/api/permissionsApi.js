import axios from '../axios';

// Get all permissions
export const getPermissions = async () => {
  try {
    const response = await axios.get('/permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// Get formatted permissions
export const getFormattedPermissions = async () => {
  try {
    const response = await axios.get('/permissions/formatted');
    return response.data;
  } catch (error) {
    console.error('Error fetching formatted permissions:', error);
    throw error;
  }
};

// Get permissions by role
export const getPermissionsByRole = async (role) => {
  try {
    const response = await axios.get(`/permissions/role/${role}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
};

// Get permissions by school
export const getPermissionsBySchool = async (schoolId) => {
  try {
    const response = await axios.get(`/permissions/school/${schoolId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching school permissions:', error);
    throw error;
  }
};

// Get my permissions
export const getMyPermissions = async () => {
  try {
    const response = await axios.get('/permissions/my-permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching my permissions:', error);
    throw error;
  }
};

// Check specific permission
export const checkPermission = async (params) => {
  try {
    const response = await axios.get('/permissions/check', { params });
    return response.data;
  } catch (error) {
    console.error('Error checking permission:', error);
    throw error;
  }
};

// Get permission by ID
export const getPermissionById = async (id) => {
  try {
    const response = await axios.get(`/permissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching permission by ID:', error);
    throw error;
  }
};

// Create new permission
export const createPermission = async (permissionData) => {
  try {
    const response = await axios.post('/permissions', permissionData);
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

// Update permission
export const updatePermission = async (id, permissionData) => {
  try {
    const response = await axios.patch(`/permissions/${id}`, permissionData);
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

// Delete permission
export const deletePermission = async (id) => {
  try {
    const response = await axios.delete(`/permissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

// Update resource permissions
export const updateResourcePermissions = async (resource, permissions) => {
  try {
    const response = await axios.patch(`/permissions/resource/${resource}`, permissions);
    return response.data;
  } catch (error) {
    console.error('Error updating resource permissions:', error);
    throw error;
  }
};

// Seed default permissions
export const seedDefaultPermissions = async () => {
  try {
    const response = await axios.post('/permissions/seed');
    return response.data;
  } catch (error) {
    console.error('Error seeding default permissions:', error);
    throw error;
  }
};

// NEW ENDPOINTS FROM IMPLEMENTATION GUIDE

// Bulk assign permissions
export const bulkAssignPermissions = async (data) => {
  try {
    const response = await axios.post('/permissions/bulk-assign', data);
    return response.data;
  } catch (error) {
    console.error('Error bulk assigning permissions:', error);
    throw error;
  }
};

// Assign permission set
export const assignPermissionSet = async (data) => {
  try {
    const response = await axios.post('/permissions/assign-set', data);
    return response.data;
  } catch (error) {
    console.error('Error assigning permission set:', error);
    throw error;
  }
};

// Copy permissions from user
export const copyPermissionsFromUser = async (data) => {
  try {
    const response = await axios.post('/permissions/copy-from-user', data);
    return response.data;
  } catch (error) {
    console.error('Error copying permissions from user:', error);
    throw error;
  }
};

// Batch operations
export const batchPermissionOperations = async (data) => {
  try {
    const response = await axios.post('/permissions/batch-operations', data);
    return response.data;
  } catch (error) {
    console.error('Error performing batch operations:', error);
    throw error;
  }
};

// Revoke permissions
export const revokePermissions = async (userId, permissions) => {
  try {
    const response = await axios.delete(`/permissions/user/${userId}/revoke`, {
      data: { permissions }
    });
    return response.data;
  } catch (error) {
    console.error('Error revoking permissions:', error);
    throw error;
  }
};

// Get user permissions
export const getUserPermissions = async (userId) => {
  try {
    const response = await axios.get(`/permissions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
};

// Get users with permissions - handles both school admin and system admin cases
export const getUsersWithPermissions = async (schoolId = null, isSystemAdmin = false) => {
  try {
    let endpoint;
    
    if (isSystemAdmin) {
      // System admin gets all users across all schools
      endpoint = '/permissions/system/users-with-permissions';
    } else if (schoolId) {
      // School admin gets users for specific school
      endpoint = `/permissions/school/${schoolId}/users-with-permissions`;
    } else {
      // Fallback for system admin without schoolId
      endpoint = '/permissions/system/users-with-permissions';
    }
    
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching users with permissions:', error);
    throw error;
  }
};

// Get available permission sets
export const getAvailablePermissionSets = async () => {
  try {
    const response = await axios.get('/permissions/available-sets');
    return response.data;
  } catch (error) {
    console.error('Error fetching available permission sets:', error);
    throw error;
  }
};

// Get data integrity issues
export const getDataIntegrityIssues = async () => {
  try {
    const response = await axios.get('/permissions/data-integrity');
    return response.data;
  } catch (error) {
    console.error('Error fetching data integrity issues:', error);
    throw error;
  }
};

// Fix data integrity issues
export const fixDataIntegrityIssues = async (assignments) => {
  try {
    const response = await axios.post('/permissions/fix-data-integrity', { assignments });
    return response.data;
  } catch (error) {
    console.error('Error fixing data integrity issues:', error);
    throw error;
  }
};
