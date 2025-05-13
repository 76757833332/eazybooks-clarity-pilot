
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  Clock, 
  ListTodo,
  CheckCircle,
  Flag,
  Briefcase,
  User,
  Trash2, 
  PenLine,
  AlertCircle,
  FileText
} from "lucide-react";
import { Task } from "@/types/project";
import { projectService } from "@/services/projectService";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/theme/ThemeContext";

const TaskStatusBadge = ({ status }: { status: string }) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  const statusMap = {
    todo: { 
      label: "To Do", 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    },
    "in_progress": { 
      label: "In Progress", 
      className: isLightMode ? 
        "bg-blue-100 text-blue-600 hover:bg-blue-100" : 
        "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" 
    },
    review: { 
      label: "Review", 
      className: isLightMode ? 
        "bg-orange-100 text-orange-600 hover:bg-orange-100" : 
        "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" 
    },
    completed: { 
      label: "Completed", 
      className: isLightMode ? 
        "bg-green-100 text-green-600 hover:bg-green-100" : 
        "bg-green-500/20 text-green-500 hover:bg-green-500/20" 
    },
  };

  const { label, className } = statusMap[status as keyof typeof statusMap] || 
    { 
      label: status, 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const TaskPriorityBadge = ({ priority }: { priority: string }) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  const priorityMap = {
    low: { 
      label: "Low", 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    },
    medium: { 
      label: "Medium", 
      className: isLightMode ? 
        "bg-blue-100 text-blue-600 hover:bg-blue-100" : 
        "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" 
    },
    high: { 
      label: "High", 
      className: isLightMode ? 
        "bg-orange-100 text-orange-600 hover:bg-orange-100" : 
        "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" 
    },
    urgent: { 
      label: "Urgent", 
      className: isLightMode ? 
        "bg-red-100 text-red-600 hover:bg-red-100" : 
        "bg-red-500/20 text-red-500 hover:bg-red-500/20" 
    },
  };

  const { label, className } = priorityMap[priority as keyof typeof priorityMap] || 
    { 
      label: priority, 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
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

  // Check if task is overdue
  const isOverdue = (task: Task): boolean => {
    if (!task.due_date) return false;
    if (task.status === 'completed') return false;
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  // Initialize the kanban board with task data
  useEffect(() => {
    if (tasks.length > 0 && viewMode === "board") {
      // Just initialize the view - KanbanBoard will handle the data internally
      console.log("Tasks available for Kanban view:", tasks.length);
    }
  }, [tasks, viewMode]);

  return (
    <AppLayout title="Tasks">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full sm:w-auto">
              <TabsList className={isLightMode ? "bg-gray-100" : "bg-background/5"}>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="board">Board</TabsTrigger>
              </TabsList>
            </Tabs>
            {viewMode === "list" && (
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <Button 
            onClick={() => navigate("/projects/tasks/create")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
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
                {isLoading ? (
                  <div className="flex justify-center py-8">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-8">
                    {searchTerm || statusFilter !== "all"
                      ? "No tasks match your search criteria." 
                      : "No tasks found. Create your first task to get started."}
                  </div>
                ) : (
                  <div className={`rounded-md border ${isLightMode ? "border-gray-200" : ""}`}>
                    <Table>
                      <TableHeader className={isLightMode ? "bg-gray-50" : ""}>
                        <TableRow>
                          <TableHead>Task</TableHead>
                          <TableHead className="hidden md:table-cell">Project</TableHead>
                          <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Priority</TableHead>
                          <TableHead className="hidden xl:table-cell">Assigned To</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <TableRow 
                            key={task.id} 
                            className={`cursor-pointer ${
                              isOverdue(task) 
                                ? isLightMode 
                                  ? 'bg-red-50' 
                                  : 'bg-red-50/10'
                                : ''
                            } ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-muted/10'}`}
                            onClick={() => navigate(`/projects/tasks/${task.id}`)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
                                  task.status === 'completed' 
                                    ? isLightMode 
                                      ? 'bg-green-100 text-green-600'
                                      : 'bg-green-500/20 text-green-500'
                                    : isLightMode
                                      ? 'bg-eazybooks-purple bg-opacity-15 text-eazybooks-purple'
                                      : 'bg-eazybooks-purple bg-opacity-15 text-eazybooks-purple'
                                }`}>
                                  {task.status === 'completed' ? (
                                    <CheckCircle size={16} />
                                  ) : (
                                    <ListTodo size={16} />
                                  )}
                                </div>
                                <div>
                                  {task.name}
                                  {isOverdue(task) && (
                                    <div className="flex items-center text-xs text-red-500 mt-0.5">
                                      <AlertCircle size={12} className="mr-1" />
                                      Overdue
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {task.project_id ? (
                                <div className="flex items-center text-muted-foreground">
                                  <Briefcase size={14} className="mr-1" />
                                  Project
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">No project</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {task.due_date ? (
                                <div className="flex flex-col">
                                  <div className="flex items-center text-muted-foreground">
                                    <Calendar size={14} className="mr-1" />
                                    {formatDate(task.due_date)}
                                  </div>
                                  <div className={`text-xs ${
                                    isOverdue(task) ? 'text-red-500' : 'text-muted-foreground'
                                  }`}>
                                    {getRelativeDateString(task.due_date)}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">No due date</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <TaskStatusBadge status={task.status} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <TaskPriorityBadge priority={task.priority} />
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              {task.assigned_to ? (
                                <div className="flex items-center text-muted-foreground">
                                  <User size={14} className="mr-1" />
                                  {task.assigned_to}
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end items-center gap-2">
                                {task.status !== 'completed' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={isLightMode ? 
                                      "text-green-600 border-green-600 hover:bg-green-50" : 
                                      "text-green-500 border-green-500 hover:bg-green-500/10"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(task.id, 'completed');
                                    }}
                                  >
                                    <CheckCircle size={14} className="mr-1" />
                                    Complete
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={isLightMode ? 
                                      "text-blue-600 border-blue-600 hover:bg-blue-50" : 
                                      "text-blue-500 border-blue-500 hover:bg-blue-500/10"
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(task.id, 'todo');
                                    }}
                                  >
                                    <ListTodo size={14} className="mr-1" />
                                    Reopen
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/projects/tasks/${task.id}`);
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
                                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this task? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>
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
