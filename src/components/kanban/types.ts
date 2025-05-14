
export interface KanbanTask {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  column_id: string;
  assigned_to?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface KanbanColumn {
  id: string;
  name: string;
  tasks: KanbanTask[];
}

// Re-export KanbanContextTypes to prevent circular dependencies
export * from './KanbanContextTypes';
