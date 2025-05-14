
import { useState } from 'react';
import { KanbanColumn } from './KanbanContextTypes';
import { KanbanTask } from './types';
import { useToast } from '@/hooks/use-toast';
import { projectService } from '@/services/projectService';

export function useTaskHandlers(
  columns: KanbanColumn[], 
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>,
  setCurrentTask: React.Dispatch<React.SetStateAction<KanbanTask | null>>,
  setIsNewTask: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  refetchTasks: () => void
) {
  const { toast } = useToast();

  // Open modal for adding a new task
  const handleAddTask = (columnId: string) => {
    setCurrentTask({
      id: `task-${Date.now()}`,
      name: '',
      description: '',
      assigned_to: '',
      column_id: columnId,
      status: columnId, // Add status to match the unified interface
    });
    setIsNewTask(true);
    setIsTaskModalOpen(true);
  };

  // Open modal for editing a task
  const handleEditTask = (task: KanbanTask) => {
    setCurrentTask(task);
    setIsNewTask(false);
    setIsTaskModalOpen(true);
  };

  // Handle saving task
  const handleSaveTask = (task: KanbanTask) => {
    if (!task.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Task name is required.",
      });
      return;
    }

    const isNew = task.id.startsWith('task-');
    
    if (isNew) {
      // Add new task
      projectService.createTask({
        name: task.name,
        description: task.description || null,
        status: task.column_id as any,
        assigned_to: task.assigned_to || null,
        priority: task.priority || 'medium',
        billable: true,
        project_id: null,
        service_id: null,
        start_date: null,
        due_date: null,
      }).then(() => {
        toast({
          title: "Task created",
          description: "The task has been created successfully.",
        });
        refetchTasks();
      }).catch(error => {
        console.error("Error creating task:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create task.",
        });
      });
    } else {
      // Update existing task
      projectService.updateTask(task.id, {
        name: task.name,
        description: task.description || null,
        status: task.column_id as any,
        assigned_to: task.assigned_to || null,
      }).then(() => {
        toast({
          title: "Task updated",
          description: "The task has been updated successfully.",
        });
        refetchTasks();
      }).catch(error => {
        console.error("Error updating task:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update task.",
        });
      });
    }
    
    // Update UI optimistically
    setColumns(prev => 
      prev.map(col => {
        if (col.id === task.column_id) {
          if (isNew) {
            return {
              ...col,
              tasks: [...col.tasks, task],
            };
          } else {
            return {
              ...col,
              tasks: col.tasks.map(t => 
                t.id === task.id ? task : t
              ),
            };
          }
        } else if (!isNew) {
          // Remove task from other columns if it was moved
          const taskIndex = col.tasks.findIndex(t => t.id === task.id);
          if (taskIndex >= 0) {
            return {
              ...col,
              tasks: col.tasks.filter(t => t.id !== task.id),
            };
          }
        }
        return col;
      })
    );
    
    setIsTaskModalOpen(false);
  };

  // Handle deleting task
  const handleDeleteTask = (taskId: string) => {
    projectService.deleteTask(taskId).then(() => {
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully.",
      });
      refetchTasks();
    }).catch(error => {
      console.error("Error deleting task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task.",
      });
    });
    
    // Update UI optimistically
    setColumns(prev => 
      prev.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskId),
      }))
    );
    
    setIsTaskModalOpen(false);
  };

  return {
    handleAddTask,
    handleEditTask,
    handleSaveTask,
    handleDeleteTask
  };
}
