
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuotationActionsProps {
  isLoading: boolean;
}

const QuotationActions: React.FC<QuotationActionsProps> = ({ isLoading }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/quotations")}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-eazybooks-purple hover:bg-eazybooks-purple/90"
      >
        {isLoading ? "Creating..." : "Create Quotation"}
      </Button>
    </div>
  );
};

export default QuotationActions;
