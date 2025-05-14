
export * from './KanbanContext';

export interface KanbanTask {
  id: string;
  name: string;
  description: string | null;
  status: string;
  assigned_to: string | null;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}
