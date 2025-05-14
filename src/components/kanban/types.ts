
export interface KanbanTask {
  id: string;
  name: string;
  description?: string | null;
  status?: string;
  column_id: string;
  assigned_to?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Re-export KanbanContext types to prevent circular dependencies
export * from './KanbanContext';
