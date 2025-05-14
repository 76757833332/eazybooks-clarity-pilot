
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
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

// Define Zod schema for task validation
const taskSchema = z.object({
  name: z.string().min(1, { message: 'Task name is required' }),
  description: z.string().optional(),
  assigned_to: z.string().nullable(),
  status: z.string(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task.name,
      description: task.description || '',
      assigned_to: task.assigned_to,
      status: task.status,
    },
  });

  // Watch the form values for changes
  const watchedValues = watch();

  // Reset form when task changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: task.name,
        description: task.description || '',
        assigned_to: task.assigned_to,
        status: task.status,
      });
    }
  }, [task, reset, isOpen]);

  const onSubmit = (data: TaskFormValues) => {
    const updatedTask: KanbanTask = {
      ...task,
      name: data.name,
      description: data.description || null,
      assigned_to: data.assigned_to,
    };
    
    onSave(updatedTask);
    toast({
      title: isNew ? "Task created" : "Task updated",
      description: `Successfully ${isNew ? 'created' : 'updated'} task: ${data.name}`,
    });
  };

  const handleAssigneeChange = (value: string) => {
    setValue('assigned_to', value === 'unassigned' ? null : value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/80 backdrop-blur-xl text-white border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TaskForm 
            register={register}
            errors={errors}
            values={watchedValues}
          />
          
          <TaskAssigneeSelect 
            assignedTo={watchedValues.assigned_to} 
            onAssigneeChange={handleAssigneeChange}
          />
          
          <TaskModalFooter 
            isNew={isNew}
            onSave={handleSubmit(onSubmit)}
            onDelete={onDelete}
            taskId={task.id}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
