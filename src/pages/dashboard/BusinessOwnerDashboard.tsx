
import React, { useState } from "react";
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

const BusinessOwnerDashboard = () => {
  const { user, profile, business } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Sample transactions
  const transactions = [
    {
      id: '1',
      name: 'Client Payment',
      date: 'Today, 2:30 PM',
      amount: 1250.00,
      type: 'income' as const
    },
    {
      id: '2',
      name: 'Software Subscription',
      date: 'Today, 10:15 AM',
      amount: 49.99,
      type: 'expense' as const
    },
    {
      id: '3',
      name: 'Consulting Fee',
      date: 'Yesterday',
      amount: 750.00,
      type: 'income' as const
    }
  ];

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

  return (
    <AppLayout title="Business Dashboard">
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.first_name || user?.email}
          </h1>
          {profile?.subscription_tier && (
            <Badge className={getSubscriptionBadgeColor()}>
              {profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          {business?.name || "Your Business"} · Business Owner Dashboard
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <h2 className="text-xl font-semibold">Business Overview</h2>
        <div className="flex gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value="$24,320.50"
          changeValue="+12.5%"
          changeDirection="up"
          latestDate="this month"
        />
        <MetricCard
          title="Outstanding Invoices"
          value="$8,540.25"
          changeValue="+5.2%"
          changeDirection="down"
          latestDate="since last month"
        />
        <MetricCard
          title="Team Members"
          value="12"
          changeValue="+2"
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
