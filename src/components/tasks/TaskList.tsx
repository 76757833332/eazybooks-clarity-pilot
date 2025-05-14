
import React from 'react';
import { Task } from '@/types/project';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import TaskRow from './TaskRow';
import { useTheme } from '@/contexts/theme/ThemeContext';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  searchTerm: string;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  isLoading, 
  searchTerm, 
  onStatusChange, 
  onDelete 
}) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        {searchTerm
          ? "No tasks match your search criteria." 
          : "No tasks found. Create your first task to get started."}
      </div>
    );
  }

  return (
    <div className={`rounded-md border ${isLightMode ? "border-gray-200" : ""}`}>
      <Table>
        <TableHeader className={isLightMode ? "bg-gray-50" : ""}>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Project</TableHead>
            <TableHead className="hidden lg:table-cell">Due Date</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="hidden xl:table-cell">Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
