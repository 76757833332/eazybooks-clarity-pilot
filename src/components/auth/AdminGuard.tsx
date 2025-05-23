
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Spinner } from '@/components/ui/spinner';

interface AdminGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  fallbackPath = "/dashboard" 
}) => {
  const { profile, loading } = useAuth();
  const { isFeatureAvailable } = useFeatureAccess();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8 text-eazybooks-purple" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Check if user has admin capabilities
  const isAdmin = isFeatureAvailable('admin_capabilities') || profile?.email === 'richndumbu@gmail.com';

  // If user isn't an admin, redirect
  if (!profile || !isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default AdminGuard;
