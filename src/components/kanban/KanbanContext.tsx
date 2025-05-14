import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Task } from '@/types/project';
import { KanbanTask } from './types';

export interface KanbanColumn {
  id: string;
  name: string;
  tasks: KanbanTask[];
}

export const defaultColumns: KanbanColumn[] = [
  {
    id: 'todo',
    name: 'To Do',
    tasks: [],
  },
  {
    id: 'in_progress',
    name: 'In Progress',
    tasks: [],
  },
  {
    id: 'review',
    name: 'Review',
    tasks: [],
  },
  {
    id: 'completed',
    name: 'Completed',
    tasks: [],
  },
];

interface KanbanContextProps {
  columns: KanbanColumn[];
  setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>;
  activeTask: KanbanTask | null;
  setActiveTask: React.Dispatch<React.SetStateAction<KanbanTask | null>>;
  activeColumn: KanbanColumn | null;
  setActiveColumn: React.Dispatch<React.SetStateAction<KanbanColumn | null>>;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentTask: KanbanTask | null;
  setCurrentTask: React.Dispatch<React.SetStateAction<KanbanTask | null>>;
  isNewTask: boolean;
  setIsNewTask: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  tasksData: Task[];
  refetchTasks: () => void;
  findColumnByTaskId: (taskId: string) => KanbanColumn | undefined;
  handleAddColumn: () => void;
  handleDeleteColumn: (columnId: string) => void;
  handleUpdateColumnName: (columnId: string, newName: string) => void;
  handleAddTask: (columnId: string) => void;
  handleEditTask: (task: KanbanTask) => void;
  handleSaveTask: (task: KanbanTask) => void;
  handleDeleteTask: (taskId: string) => void;
}

export const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<KanbanTask | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const { toast } = useToast();

  // Fetch tasks data
  const { data: tasksData = [], isLoading, refetch: refetchTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: projectService.getAllTasks,
  });

  // Transform tasks data to KanbanBoard format
  useEffect(() => {
    if (!isLoading && tasksData.length > 0) {
      const newColumns = defaultColumns.map(column => {
        // Filter tasks by column_id (which is the status in our case)
        const columnTasks = tasksData
          .filter((task: Task) => task.status === column.id)
          .map((task: Task) => ({
            id: task.id,
            name: task.name,
            description: task.description || undefined,
            assigned_to: task.assigned_to,
            column_id: task.status,
            status: task.status, // Add status property to match the unified interface
            priority: task.priority
          }));

        return {
          ...column,
          tasks: columnTasks,
        };
      });

      setColumns(newColumns);
    }
  }, [tasksData, isLoading]);

  // Save to localStorage when columns change
  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
  }, [columns]);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns));
      } catch (e) {
        console.error('Failed to parse saved columns', e);
      }
    }
  }, []);

  // Find the column that contains the task
  const findColumnByTaskId = (taskId: string): KanbanColumn | undefined => {
    return columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    );
  };

  // Handle adding a new column
  const handleAddColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    setColumns([
      ...columns,
      {
        id: newColumnId,
        name: 'New Column',
        tasks: [],
      },
    ]);
  };

  // Handle deleting a column
  const handleDeleteColumn = (columnId: string) => {
    // Don't allow deleting default columns
    if (['todo', 'in_progress', 'review', 'completed'].includes(columnId)) {
      toast({
        title: "Cannot delete default column",
        description: "Default columns cannot be deleted.",
        variant: "destructive"
      });
      return;
    }
    
    setColumns(prev => prev.filter(col => col.id !== columnId));
  };

  // Handle updating a column name
  const handleUpdateColumnName = (columnId: string, newName: string) => {
    setColumns(prev => 
      prev.map(col => {
        if (col.id === columnId) {
          return { ...col, name: newName };
        }
        return col;
      })
    );
  };

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
    if (isNewTask) {
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
          if (isNewTask) {
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
        } else if (!isNewTask) {
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

  return (
    <KanbanContext.Provider
      value={{
        columns,
        setColumns,
        activeTask,
        setActiveTask,
        activeColumn,
        setActiveColumn,
        isTaskModalOpen,
        setIsTaskModalOpen,
        currentTask,
        setCurrentTask,
        isNewTask,
        setIsNewTask,
        isLoading,
        tasksData,
        refetchTasks,
        findColumnByTaskId,
        handleAddColumn,
        handleDeleteColumn,
        handleUpdateColumnName,
        handleAddTask,
        handleEditTask,
        handleSaveTask,
        handleDeleteTask,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
