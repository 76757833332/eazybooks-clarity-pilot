import React from "react";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import TaskList from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectTasksListProps {
  projectId: string;
}

export const ProjectTasksList: React.FC<ProjectTasksListProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => projectService.getTasksByProject(projectId),
    enabled: !!projectId,
  });

  const handleDelete = async (id: string) => {
    await projectService.deleteTask(id);
    refetch();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await projectService.updateTask(id, { status: newStatus as any });
    refetch();
  };

  if (!isLoading && tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p className="text-muted-foreground mt-1">
          Add tasks to this project to track work and progress
        </p>
        <Button className="mt-4" onClick={() => navigate("/projects/tasks/create", { state: { projectId } })}>
          <Plus className="h-4 w-4 mr-1" /> Add First Task
        </Button>
      </div>
    );
  }

  return (
    <TaskList 
      tasks={tasks}
      isLoading={isLoading}
      searchTerm=""
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
    />
  );
};

interface ProjectTasksSectionProps {
  projectId: string;
}

export const ProjectTasksSection: React.FC<ProjectTasksSectionProps> = ({ projectId }) => {
  // This component exists to mount the tasks query early when tabs render
  useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => projectService.getTasksByProject(projectId),
    enabled: !!projectId,
  });
  return null;
};
