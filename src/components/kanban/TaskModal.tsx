
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KanbanTask } from './types';
import TaskForm from './TaskForm';
import TaskAssigneeSelect from './TaskAssigneeSelect';
import TaskModalFooter from './TaskModalFooter';

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
        
        <TaskForm 
          task={editedTask}
          onChange={handleChange}
        />
        
        <TaskAssigneeSelect 
          assignedTo={editedTask.assigned_to} 
          onAssigneeChange={handleAssigneeChange}
        />
        
        <TaskModalFooter 
          isNew={isNew}
          onSave={handleSave}
          onDelete={onDelete}
          taskId={task.id}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
