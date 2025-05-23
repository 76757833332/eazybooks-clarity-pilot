
import React, { useState, useEffect } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import { useAuth } from "@/contexts/auth";
import { formatCurrency } from "@/lib/utils";

const BusinessMetricsSection: React.FC = () => {
  const { business } = useAuth();
  const [currency, setCurrency] = useState<string>("USD");
  
  // Update currency when business data changes
  useEffect(() => {
    if (business?.currency) {
      setCurrency(business.currency);
    }
  }, [business]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(0, currency)}
        changeValue="0%"
        changeDirection="up"
        latestDate="this month"
      />
      <MetricCard
        title="Outstanding Invoices"
        value={formatCurrency(0, currency)}
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
  );
};

export default BusinessMetricsSection;
