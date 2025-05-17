
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import QuickActions from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { PlusCircle, Crown, Settings, Lock } from "lucide-react";
import InviteUserModal from "@/components/invite/InviteUserModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import * as incomeService from "@/services/incomeService";
import { Spinner } from "@/components/ui/spinner";

const BusinessOwnerDashboard = () => {
  const { user, profile, business, fetchUserBusiness, loading } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
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
  
  // Fetch real transactions from incomes and expenses
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["dashboard-transactions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        // Fetch recent incomes
        const incomes = await incomeService.getIncomes();
        
        // Transform to transaction format and return most recent 3
        return incomes.slice(0, 3).map(income => ({
          id: income.id,
          name: income.description || income.source,
          date: new Date(income.income_date).toLocaleDateString(),
          amount: income.amount,
          type: 'income' as const
        }));
      } catch (error) {
        console.error("Error fetching transaction data for dashboard:", error);
        return [];
      }
    },
    enabled: !!user?.id
  });

  // Check if user has admin privileges
  const isAdmin = profile?.subscription_tier === 'enterprise' || 
                  profile?.role === 'business_owner';

  // Function to get badge color based on subscription tier
  const getSubscriptionBadgeColor = () => {
    switch (profile?.subscription_tier) {
      case 'premium':
        return 'bg-amber-500';
      case 'enterprise':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to check if a feature is available based on subscription
  const isFeatureAvailable = (requiredTier: 'free' | 'premium' | 'enterprise') => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userTier = profile?.subscription_tier || 'free';
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  // Determine business display name based on available info
  const businessDisplayName = business?.name || "Your Business";
  
  // Helper to format incomplete address data
  const formatBusinessAddress = () => {
    if (!business) return null;
    
    const addressParts = [];
    if (business.city) addressParts.push(business.city);
    if (business.state) addressParts.push(business.state);
    if (business.country) addressParts.push(business.country);
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };
  
  const businessAddress = formatBusinessAddress();

  return (
    <AppLayout title="Business Dashboard">
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.first_name || user?.email?.split('@')[0] || 'User'}
          </h1>
          {profile?.subscription_tier && (
            <Badge className={getSubscriptionBadgeColor()}>
              {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
            </Badge>
          )}
        </div>
        <div className="text-muted-foreground flex flex-col">
          <p className="flex items-center gap-1">
            <span className="font-medium">{businessDisplayName}</span>
            {businessAddress && (
              <>
                <span className="mx-1">•</span>
                <span>{businessAddress}</span>
              </>
            )}
          </p>
          <p>Business Owner Dashboard</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <h2 className="text-xl font-semibold">Business Overview</h2>
        <div className="flex gap-2 flex-wrap">
          {isAdmin && (
            <Button
              variant="outline"
              className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
              asChild
            >
              <Link to="/admin/subscriptions">
                <Crown size={16} />
                Manage Subscriptions
              </Link>
            </Button>
          )}
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            variant="outline"
            className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
          >
            <PlusCircle size={16} />
            Invite User
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
            asChild
          >
            <Link to="/settings/business">
              <Settings size={16} />
              Business Settings
            </Link>
          </Button>
          {!isFeatureAvailable('premium') && (
            <Button
              variant="outline"
              className="flex items-center gap-1 border-amber-500 text-amber-500"
              asChild
            >
              <Link to="/upgrade">
                <Lock size={16} />
                Upgrade Plan
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Business Information Card */}
      {business ? (
        <Card className="mb-8 border-eazybooks-purple/10 bg-eazybooks-purple/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {business.industry && (
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{business.industry}</p>
              </div>
            )}
            {business.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{business.phone}</p>
              </div>
            )}
            {business.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{business.email}</p>
              </div>
            )}
            {business.website && (
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium">
                  <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-eazybooks-purple hover:underline">
                    {business.website}
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-amber-300/30 bg-amber-50/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Complete Your Business Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Add your business details to customize your dashboard and documents</p>
            <Button 
              className="bg-eazybooks-purple hover:bg-eazybooks-purple/90" 
              asChild
            >
              <Link to="/settings/business">
                <Settings className="mr-2 h-4 w-4" />
                Set Up Business Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Use real data or placeholder values */}
        <MetricCard
          title="Total Revenue"
          value="$0.00"
          changeValue="0%"
          changeDirection="up"
          latestDate="this month"
        />
        <MetricCard
          title="Outstanding Invoices"
          value="$0.00"
          changeValue="0%"
          changeDirection="down"
          latestDate="since last month"
        />
        <MetricCard
          title="Team Members"
          value="1"
          changeValue="0"
          changeDirection="up"
          latestDate="this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentTransactions transactions={transactions} />
        </div>
      </div>

      {!isFeatureAvailable('premium') && (
        <Card className="mt-6 border-amber-500/30 bg-amber-50/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock size={18} className="text-amber-500" />
              <span className="text-amber-700">Premium Features Locked</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to Premium or Enterprise to unlock advanced features:
            </p>
            <ul className="list-disc ml-5 text-sm space-y-1 text-muted-foreground">
              <li>Advanced reporting and analytics</li>
              <li>Payroll management</li>
              <li>AI-powered financial insights</li>
              <li>Unlimited team members</li>
              <li>Priority support</li>
            </ul>
            <Button 
              className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              asChild
            >
              <Link to="/upgrade">
                Upgrade Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </AppLayout>
  );
};

export default BusinessOwnerDashboard;
