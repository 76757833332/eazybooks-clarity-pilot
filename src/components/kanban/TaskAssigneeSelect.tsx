
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskAssigneeSelectProps {
  assignedTo: string | null;
  onAssigneeChange: (value: string) => void;
}

const TaskAssigneeSelect: React.FC<TaskAssigneeSelectProps> = ({ 
  assignedTo, 
  onAssigneeChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="assignee">Assigned to</Label>
      <Select 
        value={assignedTo || 'unassigned'} 
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="bg-black/30 border-gray-700">
          <SelectValue placeholder="Assign to..." />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-gray-700">
          <SelectItem value="unassigned">Unassigned</SelectItem>
          <SelectItem value="Alex">Alex</SelectItem>
          <SelectItem value="Jordan">Jordan</SelectItem>
          <SelectItem value="Taylor">Taylor</SelectItem>
          <SelectItem value="Morgan">Morgan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskAssigneeSelect;
