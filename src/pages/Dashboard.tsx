
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import BusinessOwnerDashboard from "@/pages/dashboard/BusinessOwnerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-eazybooks-purple" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  // Render different dashboard based on user role
  switch (profile?.role) {
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
