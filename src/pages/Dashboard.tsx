
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import BusinessOwnerDashboard from "@/pages/dashboard/BusinessOwnerDashboard";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";
import ClientDashboard from "@/pages/dashboard/ClientDashboard";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { profile, loading, business, user } = useAuth();

  // Effect to log authentication status for debugging
  useEffect(() => {
    if (user && !profile) {
      console.log("User authenticated but profile not loaded yet:", user.id);
    } else if (profile) {
      console.log("Profile loaded successfully:", profile.id, "Role:", profile.role);
    }
  }, [user, profile]);

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

  // If user is authenticated but profile is not available, show a setup message
  if (user && !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 border border-gray-200 rounded-lg shadow-sm bg-white max-w-md">
          <h2 className="text-xl font-bold mb-4">Welcome to EazyBooks!</h2>
          <p className="mb-2">We're setting up your profile. This usually takes just a moment.</p>
          <p className="mb-6 text-sm text-muted-foreground">If this message persists, you may need to set up your profile manually.</p>
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

  // Check if profile has first and last name set
  const profileIncomplete = profile && (!profile.first_name || !profile.last_name);
  if (profileIncomplete) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 border border-gray-200 rounded-lg shadow-sm bg-white max-w-md">
          <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
          <p className="mb-6">Please complete your profile information to continue.</p>
          <Button 
            className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
            asChild
          >
            <Link to="/settings/profile">
              <Settings className="mr-2 h-4 w-4" />
              Complete Profile
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Render different dashboard based on user role
  if (profile) {
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
              <Button 
                className="mt-4 bg-eazybooks-purple hover:bg-eazybooks-purple/90"
                asChild
              >
                <Link to="/settings/profile">
                  Update Profile
                </Link>
              </Button>
            </div>
          </div>
        );
    }
  }

  // Fallback for cases where there might be issues with profile data
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center p-8 border border-gray-200 rounded-lg shadow-sm bg-white max-w-md">
        <h2 className="text-xl font-bold mb-4">Welcome to EazyBooks</h2>
        <p className="mb-6">Unable to load your profile. Please try again or set up your profile.</p>
        <Button 
          className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
          asChild
        >
          <Link to="/settings/profile">
            <Settings className="mr-2 h-4 w-4" />
            Set Up Profile
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
