
import { KanbanTask, KanbanColumn } from './types';
import { Task } from '@/types/project';

export interface KanbanContextProps {
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
