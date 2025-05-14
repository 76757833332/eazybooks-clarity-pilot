
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/theme/ThemeContext';

interface TaskPriorityBadgeProps {
  priority: string;
}

const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority }) => {
  const { resolvedTheme } = useTheme();
  const isLightMode = resolvedTheme === 'light';

  const priorityMap = {
    low: { 
      label: "Low", 
      className: isLightMode ? 
        "bg-gray-100 text-gray-600 hover:bg-gray-100" : 
        "bg-gray-500/20 text-gray-500 hover:bg-gray-500/20" 
    },
    medium: { 
      label: "Medium", 
      className: isLightMode ? 
        "bg-blue-100 text-blue-600 hover:bg-blue-100" : 
        "bg-blue-500/20 text-blue-500 hover:bg-blue-500/20" 
    },
    high: { 
      label: "High", 
      className: isLightMode ? 
        "bg-orange-100 text-orange-600 hover:bg-orange-100" : 
        "bg-orange-500/20 text-orange-500 hover:bg-orange-500/20" 
    },
    urgent: { 
      label: "Urgent", 
      className: isLightMode ? 
        "bg-red-100 text-red-600 hover:bg-red-100" : 
        "bg-red-500/20 text-red-500 hover:bg-red-500/20" 
    },
  };

  const { label, className } = priorityMap[priority as keyof typeof priorityMap] || 
    { 
      label: priority, 
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

export default TaskPriorityBadge;
