
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { KanbanTask } from './types';

interface TaskFormProps {
  task: KanbanTask;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onChange }) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={task.name}
          onChange={onChange}
          placeholder="Task name"
          className="bg-black/30 border-gray-700"
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={task.description || ''}
          onChange={onChange}
          placeholder="Add a more detailed description..."
          className="bg-black/30 border-gray-700 min-h-24"
        />
      </div>
    </div>
  );
};

export default TaskForm;
