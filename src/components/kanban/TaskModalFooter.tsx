
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

interface TaskModalFooterProps {
  isNew: boolean;
  onSave: () => void;
  onDelete: (taskId: string) => void;
  taskId: string;
}

const TaskModalFooter: React.FC<TaskModalFooterProps> = ({
  isNew,
  onSave,
  onDelete,
  taskId
}) => {
  return (
    <DialogFooter className="sm:justify-between">
      {!isNew && (
        <Button 
          variant="destructive"
          onClick={() => onDelete(taskId)}
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
        <Button onClick={onSave}>
          Save
        </Button>
      </div>
    </DialogFooter>
  );
};

export default TaskModalFooter;
