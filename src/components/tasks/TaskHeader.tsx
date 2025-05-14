
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Square, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/project";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface TaskHeaderProps {
  task: Task;
  project?: { name: string; id: string } | null;
  isTracking: boolean;
  trackingStartTime: Date | null;
  startTimeTracking: () => void;
  stopTimeTracking: () => void;
  handleStatusChange: (status: string) => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  project,
  isTracking,
  trackingStartTime,
  startTimeTracking,
  stopTimeTracking,
  handleStatusChange,
}) => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  return (
    <>
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate("/projects/tasks")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
      </Button>

      {/* Task Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground mt-1">
            {task.project_id && project && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-muted-foreground"
                onClick={() => navigate(`/projects/${task.project_id}`)}
              >
                Project: {project.name}
              </Button>
            )}
            <span className="text-muted-foreground mx-1">•</span>
            <span className="flex items-center">
              Created: {format(new Date(task.created_at), "PP")}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isTracking ? (
            <Button 
              onClick={startTimeTracking} 
              variant="outline" 
              className={isLightMode ? 
                "text-green-600 border-green-600 hover:bg-green-50" : 
                "text-green-500 border-green-500 hover:bg-green-500/10"
              }
            >
              <Play className="h-4 w-4 mr-1" /> Start Timer
            </Button>
          ) : (
            <Button 
              onClick={stopTimeTracking} 
              variant="outline" 
              className={isLightMode ?
                "text-red-600 border-red-600 hover:bg-red-50" :
                "text-red-500 border-red-500 hover:bg-red-500/10"
              }
            >
              <Square className="h-4 w-4 mr-1" /> Stop Timer
            </Button>
          )}
          
          <Button 
            onClick={() => handleStatusChange("completed")} 
            variant={task.status === "completed" ? "default" : "outline"}
          >
            <CheckCircle className="h-4 w-4 mr-1" /> {task.status === "completed" ? "Completed" : "Complete"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default TaskHeader;
