import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, CalendarDays, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Function to check if a feature is available based on subscription
  const isFeatureAvailable = (requiredTier: 'free' | 'premium' | 'enterprise') => {
    const tierHierarchy = { 'free': 0, 'premium': 1, 'enterprise': 2 };
    const userTier = profile?.subscription_tier || 'free';
    
    return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  };

  return (
    <AppLayout title="Employee Dashboard">
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
          Employee Dashboard
        </p>
      </div>

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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-eazybooks-purple" />
                  Your Tasks
                </div>
              </CardTitle>
              <a
                href="/projects/tasks"
                className="text-sm text-eazybooks-purple hover:underline"
              >
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-10">
                      <CheckCircle
                        size={16}
                        className="text-eazybooks-purple"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-md border border-eazybooks-purple px-2 py-1 text-xs text-eazybooks-purple hover:bg-eazybooks-purple/10">
                    Start
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-eazybooks-purple" />
                  Upcoming Events
                </div>
              </CardTitle>
              <a
                href="/calendar"
                className="text-sm text-eazybooks-purple hover:underline"
              >
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-eazybooks-purple bg-opacity-10">
                      <CalendarDays
                        size={16}
                        className="text-eazybooks-purple"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <span className="text-xs text-muted-foreground">
                        {event.date}
                      </span>
                    </div>
                  </div>
                  <button className="rounded-md border border-eazybooks-purple px-2 py-1 text-xs text-eazybooks-purple hover:bg-eazybooks-purple/10">
                    Details
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
              Ask your manager to upgrade to Premium or Enterprise to unlock:
            </p>
            <ul className="list-disc ml-5 text-sm space-y-1 text-muted-foreground">
              <li>Advanced time tracking</li>
              <li>Project management tools</li>
              <li>Detailed performance metrics</li>
              <li>Automated leave management</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
};

export default EmployeeDashboard;
