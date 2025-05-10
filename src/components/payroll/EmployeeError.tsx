
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmployeeErrorProps {
  error: Error | null;
}

export const EmployeeError = ({ error }: EmployeeErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h2 className="mb-2 text-xl font-bold">Error Loading Employee</h2>
      <p className="mb-4 text-muted-foreground">
        {error instanceof Error ? error.message : "Employee not found"}
      </p>
      <Button onClick={() => navigate("/payroll/employees")}>
        Back to Employees
      </Button>
    </div>
  );
};
