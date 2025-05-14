
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface TaskFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  values: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ register, errors, values }) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Task name"
          className={`bg-black/30 border-gray-700 ${errors.name ? 'border-destructive' : ''}`}
          autoFocus
        />
        {errors.name && (
          <p className="text-sm font-medium text-destructive">{errors.name.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Add a more detailed description..."
          className={`bg-black/30 border-gray-700 min-h-24 ${errors.description ? 'border-destructive' : ''}`}
        />
        {errors.description && (
          <p className="text-sm font-medium text-destructive">{errors.description.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default TaskForm;
