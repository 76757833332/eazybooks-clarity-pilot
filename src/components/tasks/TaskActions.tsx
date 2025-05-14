
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TaskActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate("/projects/tasks/create")}
      className="w-full sm:w-auto"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Task
    </Button>
  );
};

export default TaskActions;
