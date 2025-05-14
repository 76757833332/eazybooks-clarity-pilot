
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import TaskHeader from "@/components/tasks/TaskHeader";
import TaskDescription from "@/components/tasks/TaskDescription";
import TaskComments from "@/components/tasks/TaskComments";
import TaskInfo from "@/components/tasks/TaskInfo";
import { useTaskDetails } from "@/hooks/tasks/useTaskDetails";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    task,
    project,
    isLoading,
    isTracking,
    trackingStartTime,
    handleStatusChange,
    handlePriorityChange,
    startTimeTracking,
    stopTimeTracking
  } = useTaskDetails(id as string);

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

  return (
    <AppLayout title={task.name}>
      <div className="space-y-6">
        <TaskHeader 
          task={task}
          project={project}
          isTracking={isTracking}
          trackingStartTime={trackingStartTime}
          startTimeTracking={startTimeTracking}
          stopTimeTracking={stopTimeTracking}
          handleStatusChange={handleStatusChange}
        />
        
        {/* Task Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="md:col-span-2 space-y-6">
            <TaskDescription description={task.description} />
            <TaskComments />
          </div>
          
          {/* Task Details - Right Side */}
          <div>
            <TaskInfo 
              task={task} 
              handleStatusChange={handleStatusChange}
              handlePriorityChange={handlePriorityChange}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TaskDetails;
