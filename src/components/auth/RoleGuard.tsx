
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { UserRole } from '@/types/auth';
import { Spinner } from '@/components/ui/spinner';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackPath?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  allowedRoles, 
  children, 
  fallbackPath = "/dashboard" 
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8 text-eazybooks-purple" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If user doesn't have the required role, redirect
  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default RoleGuard;
