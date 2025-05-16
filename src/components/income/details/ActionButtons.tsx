
import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  incomeId: string;
  onDelete: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ incomeId, onDelete }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={() => navigate(`/income/edit/${incomeId}`)}
      >
        <Edit className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="destructive"
        onClick={onDelete}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default ActionButtons;
