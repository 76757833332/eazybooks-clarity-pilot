
import React from "react";
import { useAuth } from "@/contexts/auth";
import BusinessOwnerDashboard from "@/pages/dashboard/BusinessOwnerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Dashboard = () => {
  const { profile, loading, business } = useAuth();

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

  // If profile is still not available after loading, show a setup message
  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 border border-gray-200 rounded-lg shadow-sm bg-white max-w-md">
          <h2 className="text-xl font-bold mb-4">Welcome to EazyBooks!</h2>
          <p className="mb-6">It looks like your profile isn't fully set up yet. Let's get you started.</p>
          <Button 
            className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
            asChild
          >
            <Link to="/settings/profile">
              <Settings className="mr-2 h-4 w-4" />
              Set Up Your Profile
            </Link>
          </Button>
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
          <div className="text-center">
            <p className="mb-4">Preparing your dashboard...</p>
            <p className="text-sm text-muted-foreground">Role: {profile.role || "unknown"}</p>
          </div>
        </div>
      );
  }
};

export default Dashboard;
