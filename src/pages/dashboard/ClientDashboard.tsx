
import React from "react";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoice";

// Import our components
import WelcomeHeader from "@/components/dashboard/client/WelcomeHeader";
import ProjectsSection from "@/components/dashboard/client/ProjectsSection";
import InvoicesSection from "@/components/dashboard/client/InvoicesSection";
import PremiumFeaturesPromo from "@/components/dashboard/client/PremiumFeaturesPromo";

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { isFeatureAvailable } = useFeatureAccess();

  // Fetch real projects data - for now using empty array until projects API is implemented
  const projects = [];

  // Fetch real invoices data
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["dashboard-invoices", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const data = await invoiceService.getInvoices(user.id);
        return data.slice(0, 3).map(invoice => ({
          id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: `$${invoice.total_amount.toFixed(2)}`,
          status: invoice.status,
          date: new Date(invoice.issue_date).toLocaleDateString()
        }));
      } catch (error) {
        console.error("Error fetching invoice data for dashboard:", error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  return (
    <AppLayout title="Client Dashboard">
      <WelcomeHeader user={user} profile={profile} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value={projects.length.toString()}
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
        <MetricCard
          title="Pending Invoices"
          value={invoices.filter(inv => inv.status === "sent" || inv.status === "overdue").length.toString()}
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
        <MetricCard
          title="Completed Projects"
          value="0"
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
        <InvoicesSection invoices={invoices} isLoading={isLoadingInvoices} />
      </div>

      <PremiumFeaturesPromo />
    </AppLayout>
  );
};

export default ClientDashboard;
