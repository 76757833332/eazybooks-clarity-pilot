
import React from "react";
import MetricCard from "@/components/dashboard/MetricCard";

const BusinessMetricsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
  );
};

export default BusinessMetricsSection;
