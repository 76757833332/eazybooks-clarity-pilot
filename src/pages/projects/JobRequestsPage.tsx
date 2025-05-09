
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  User, 
  Flag,
  ClipboardList,
  CheckCircle,
  XCircle,
  Trash2, 
  PenLine
} from "lucide-react";
import { JobRequest } from "@/types/project";
import { projectService } from "@/services/projectService";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const JobRequestStatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    new: { label: "New", className: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" },
    approved: { label: "Approved", className: "bg-green-500/20 text-green-500 hover:bg-green-500/20" },
    rejected: { label: "Rejected", className: "bg-red-500/20 text-red-500 hover:bg-red-500/20" },
    "in_progress": { label: "In Progress", className: "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20" },
    completed: { label: "Completed", className: "bg-purple-500/20 text-purple-500 hover:bg-purple-500/20" }
  };

  const { label, className } = statusMap[status as keyof typeof statusMap] || 
    { label: status, className: "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const JobRequestPriorityBadge = ({ priority }: { priority: string | null }) => {
  if (!priority) return null;
  
  const priorityMap = {
    low: { label: "Low", className: "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" },
    medium: { label: "Medium", className: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" },
    high: { label: "High", className: "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" },
    urgent: { label: "Urgent", className: "bg-red-500/20 text-red-500 hover:bg-red-500/20" },
  };

  const { label, className } = priorityMap[priority as keyof typeof priorityMap] || 
    { label: priority, className: "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const JobRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch job requests
  const { data: jobRequests = [], isLoading, refetch } = useQuery({
    queryKey: ["jobRequests"],
    queryFn: projectService.getJobRequests,
  });

  // Delete job request
  const handleDeleteJobRequest = async (id: string) => {
    try {
      await projectService.deleteJobRequest(id);
      toast({
        title: "Job request deleted",
        description: "The job request has been removed successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting job request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job request. Please try again.",
      });
    }
  };

  // Filter job requests based on search term
  const filteredJobRequests = jobRequests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.customers?.name && request.customers.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  // Get date relative to today
  const getRelativeDateString = (dateString: string | null) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  // Handle converting job request to project
  const handleConvertToProject = (jobRequest: JobRequest) => {
    navigate(`/projects/job-requests/${jobRequest.id}`, { 
      state: { convertToProject: true } 
    });
  };

  return (
    <AppLayout title="Job Requests">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search job requests..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => navigate("/projects/job-requests/create")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Job Request
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Requests</CardTitle>
            <CardDescription>
              Manage incoming job requests from clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading job requests...</div>
            ) : filteredJobRequests.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm 
                  ? "No job requests match your search criteria." 
                  : "No job requests found. Create your first job request to get started."}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Client</TableHead>
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Priority</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobRequests.map((jobRequest) => (
                      <TableRow key={jobRequest.id} className="cursor-pointer" onClick={() => navigate(`/projects/job-requests/${jobRequest.id}`)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-2">
                              <ClipboardList size={16} />
                            </div>
                            {jobRequest.title}
                            {jobRequest.status === 'new' && (
                              <Badge variant="secondary" className="ml-2">New</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {jobRequest.customers ? (
                            <div className="flex items-center text-muted-foreground">
                              <User size={14} className="mr-1" />
                              {jobRequest.customers.name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Unknown client</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {jobRequest.due_date ? (
                            <div className="flex flex-col">
                              <div className="flex items-center text-muted-foreground">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(jobRequest.due_date)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getRelativeDateString(jobRequest.due_date)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No due date</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {jobRequest.priority ? (
                            <div className="flex items-center">
                              <Flag size={14} className="mr-1" />
                              <JobRequestPriorityBadge priority={jobRequest.priority} />
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No priority</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <JobRequestStatusBadge status={jobRequest.status} />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end items-center gap-2">
                            {jobRequest.status === 'new' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-500 border-green-500 hover:bg-green-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConvertToProject(jobRequest);
                                  }}
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Approve
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500 border-red-500 hover:bg-red-500/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    projectService.updateJobRequest(jobRequest.id, { status: 'rejected' })
                                      .then(() => {
                                        toast({
                                          title: "Job request rejected",
                                          description: "The job request has been rejected.",
                                        });
                                        refetch();
                                      });
                                  }}
                                >
                                  <XCircle size={14} className="mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/job-requests/${jobRequest.id}`);
                              }}
                            >
                              <PenLine size={16} />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Job Request</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this job request? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteJobRequest(jobRequest.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-5">
            <Button variant="outline" onClick={() => navigate("/projects")}>
              View Projects
            </Button>
            <Button onClick={() => navigate("/projects/job-requests/create")}>
              New Job Request
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default JobRequestsPage;
