
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Task } from '@/types/project';

export interface KanbanTask {
  id: string;
  name: string;
  description?: string;
  assigned_to?: string | null;
  column_id: string;
}

export interface KanbanColumn {
  id: string;
  name: string;
  tasks: KanbanTask[];
}

const defaultColumns: KanbanColumn[] = [
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

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<KanbanTask | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const { toast } = useToast();

  // Fetch tasks data
  const { data: tasksData = [], isLoading, refetch } = useQuery({
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
            column_id: task.status
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find the column that contains the task
  const findColumnByTaskId = (taskId: string): KanbanColumn | undefined => {
    return columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    );
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Handle task drag
    if (active.data.current?.type === 'task') {
      const taskId = active.id as string;
      const column = findColumnByTaskId(taskId);
      
      if (column) {
        const task = column.tasks.find(t => t.id === taskId);
        if (task) {
          setActiveTask(task);
        }
      }
    }
    
    // Handle column drag
    if (active.data.current?.type === 'column') {
      const columnId = active.id as string;
      const column = columns.find(c => c.id === columnId);
      if (column) {
        setActiveColumn(column);
      }
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // If task is being dragged
    if (active.data.current?.type === 'task' && over.data.current) {
      const activeId = active.id as string;
      const overId = over.id as string;
      
      // Find the source and destination columns
      const sourceColumn = findColumnByTaskId(activeId);
      let destinationColumn: KanbanColumn | undefined;
      
      if (over.data.current.type === 'task') {
        // Over another task
        destinationColumn = findColumnByTaskId(overId);
      } else if (over.data.current.type === 'column') {
        // Over a column
        destinationColumn = columns.find(c => c.id === overId);
      }
      
      if (!sourceColumn || !destinationColumn || sourceColumn.id === destinationColumn.id) return;
      
      // Move task from source column to destination column
      setColumns(prev => {
        const updatedColumns = prev.map(col => {
          // Remove from source column
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              tasks: col.tasks.filter(task => task.id !== activeId)
            };
          }
          
          // Add to destination column
          if (col.id === destinationColumn!.id) {
            const task = sourceColumn.tasks.find(t => t.id === activeId)!;
            const updatedTask = { ...task, column_id: destinationColumn!.id };
            
            // Update the task status in the backend
            projectService.updateTask(activeId, { status: destinationColumn!.id as any })
              .then(() => {
                toast({
                  title: "Task updated",
                  description: `Task moved to ${destinationColumn!.name}`,
                });
                refetch();
              })
              .catch(error => {
                console.error("Error updating task:", error);
              });
              
            return {
              ...col,
              tasks: [...col.tasks, updatedTask]
            };
          }
          
          return col;
        });
        
        return updatedColumns;
      });
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      setActiveColumn(null);
      return;
    }
    
    // Handle column reordering
    if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      const activeIndex = columns.findIndex(col => col.id === active.id);
      const overIndex = columns.findIndex(col => col.id === over.id);
      
      if (activeIndex !== overIndex) {
        setColumns(arrayMove(columns, activeIndex, overIndex));
      }
    }
    
    // Handle task reordering within the same column
    if (active.data.current?.type === 'task' && over.data.current?.type === 'task') {
      const activeId = active.id as string;
      const overId = over.id as string;
      
      const activeColumn = findColumnByTaskId(activeId);
      const overColumn = findColumnByTaskId(overId);
      
      if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
        const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        const overTaskIndex = activeColumn.tasks.findIndex(t => t.id === overId);
        
        if (activeTaskIndex !== overTaskIndex) {
          setColumns(prev => 
            prev.map(col => {
              if (col.id === activeColumn.id) {
                return {
                  ...col,
                  tasks: arrayMove(col.tasks, activeTaskIndex, overTaskIndex)
                };
              }
              return col;
            })
          );
        }
      }
    }
    
    // Reset the active items
    setActiveTask(null);
    setActiveColumn(null);
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
        priority: 'medium',
        billable: true,
      }).then(() => {
        toast({
          title: "Task created",
          description: "The task has been created successfully.",
        });
        refetch();
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
        refetch();
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
      refetch();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div>Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddColumn}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </div>
      
      <div className="relative overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onDeleteColumn={handleDeleteColumn}
                onUpdateColumnName={handleUpdateColumnName}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>

      {isTaskModalOpen && currentTask && (
        <TaskModal
          task={currentTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          isNew={isNewTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
