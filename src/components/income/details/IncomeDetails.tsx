
import React from "react";
import { Calendar, FileText, DollarSign } from "lucide-react";

interface IncomeDetailsProps {
  description?: string;
  createdAt: string;
  incomeDate: string;
  notes?: string;
}

const IncomeDetails: React.FC<IncomeDetailsProps> = ({
  createdAt,
  incomeDate,
  notes,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
            <Calendar className="mr-2 h-4 w-4" /> Date Recorded
          </h3>
          <p>{new Date(createdAt).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
            <DollarSign className="mr-2 h-4 w-4" /> Income Date
          </h3>
          <p>{new Date(incomeDate).toLocaleDateString()}</p>
        </div>
      </div>

      {notes && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Notes
          </h3>
          <p className="text-sm whitespace-pre-line">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default IncomeDetails;
