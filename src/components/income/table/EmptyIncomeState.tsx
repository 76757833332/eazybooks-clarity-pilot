
import React from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyIncomeState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <Wallet className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
      <h3 className="mt-4 text-lg font-medium">No income recorded yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Add your first income transaction to get started.
      </p>
      <Button 
        onClick={() => navigate("/income/create")} 
        className="mt-4"
      >
        Add Income
      </Button>
    </div>
  );
};

export default EmptyIncomeState;
