
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import { Task } from '@/types/project';
import { KanbanColumn } from './KanbanContextTypes';
import { defaultColumns } from './constants';
import { KanbanTask } from './types';

export function useTasksData() {
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);

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

  return {
    columns,
    setColumns,
    tasksData,
    isLoading,
    refetchTasks
  };
}
