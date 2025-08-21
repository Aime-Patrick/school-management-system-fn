import React from 'react';
import { hasPermission } from '../../utils/permissions';

const PermissionGuard = ({ 
  userRole, 
  resource, 
  action, 
  children, 
  fallback = null,
  requireAll = false,
  actions = []
}) => {
  // Single permission check
  if (action && resource) {
    return hasPermission(userRole, resource, action) ? children : fallback;
  }
  
  // Multiple actions check (requireAll = true means ALL permissions must be present)
  if (actions.length > 0 && resource) {
    if (requireAll) {
      const hasAll = actions.every(act => hasPermission(userRole, resource, act));
      return hasAll ? children : fallback;
    } else {
      const hasAny = actions.some(act => hasPermission(userRole, resource, act));
      return hasAny ? children : fallback;
    }
  }
  
  // No valid permission check
  return fallback;
};

export default PermissionGuard;
