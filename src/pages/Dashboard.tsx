
import React from "react";
import { useAuth } from "@/contexts/auth";
import BusinessOwnerDashboard from "@/pages/dashboard/BusinessOwnerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="h-8 w-8 text-eazybooks-purple mx-auto mb-4" />
          <span className="text-lg">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  // If profile is still not available after loading, show a different message
  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-4">Welcome to EazyBooks!</h2>
          <p className="mb-4">Your profile is being set up. This might take a moment.</p>
          <Spinner className="h-6 w-6 text-eazybooks-purple mx-auto" />
        </div>
      </div>
    );
  }

  // Render different dashboard based on user role
  switch (profile.role) {
    case "business_owner":
      return <BusinessOwnerDashboard />;
    case "employee":
      return <EmployeeDashboard />;
    case "client":
      return <ClientDashboard />;
    default:
      // If role is not determined yet, show generic loading
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Preparing your dashboard...</p>
        </div>
      );
  }
};

export default Dashboard;
