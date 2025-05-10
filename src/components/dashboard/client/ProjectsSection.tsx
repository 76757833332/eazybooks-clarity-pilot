
import React from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  name: string;
  status: string;
  dueDate: string;
  progress: number;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const navigate = useNavigate();

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

  return (
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
  );
};

export default ProjectsSection;
