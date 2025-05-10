import React from "react";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Clock, Package, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Example data, in a real app this would come from an API
  const projects = [
    { id: 1, name: "Website Redesign", status: "In Progress", dueDate: "2023-05-30", progress: 65 },
    { id: 2, name: "Mobile App Development", status: "Planning", dueDate: "2023-07-15", progress: 20 },
  ];

  const invoices = [
    { id: "INV-001", amount: "$2,500", status: "Paid", date: "2023-04-15", downloadUrl: "#" },
    { id: "INV-002", amount: "$1,800", status: "Pending", date: "2023-05-01", downloadUrl: "#" },
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

  const getProjectStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-500";
      case "in progress":
        return "text-blue-500";
      case "planning":
        return "text-amber-500";
      default:
        return "text-gray-500";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "pending":
        return "text-amber-500";
      case "overdue":
        return "text-red-500";
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
    <AppLayout title="Client Dashboard">
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
          Client Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Active Projects"
          value="2"
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
        <MetricCard
          title="Pending Invoices"
          value="$1,800"
          changeValue=""
          changeDirection="up"
          latestDate=""
        />
        <MetricCard
          title="Completed Projects"
          value="3"
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <Package size={18} className="text-eazybooks-purple" />
                  Current Projects
                </div>
              </CardTitle>
              <a
                href="/projects"
                className="text-sm text-eazybooks-purple hover:underline"
              >
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{project.name}</h3>
                      <span
                        className={`text-xs font-medium ${getProjectStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-eazybooks-purple"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-xs text-eazybooks-purple hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active projects</p>
                  <Button
                    onClick={() => navigate("/projects/job-requests/create")}
                    variant="link"
                    className="mt-2 text-eazybooks-purple"
                  >
                    Request a new job
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-eazybooks-purple" />
                  Recent Invoices
                </div>
              </CardTitle>
              <a
                href="/invoices"
                className="text-sm text-eazybooks-purple hover:underline"
              >
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-eazybooks-purple" />
                        <h3 className="font-medium">{invoice.id}</h3>
                      </div>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-sm">{invoice.amount}</span>
                        <span className="text-xs text-muted-foreground">
                          {invoice.date}
                        </span>
                        <span
                          className={`text-xs font-medium ${getInvoiceStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {invoice.status === "Pending" && (
                        <Button
                          size="sm"
                          className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                        >
                          Pay Now
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-eazybooks-purple text-eazybooks-purple"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No invoices yet</p>
                </div>
              )}
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
              Upgrade to Premium or Enterprise to unlock:
            </p>
            <ul className="list-disc ml-5 text-sm space-y-1 text-muted-foreground">
              <li>Unlimited project requests</li>
              <li>Priority project handling</li>
              <li>Custom project templates</li>
              <li>Advanced project reporting</li>
              <li>Dedicated account manager</li>
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
    </AppLayout>
  );
};

export default ClientDashboard;
