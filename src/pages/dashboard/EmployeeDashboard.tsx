
import React from "react";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import WelcomeHeader from "@/components/dashboard/employee/WelcomeHeader";
import TaskList from "@/components/dashboard/employee/TaskList";
import EventList from "@/components/dashboard/employee/EventList";
import PremiumFeaturePromo from "@/components/dashboard/employee/PremiumFeaturePromo";
import { getPriorityColor, isFeatureAvailable } from "@/components/dashboard/employee/dashboardUtils";

const EmployeeDashboard = () => {
  const { user, profile } = useAuth();

  // Example data, in a real app this would come from an API
  const tasks = [
    { id: 1, title: "Complete project proposal", priority: "high", dueDate: "2023-05-15" },
    { id: 2, title: "Review client feedback", priority: "medium", dueDate: "2023-05-14" },
    { id: 3, title: "Submit expense reports", priority: "medium", dueDate: "2023-05-16" },
    { id: 4, title: "Team meeting", priority: "low", dueDate: "2023-05-13" },
  ];

  const upcomingEvents = [
    { id: 1, title: "Weekly Team Meeting", date: "2023-05-12 10:00 AM" },
    { id: 2, title: "Client Presentation", date: "2023-05-15 2:30 PM" },
    { id: 3, title: "Project Deadline", date: "2023-05-20" },
  ];

  return (
    <AppLayout title="Employee Dashboard">
      <WelcomeHeader 
        firstName={profile?.first_name}
        email={user?.email}
        subscriptionTier={profile?.subscription_tier}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Tasks Completed"
          value="12"
          changeValue="+3"
          changeDirection="up"
          latestDate="this week"
        />
        <MetricCard
          title="Hours Logged"
          value="32.5"
          changeValue="+5.5"
          changeDirection="up"
          latestDate="this week"
        />
        <MetricCard
          title="Pending Approvals"
          value="3"
          changeValue="-1"
          changeDirection="down"
          latestDate="since yesterday"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList tasks={tasks} getPriorityColor={getPriorityColor} />
        <EventList events={upcomingEvents} />
      </div>

      <PremiumFeaturePromo />
    </AppLayout>
  );
};

export default EmployeeDashboard;
