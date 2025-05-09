
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import QuickActions from "@/components/dashboard/QuickActions";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InviteUserModal from "@/components/invite/InviteUserModal";

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

  return (
    <AppLayout title="Business Dashboard">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.first_name || user?.email}
        </h1>
        <p className="text-muted-foreground">
          {business?.name || "Your Business"} · Business Owner Dashboard
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Business Overview</h2>
        <Button
          onClick={() => setIsInviteModalOpen(true)}
          variant="outline"
          className="flex items-center gap-1 border-eazybooks-purple text-eazybooks-purple"
        >
          <PlusCircle size={16} />
          Invite User
        </Button>
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

      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </AppLayout>
  );
};

export default BusinessOwnerDashboard;
