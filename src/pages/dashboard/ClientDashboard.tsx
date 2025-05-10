
import React from "react";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// Import our new components
import WelcomeHeader from "@/components/dashboard/client/WelcomeHeader";
import ProjectsSection from "@/components/dashboard/client/ProjectsSection";
import InvoicesSection from "@/components/dashboard/client/InvoicesSection";
import PremiumFeaturesPromo from "@/components/dashboard/client/PremiumFeaturesPromo";

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Example data, in a real app this would come from an API
  const projects = [
    { id: 1, name: "Website Redesign", status: "In Progress", dueDate: "2023-05-30", progress: 65 },
    { id: 2, name: "Mobile App Development", status: "Planning", dueDate: "2023-07-15", progress: 20 },
  ];

  const invoices = [
    { id: "INV-001", amount: "$2,500", status: "Paid", date: "2023-04-15", downloadUrl: "#" },
    { id: "INV-002", amount: "$1,800", status: "Pending", date: "2023-05-01", downloadUrl: "#" },
  ];

  // Function to check if a feature is available based on subscription
  const isFeatureAvailable = (requiredTier: 'free' | 'premium' | 'enterprise') => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userTier = profile?.subscription_tier || 'free';
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  return (
    <AppLayout title="Client Dashboard">
      <WelcomeHeader user={user} profile={profile} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value="2"
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
        <MetricCard
          title="Pending Invoices"
          value="$1,800"
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
        <MetricCard
          title="Completed Projects"
          value="3"
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
      </div>

      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/projects/job-requests/create")}
            variant="outline"
            className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
          >
            <PlusCircle size={16} />
            New Job Request
          </Button>
          {!isFeatureAvailable('premium') && (
            <Button
              variant="outline"
              className="flex items-center gap-1 border-amber-500 text-amber-500"
              asChild
            >
              <Link to="/upgrade">
                <Lock size={16} />
                Upgrade
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsSection projects={projects} />
        <InvoicesSection invoices={invoices} />
      </div>

      <PremiumFeaturesPromo subscriptionTier={profile?.subscription_tier} />
    </AppLayout>
  );
};

export default ClientDashboard;
