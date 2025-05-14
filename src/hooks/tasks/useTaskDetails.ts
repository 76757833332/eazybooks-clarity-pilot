
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { Task } from "@/types/project";
import { useToast } from "@/hooks/use-toast";

export const useTaskDetails = (id: string) => {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  // Fetch task details
  const { data: task, isLoading, refetch } = useQuery({
    queryKey: ["task", id],
    queryFn: () => projectService.getTaskById(id),
    enabled: !!id
  });

  // Fetch project details if task has a project
  const { data: project } = useQuery({
    queryKey: ["project", task?.project_id],
    queryFn: () => projectService.getProjectById(task!.project_id as string),
    enabled: !!task?.project_id
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

  return {
    task,
    project,
    isLoading,
    isTracking,
    trackingStartTime,
    handleStatusChange,
    handlePriorityChange,
    startTimeTracking,
    stopTimeTracking
  };
};
