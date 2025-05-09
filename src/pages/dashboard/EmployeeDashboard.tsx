
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, CalendarDays } from "lucide-react";

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

  return (
    <AppLayout title="Employee Dashboard">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-bold">
          Welcome back, {profile?.first_name || user?.email}
        </h1>
        <p className="text-muted-foreground">
          Employee Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Tasks Completed"
          value="12"
          change="+3"
          positive={true}
          duration="this week"
        />
        <MetricCard
          title="Hours Logged"
          value="32.5"
          change="+5.5"
          positive={true}
          duration="this week"
        />
        <MetricCard
          title="Pending Approvals"
          value="3"
          change="-1"
          positive={true}
          duration="since yesterday"
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
    </AppLayout>
  );
};

export default EmployeeDashboard;
