
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8 text-eazybooks-purple" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Check if user is admin (super admin)
  // We consider users with enterprise subscription or business owners as admins
  const isAdmin = 
    profile?.subscription_tier === 'enterprise' || 
    (profile?.role === 'business_owner' && profile?.subscription_tier === 'premium') ||
    profile?.email === 'richndumbu@gmail.com'; // Special case for this specific user

  // If user isn't an admin, redirect
  if (!profile || !isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Otherwise, render children
  return <>{children}</>;
};

export default AdminGuard;
