
import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, FileText, User } from "lucide-react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types/project";
import { useTheme } from "@/contexts/theme/ThemeContext";

interface TaskInfoProps {
  task: Task;
  handleStatusChange: (status: string) => void;
  handlePriorityChange: (priority: string) => void;
}

const TaskInfo: React.FC<TaskInfoProps> = ({
  task,
  handleStatusChange,
  handlePriorityChange,
}) => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return format(new Date(dateString), "PPP");
  };

  return (
    <Card className={isLightMode ? "border-gray-200 shadow-sm" : ""}>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Status</h3>
          <div className="mt-1">
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className={`w-full ${isLightMode ? "border-gray-300" : ""}`}>
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
              <SelectTrigger className={`w-full ${isLightMode ? "border-gray-300" : ""}`}>
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
        
        {task.service_id && (
          <div>
            <h3 className="text-sm font-medium">Service</h3>
            <p className="text-muted-foreground flex items-center mt-1">
              <FileText className="h-4 w-4 mr-1" />
              Linked to service
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className={`flex justify-between border-t pt-4 ${isLightMode ? "border-gray-200" : ""}`}>
        <Button 
          variant="outline" 
          onClick={() => navigate("/projects/tasks")}
        >
          Back to Tasks
        </Button>
        
        <Button 
          onClick={() => navigate(`/projects/tasks/edit/${task.id}`)}
        >
          Edit Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskInfo;
