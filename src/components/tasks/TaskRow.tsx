
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ListTodo, 
  Calendar, 
  Briefcase, 
  User, 
  Trash2, 
  PenLine, 
  AlertCircle 
} from 'lucide-react';
import { 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Task } from '@/types/project';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import { useTheme } from '@/contexts/theme/ThemeContext';

interface TaskRowProps {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, onStatusChange, onDelete }) => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  // Get date relative to today
  const getRelativeDateString = (dateString: string | null) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  // Check if task is overdue
  const isOverdue = (): boolean => {
    if (!task.due_date) return false;
    if (task.status === 'completed') return false;
    
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dueDate < today;
  };

  return (
    <TableRow 
      key={task.id} 
      className={`cursor-pointer ${
        isOverdue() 
          ? isLightMode 
            ? 'bg-red-50' 
            : 'bg-red-50/10'
          : ''
      } ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-muted/10'}`}
      onClick={() => navigate(`/projects/tasks/${task.id}`)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
            task.status === 'completed' 
              ? isLightMode 
                ? 'bg-green-100 text-green-600'
                : 'bg-green-500/20 text-green-500'
              : isLightMode
                ? 'bg-eazybooks-purple bg-opacity-15 text-eazybooks-purple'
                : 'bg-eazybooks-purple bg-opacity-15 text-eazybooks-purple'
          }`}>
            {task.status === 'completed' ? (
              <CheckCircle size={16} />
            ) : (
              <ListTodo size={16} />
            )}
          </div>
          <div>
            {task.name}
            {isOverdue() && (
              <div className="flex items-center text-xs text-red-500 mt-0.5">
                <AlertCircle size={12} className="mr-1" />
                Overdue
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {task.project_id ? (
          <div className="flex items-center text-muted-foreground">
            <Briefcase size={14} className="mr-1" />
            Project
          </div>
        ) : (
          <span className="text-muted-foreground italic">No project</span>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {task.due_date ? (
          <div className="flex flex-col">
            <div className="flex items-center text-muted-foreground">
              <Calendar size={14} className="mr-1" />
              {formatDate(task.due_date)}
            </div>
            <div className={`text-xs ${
              isOverdue() ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {getRelativeDateString(task.due_date)}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">No due date</span>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <TaskStatusBadge status={task.status} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <TaskPriorityBadge priority={task.priority} />
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        {task.assigned_to ? (
          <div className="flex items-center text-muted-foreground">
            <User size={14} className="mr-1" />
            {task.assigned_to}
          </div>
        ) : (
          <span className="text-muted-foreground italic">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end items-center gap-2">
          {task.status !== 'completed' ? (
            <Button
              variant="outline"
              size="sm"
              className={isLightMode ? 
                "text-green-600 border-green-600 hover:bg-green-50" : 
                "text-green-500 border-green-500 hover:bg-green-500/10"
              }
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, 'completed');
              }}
            >
              <CheckCircle size={14} className="mr-1" />
              Complete
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={isLightMode ? 
                "text-blue-600 border-blue-600 hover:bg-blue-50" : 
                "text-blue-500 border-blue-500 hover:bg-blue-500/10"
              }
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, 'todo');
              }}
            >
              <ListTodo size={14} className="mr-1" />
              Reopen
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/tasks/${task.id}`);
            }}
          >
            <PenLine size={16} />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(task.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
