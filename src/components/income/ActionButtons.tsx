
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2 justify-between items-center">
      <Button 
        onClick={() => navigate("/income/create")}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Add Income
      </Button>
      
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" /> 
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowUpDown className="h-4 w-4" /> 
            Sort
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> 
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
