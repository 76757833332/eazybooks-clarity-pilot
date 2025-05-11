
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const NotFoundState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-10">
      <h3 className="text-lg font-medium">Invoice not found</h3>
      <p className="text-muted-foreground my-2">
        The invoice you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={() => navigate("/invoices")}
      >
        <ChevronLeft size={16} className="mr-2" />
        Back to Invoices
      </Button>
    </div>
  );
};
