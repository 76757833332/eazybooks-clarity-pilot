
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { KanbanTask } from './types';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useTheme } from '@/contexts/theme/ThemeContext';

interface TaskCardProps {
  task: KanbanTask;
  onClick?: () => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isDragging = false }) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 touch-none"
    >
      <Card
        className={`p-3 ${isLightMode 
          ? 'bg-gray-50 border-gray-200 hover:border-gray-300' 
          : 'bg-black/30 backdrop-blur-sm border-gray-800 hover:border-gray-700'} 
          cursor-pointer transition-colors shadow-sm`}
        onClick={onClick}
      >
        <div className="text-sm font-medium">{task.name}</div>
        
        {task.description && (
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {task.description.length > 60 
              ? `${task.description.substring(0, 60)}...` 
              : task.description}
          </div>
        )}
        
        {task.assigned_to && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1" />
            <span>{task.assigned_to}</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TaskCard;
