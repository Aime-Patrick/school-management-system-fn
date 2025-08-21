// Centralized permissions configuration
export const PERMISSIONS = {
  // Fee Categories permissions
  FEE_CATEGORIES: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // Fee Structures permissions
  FEE_STRUCTURES: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // Students permissions
  STUDENTS: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher'],
  },
  
  // Teachers permissions
  TEACHERS: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // Classes permissions
  CLASSES: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // Courses permissions
  COURSES: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // Academic permissions
  ACADEMIC: {
    CREATE: ['school-admin', 'system-admin'],
    UPDATE: ['school-admin', 'system-admin'],
    DELETE: ['school-admin', 'system-admin'],
    VIEW: ['school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // Library permissions
  LIBRARY: {
    CREATE: ['librarian', 'school-admin', 'system-admin'],
    UPDATE: ['librarian', 'school-admin', 'system-admin'],
    DELETE: ['librarian', 'school-admin', 'system-admin'],
    VIEW: ['librarian', 'school-admin', 'system-admin', 'teacher', 'student'],
  },
  
  // System permissions
  SYSTEM: {
    CREATE: ['system-admin'],
    UPDATE: ['system-admin'],
    DELETE: ['system-admin'],
    VIEW: ['system-admin'],
  },
};

// Helper function to check if user has permission
export const hasPermission = (userRole, resource, action) => {
  if (!userRole || !resource || !action) return false;
  
  const permissions = PERMISSIONS[resource];
  if (!permissions) return false;
  
  const allowedRoles = permissions[action];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
};

// Helper function to check multiple permissions
export const hasAnyPermission = (userRole, resource, actions) => {
  return actions.some(action => hasPermission(userRole, resource, action));
};

// Helper function to check all permissions
export const hasAllPermissions = (userRole, resource, actions) => {
  return actions.every(action => hasPermission(userRole, resource, action));
};

// Helper function to get allowed actions for a user and resource
export const getAllowedActions = (userRole, resource) => {
  if (!userRole || !resource) return [];
  
  const permissions = PERMISSIONS[resource];
  if (!permissions) return [];
  
  return Object.keys(permissions).filter(action => 
    permissions[action].includes(userRole)
  );
};

// New: Dynamic permission checking - checks if user can perform any actions
export const canPerformAnyAction = (userRole, resource, actions = ['CREATE', 'UPDATE', 'DELETE']) => {
  return hasAnyPermission(userRole, resource, actions);
};

// New: Check if user has any management capabilities (CREATE, UPDATE, DELETE)
export const hasManagementAccess = (userRole, resource) => {
  return canPerformAnyAction(userRole, resource, ['CREATE', 'UPDATE', 'DELETE']);
};

// New: Check if user has read-only access
export const hasReadOnlyAccess = (userRole, resource) => {
  return hasPermission(userRole, resource, 'VIEW') && !hasManagementAccess(userRole, resource);
};

// New: Get UI configuration based on user permissions for a resource
export const getResourceUIConfig = (userRole, resource) => {
  if (!userRole || !resource) return {};
  
  const permissions = PERMISSIONS[resource];
  if (!permissions) return {};
  
  return {
    canCreate: permissions.CREATE?.includes(userRole) || false,
    canUpdate: permissions.UPDATE?.includes(userRole) || false,
    canDelete: permissions.DELETE?.includes(userRole) || false,
    canView: permissions.VIEW?.includes(userRole) || false,
    hasManagementAccess: hasManagementAccess(userRole, resource),
    hasReadOnlyAccess: hasReadOnlyAccess(userRole, resource),
    allowedActions: getAllowedActions(userRole, resource)
  };
};
