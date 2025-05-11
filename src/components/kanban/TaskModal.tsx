
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KanbanTask } from './KanbanBoard';
import { useQuery } from '@tanstack/react-query';

interface TaskModalProps {
  task: KanbanTask;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  isNew: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  isNew,
}) => {
  const [editedTask, setEditedTask] = useState<KanbanTask>(task);
  
  // Reset form when task changes
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    // Validate required fields
    if (!editedTask.name.trim()) {
      return;
    }
    
    onSave(editedTask);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssigneeChange = (value: string) => {
    setEditedTask(prev => ({
      ...prev,
      assigned_to: value === 'unassigned' ? null : value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-xl text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={editedTask.name}
              onChange={handleChange}
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
              value={editedTask.description || ''}
              onChange={handleChange}
              placeholder="Add a more detailed description..."
              className="bg-black/30 border-gray-700 min-h-24"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignee">Assigned to</Label>
            <Select 
              value={editedTask.assigned_to || 'unassigned'} 
              onValueChange={handleAssigneeChange}
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
        </div>
        
        <DialogFooter className="sm:justify-between">
          {!isNew && (
            <Button 
              variant="destructive"
              onClick={() => onDelete(task.id)}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          
          <div>
            <DialogClose asChild>
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
