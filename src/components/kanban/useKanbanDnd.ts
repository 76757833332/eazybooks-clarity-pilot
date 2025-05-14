
import { useState } from 'react';
import {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useKanban } from './KanbanContext';
import { projectService } from '@/services/projectService';

export const useKanbanDnd = () => {
  const { 
    columns, 
    setColumns, 
    findColumnByTaskId,
    setActiveTask,
    setActiveColumn
  } = useKanban();
  
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
      let destinationColumn: typeof sourceColumn;
      
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

  return {
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
