
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  CalendarIcon,
  Clock,
  FileText,
  MessageCircle,
  Play,
  Square,
  CheckCircle,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { projectService } from "@/services/projectService";
import { Task } from "@/types/project";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  // Fetch task details
  const { data: task, isLoading, refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: () => projectService.getTaskById(id as string),
    enabled: !!id
  });

  // Handle status change
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Task> }) => 
      projectService.updateTask(id, data),
    onSuccess: () => {
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: "There was an error updating the task.",
      });
      console.error("Error updating task:", error);
    }
  });

  const handleStatusChange = (status: string) => {
    if (!task) return;
    updateTaskMutation.mutate({ 
      id: task.id, 
      data: { status: status as any }
    });
  };

  const handlePriorityChange = (priority: string) => {
    if (!task) return;
    updateTaskMutation.mutate({ 
      id: task.id, 
      data: { priority: priority as any }
    });
  };

  // Time tracking functions
  const startTimeTracking = () => {
    setIsTracking(true);
    setTrackingStartTime(new Date());
    toast({
      title: "Time tracking started",
      description: "The timer has started for this task.",
    });
  };

  const stopTimeTracking = () => {
    if (!task || !trackingStartTime) return;
    
    const endTime = new Date();
    const durationMs = endTime.getTime() - trackingStartTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const newTimeSpent = (task.time_spent || 0) + durationHours;
    
    updateTaskMutation.mutate({ 
      id: task.id,
      data: { time_spent: parseFloat(newTimeSpent.toFixed(2)) }
    });
    
    setIsTracking(false);
    setTrackingStartTime(null);
  };

  // Add comment function - placeholder for now
  const handleAddComment = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully.",
    });
    
    setComment("");
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "PPP");
  };

  if (isLoading) {
    return (
      <AppLayout title="Task Details">
        <div className="flex justify-center items-center h-64">
          Loading task details...
        </div>
      </AppLayout>
    );
  }

  if (!task) {
    return (
      <AppLayout title="Task Not Found">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Task not found</h2>
          <p className="mb-6">The task you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/projects/tasks")}>Go back to Tasks</Button>
        </div>
      </AppLayout>
    );
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "todo": return "warning";
      case "in_progress": return "info";
      case "review": return "secondary";
      case "completed": return "success";
      default: return "default";
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "low": return "default";
      case "medium": return "info";
      case "high": return "warning";
      case "urgent": return "destructive";
      default: return "default";
    }
  };

  return (
    <AppLayout title={task.name}>
      <div className="space-y-6">
        {/* Task Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{task.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-1">
              {task.project_id && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-muted-foreground"
                  onClick={() => navigate(`/projects/${task.project_id}`)}
                >
                  Project: {task.project_id.substring(0, 8)}...
                </Button>
              )}
              <span className="text-muted-foreground mx-1">•</span>
              <span className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" /> Created: {format(new Date(task.created_at), "PP")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isTracking ? (
              <Button 
                onClick={startTimeTracking} 
                variant="outline" 
                className="text-green-500 border-green-500 hover:bg-green-500/10"
              >
                <Play className="h-4 w-4 mr-1" /> Start Timer
              </Button>
            ) : (
              <Button 
                onClick={stopTimeTracking} 
                variant="outline" 
                className="text-red-500 border-red-500 hover:bg-red-500/10"
              >
                <Square className="h-4 w-4 mr-1" /> Stop Timer
              </Button>
            )}
            
            <Button 
              onClick={() => handleStatusChange("completed")} 
              variant={task.status === "completed" ? "default" : "outline"}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Complete
            </Button>
          </div>
        </div>
        
        {/* Task Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="md:col-span-2 space-y-6">
            {/* Task Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {task.description || "No description provided"}
                </p>
              </CardContent>
            </Card>
            
            {/* Task Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
                <CardDescription>
                  Discussion about this task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground mt-2">
                    No comments yet
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex gap-4 mt-4">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment}>
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Task Details - Right Side */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <div className="mt-1">
                    <Select value={task.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Priority</h3>
                  <div className="mt-1">
                    <Select value={task.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority</SelectLabel>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Assigned To</h3>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <User className="h-4 w-4 mr-1" /> 
                    {task.assigned_to || "Not assigned"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Due Date</h3>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <CalendarIcon className="h-4 w-4 mr-1" /> 
                    {formatDate(task.due_date)}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Time Spent</h3>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" /> 
                    {task.time_spent || 0} hours
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Billable</h3>
                  <p className="text-muted-foreground flex items-center mt-1">
                    {task.billable ? "Yes" : "No"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Service</h3>
                  <p className="text-muted-foreground flex items-center mt-1">
                    {task.service_id ? "Linked to service" : "No service linked"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => navigate("/projects/tasks")}>
                  Back to Tasks
                </Button>
                <Button>
                  Edit Task
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TaskDetails;
