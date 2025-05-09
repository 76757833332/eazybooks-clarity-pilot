import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
  Flag,
  User,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";
import { JobRequest } from "@/types/project";
import { CreateProjectInput } from "@/types/project";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const JobRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const showConvertDialog = !!location.state?.convertToProject;
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(showConvertDialog);

  // Fetch job request details
  const { data: jobRequest, isLoading, refetch } = useQuery({
    queryKey: ["jobRequest", id],
    queryFn: () => projectService.getJobRequestById(id as string),
    enabled: !!id
  });

  // Update job request mutation
  const updateJobRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<JobRequest> }) => 
      projectService.updateJobRequest(id, data),
    onSuccess: () => {
      toast({
        title: "Job request updated",
        description: "The job request has been updated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update job request",
        description: "There was an error updating the job request.",
      });
      console.error("Error updating job request:", error);
    }
  });

  // Create project from job request mutation
  const createProjectMutation = useMutation({
    mutationFn: (data: CreateProjectInput) => projectService.createProject(data),
    onSuccess: (project) => {
      if (jobRequest) {
        updateJobRequestMutation.mutate({ 
          id: jobRequest.id, 
          data: { 
            status: "approved", 
            converted_to_project: project.id 
          }
        });
        
        toast({
          title: "Project created",
          description: "A new project has been created from this job request.",
        });
        
        navigate(`/projects/${project.id}`);
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create project",
        description: "There was an error creating a project from this job request.",
      });
      console.error("Error creating project:", error);
    }
  });

  // Job request actions
  const handleApproveRequest = () => {
    setIsConvertDialogOpen(true);
  };

  const handleRejectRequest = () => {
    if (!jobRequest) return;
    updateJobRequestMutation.mutate({ 
      id: jobRequest.id, 
      data: { status: "rejected" }
    });
  };

  // Form schema for converting to project
  const formSchema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    status: z.enum(["pending", "in_progress"]).default("pending"),
    budget: z.coerce.number().optional().nullable(),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Form for convert to project dialog
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: jobRequest ? jobRequest.title : "",
      status: "pending",
      budget: null,
    },
  });

  // Handle form submission for converting to project
  const onSubmit = (data: FormValues) => {
    if (!jobRequest) return;
    
    createProjectMutation.mutate({
      name: data.name,
      description: jobRequest.description,
      client_id: jobRequest.client_id,
      status: data.status,
      budget: data.budget || null,
      start_date: new Date().toISOString().split('T')[0],
      due_date: jobRequest.due_date,
    });
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "PPP");
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string | null) => {
    if (!priority) return "default";
    
    switch (priority) {
      case "low": return "default";
      case "medium": return "info";
      case "high": return "warning";
      case "urgent": return "destructive";
      default: return "default";
    }
  };

  // Get priority label
  const getPriorityLabel = (priority: string | null) => {
    if (!priority) return "None";
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new": return "info";
      case "approved": return "success";
      case "rejected": return "destructive";
      case "in_progress": return "warning";
      case "completed": return "secondary";
      default: return "default";
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress": return "In Progress";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Job Request Details">
        <div className="flex justify-center items-center h-64">
          Loading job request details...
        </div>
      </AppLayout>
    );
  }

  if (!jobRequest) {
    return (
      <AppLayout title="Job Request Not Found">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job request not found</h2>
          <p className="mb-6">The job request you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/projects/job-requests")}>Go back to Job Requests</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={jobRequest.title}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>{jobRequest.title}</CardTitle>
                <CardDescription>
                  Job request from {jobRequest.customers?.name || "Unknown Client"}
                </CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(jobRequest.status)}>
                {getStatusLabel(jobRequest.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {jobRequest.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-1">Client</h3>
                <p className="text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-1" /> 
                  {jobRequest.customers?.name || "Unknown"}
                </p>
              </div>
              
              {jobRequest.due_date && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Due Date</h3>
                  <p className="text-muted-foreground flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> 
                    {formatDate(jobRequest.due_date)}
                  </p>
                </div>
              )}
              
              {jobRequest.priority && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Priority</h3>
                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-1" /> 
                    <Badge variant={getPriorityBadgeVariant(jobRequest.priority)}>
                      {getPriorityLabel(jobRequest.priority)}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-1">Submitted On</h3>
                <p className="text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 
                  {format(new Date(jobRequest.created_at), "PPP")}
                </p>
              </div>
            </div>
            
            {jobRequest.requested_services && jobRequest.requested_services.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Requested Services</h3>
                <div className="flex flex-wrap gap-2">
                  {jobRequest.requested_services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {jobRequest.converted_to_project && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-700 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-300">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Converted to Project</p>
                    <p className="text-sm">This job request has been converted to a project.</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => navigate(`/projects/${jobRequest.converted_to_project}`)}
                  >
                    View Project
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/projects/job-requests")}
            >
              Back to Job Requests
            </Button>
            
            {jobRequest.status === "new" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500/10"
                  onClick={handleRejectRequest}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  className="text-green-600 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400"
                  onClick={handleApproveRequest}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve & Convert to Project
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Convert to Project Dialog */}
        <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convert to Project</DialogTitle>
              <DialogDescription>
                Create a new project based on this job request.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name for the new project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the initial project status
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-7"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : parseFloat(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Set an estimated budget for the project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="pt-2">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Create Project</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default JobRequestDetails;
