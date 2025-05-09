
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  Users, 
  DollarSign,
  Clock,
  Trash2, 
  PenLine,
  Briefcase
} from "lucide-react";
import { Project } from "@/types/project";
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
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ProjectStatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    pending: { label: "Pending", className: "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20" },
    "in_progress": { label: "In Progress", className: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" },
    completed: { label: "Completed", className: "bg-green-500/20 text-green-500 hover:bg-green-500/20" },
    cancelled: { label: "Cancelled", className: "bg-red-500/20 text-red-500 hover:bg-red-500/20" },
  };

  const { label, className } = statusMap[status as keyof typeof statusMap] || 
    { label: status, className: "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch projects
  const { data: projects = [], isLoading, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getProjects,
  });

  // Delete project
  const handleDeleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      toast({
        title: "Project deleted",
        description: "The project has been removed successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      });
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.customers?.name && project.customers.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout title="Projects">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => navigate("/projects/create")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>
              Manage your projects and client work
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm 
                  ? "No projects match your search criteria." 
                  : "No projects found. Create your first project to get started."}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead className="hidden md:table-cell">Client</TableHead>
                      <TableHead className="hidden md:table-cell">Dates</TableHead>
                      <TableHead className="hidden lg:table-cell">Budget</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id} className="cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-2">
                              <Briefcase size={16} />
                            </div>
                            {project.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {project.customers ? (
                            <div className="flex items-center text-muted-foreground">
                              <Users size={14} className="mr-1" />
                              {project.customers.name}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No client</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              <span>Start: {formatDate(project.start_date)}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Calendar size={14} className="mr-1" />
                              <span>Due: {formatDate(project.due_date)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {project.budget ? (
                            <div className="flex items-center text-muted-foreground">
                              <DollarSign size={14} className="mr-1" />
                              {formatCurrency(project.budget)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No budget</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <ProjectStatusBadge status={project.status} />
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/${project.id}`);
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
                                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this project? This will also delete all associated tasks and data. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
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
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
