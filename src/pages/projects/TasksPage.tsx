
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/theme/ThemeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskActions from "@/components/tasks/TaskActions";
import TaskList from "@/components/tasks/TaskList";

const TasksPage: React.FC = () => {
  const { toast } = useToast();
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  // Fetch tasks
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: projectService.getAllTasks,
  });

  // Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      await projectService.deleteTask(id);
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
    }
  };

  // Update task status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await projectService.updateTask(id, { status: newStatus as any });
      toast({
        title: "Task updated",
        description: `Task status changed to ${newStatus}.`,
      });
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status. Please try again.",
      });
    }
  };

  // Filter tasks based on search term and status filter
  const filteredTasks = tasks.filter(
    (task) => {
      const matchesSearch = 
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  return (
    <AppLayout title="Tasks">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TaskFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <TaskActions />
        </div>

        <Card className={isLightMode ? "border border-gray-200 shadow-sm" : ""}>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              Manage your tasks across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="list" className="mt-0">
                <TaskList 
                  tasks={filteredTasks}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              </TabsContent>
              
              <TabsContent value="board" className="mt-0">
                <div className="h-[calc(100vh-320px)] overflow-auto">
                  <KanbanBoard />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TasksPage;
