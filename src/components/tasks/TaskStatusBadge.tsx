
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/theme/ThemeContext';

interface TaskStatusBadgeProps {
  status: string;
}

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  const statusMap = {
    todo: { 
      label: "To Do", 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    },
    "in_progress": { 
      label: "In Progress", 
      className: isLightMode ? 
        "bg-blue-100 text-blue-600 hover:bg-blue-100" : 
        "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" 
    },
    review: { 
      label: "Review", 
      className: isLightMode ? 
        "bg-orange-100 text-orange-600 hover:bg-orange-100" : 
        "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" 
    },
    completed: { 
      label: "Completed", 
      className: isLightMode ? 
        "bg-green-100 text-green-600 hover:bg-green-100" : 
        "bg-green-500/20 text-green-500 hover:bg-green-500/20" 
    },
  };

  const { label, className } = statusMap[status as keyof typeof statusMap] || 
    { 
      label: status, 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

export default TaskStatusBadge;
