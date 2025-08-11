
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  Clipboard,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { projectService } from "@/services/projectService";
import { Project } from "@/types/project";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { ProjectTasksList } from "@/pages/projects/components/ProjectTasks";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch project details
  const queryClient = useQueryClient();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProjectById(id as string),
    enabled: !!id
  });

  // Handle status change
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Project> }) => 
      projectService.updateProject(id, data),
    onSuccess: () => {
      toast({
        title: "Project updated",
        description: "Project status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update project",
        description: "There was an error updating the project status.",
      });
      console.error("Error updating project:", error);
    }
  });

  const handleStatusChange = (status: string) => {
    if (!project) return;
    updateProjectMutation.mutate({ 
      id: project.id, 
      data: { status: status as any }
    });
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "PPP");
  };

  if (isLoading) {
    return (
      <AppLayout title="Project Details">
        <div className="flex justify-center items-center h-64">
          Loading project details...
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout title="Project Not Found">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <p className="mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/projects")}>Go back to Projects</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={project.name}>
      <div className="space-y-6">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              {project.customers ? (
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" /> Client: {project.customers.name}
                </span>
              ) : (
                <span>No client assigned</span>
              )}
              <span className="text-muted-foreground mx-2">•</span>
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" /> Created: {format(new Date(project.created_at), "PP")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={project.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Project Status</SelectLabel>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <Button onClick={() => navigate("/projects/tasks/create", { state: { projectId: project.id } })}>
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </div>
        </div>
        
        {/* Project Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-muted-foreground">
                      {project.description || "No description provided"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Start Date</h3>
                      <p className="text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" /> {formatDate(project.start_date)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Due Date</h3>
                      <p className="text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" /> {formatDate(project.due_date)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Budget</h3>
                      <p className="text-muted-foreground flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" /> {project.budget ? formatCurrency(project.budget) : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Status</h3>
                      <div className="mt-1">
                        <Badge
                          variant={
                            project.status === "completed" ? "success" :
                            project.status === "in_progress" ? "info" :
                            project.status === "cancelled" ? "destructive" : 
                            "warning"
                          }
                        >
                          {project.status === "in_progress" ? "In Progress" : 
                            project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => navigate("/projects")}>
                    Back to Projects
                  </Button>
                  <Button onClick={() => navigate(`/invoices/create`, { state: { projectId: project.id } })}>
                    Create Invoice
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Tasks</div>
                    <div className="text-2xl font-bold mt-1 flex items-center">
                      <Clipboard className="h-5 w-5 mr-2 text-blue-500" /> 0
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Hours Logged</div>
                    <div className="text-2xl font-bold mt-1 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-green-500" /> 0h
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Files</div>
                    <div className="text-2xl font-bold mt-1 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-purple-500" /> 0
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-muted-foreground text-sm">Invoices</div>
                    <div className="text-2xl font-bold mt-1 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-amber-500" /> 0
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage tasks for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectTasksList projectId={project.id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  Project documentation and files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">No files uploaded</h3>
                  <p className="text-muted-foreground mt-1">
                    Upload files to share with your team or clients
                  </p>
                  <Button className="mt-4" variant="outline">
                    <Plus className="h-4 w-4 mr-1" /> Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  Invoices linked to this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">No invoices yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Generate invoices for this project's tasks
                  </p>
                  <Button className="mt-4" onClick={() => navigate(`/invoices/create`, { state: { projectId: project.id } })}>
                    <Plus className="h-4 w-4 mr-1" /> Create Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProjectDetails;
