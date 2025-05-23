
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Spinner } from "@/components/ui/spinner";
import InviteUserModal from "@/components/invite/InviteUserModal";
import BusinessWelcomeHeader from "@/components/dashboard/business/BusinessWelcomeHeader";
import BusinessInfoCard from "@/components/dashboard/business/BusinessInfoCard";
import BusinessMetricsSection from "@/components/dashboard/business/BusinessMetricsSection";
import BusinessChartsSection from "@/components/dashboard/business/BusinessChartsSection";
import PremiumFeaturesPromo from "@/components/dashboard/business/PremiumFeaturesPromo";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

const BusinessOwnerDashboard = () => {
  const { user, profile, business, fetchUserBusiness, loading } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { isFeatureAvailable } = useFeatureAccess();
  
  // Re-fetch business data when component mounts to ensure latest data
  useEffect(() => {
    if (profile?.belongs_to_business_id && !business) {
      fetchUserBusiness(profile.belongs_to_business_id);
    }
  }, [profile?.belongs_to_business_id, fetchUserBusiness, business]);
  
  // Show loading state while fetching business data
  if (loading) {
    return (
      <AppLayout title="Business Dashboard">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <Spinner className="h-8 w-8 text-eazybooks-purple mx-auto mb-4" />
            <p>Loading business data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Business Dashboard">
      <BusinessWelcomeHeader onOpenInviteModal={() => setIsInviteModalOpen(true)} />
      <BusinessInfoCard business={business} />
      <BusinessMetricsSection />
      <BusinessChartsSection />
      <PremiumFeaturesPromo />

      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </AppLayout>
  );
};

export default BusinessOwnerDashboard;
