
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { KanbanColumn } from './types';

export function useColumnHandlers(columns: KanbanColumn[], setColumns: React.Dispatch<React.SetStateAction<KanbanColumn[]>>) {
  const { toast } = useToast();

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

  // Find the column that contains the task
  const findColumnByTaskId = (taskId: string): KanbanColumn | undefined => {
    return columns.find(column => 
      column.tasks.some(task => task.id === taskId)
    );
  };

  return {
    handleAddColumn,
    handleDeleteColumn,
    handleUpdateColumnName,
    findColumnByTaskId
  };
}
