import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import { Spin } from 'antd';

/**
 * PermissionWrapper component that conditionally renders children based on user permissions
 * 
 * @param {Object} props
 * @param {string} props.resource - The resource to check permissions for (e.g., 'FEE_CATEGORIES')
 * @param {string|string[]} props.action - The action(s) to check (e.g., 'CREATE', ['UPDATE', 'DELETE'])
 * @param {string} props.checkType - 'any' (default) or 'all' - for multiple actions
 * @param {React.ReactNode} props.children - Content to render if permission is granted
 * @param {React.ReactNode} props.fallback - Content to render if permission is denied (optional)
 * @param {boolean} props.showLoading - Whether to show loading spinner while checking permissions
 */
const PermissionWrapper = ({ 
  resource, 
  action, 
  checkType = 'any',
  children, 
  fallback = null,
  showLoading = false 
}) => {
  const { authData } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

  // Show loading if permissions are still being fetched
  if (isLoading && showLoading) {
    return <Spin size="small" />;
  }

  // Return fallback if not authenticated
  if (!authData?.isAuthenticated || !authData?.role) {
    return fallback;
  }

  let hasAccess = false;

  if (Array.isArray(action)) {
    // Multiple actions
    if (checkType === 'all') {
      hasAccess = hasAllPermissions(authData.role, resource, action);
    } else {
      hasAccess = hasAnyPermission(authData.role, resource, action);
    }
  } else {
    // Single action
    hasAccess = hasPermission(authData.role, resource, action);
  }

  return hasAccess ? children : fallback;
};

export default PermissionWrapper;
