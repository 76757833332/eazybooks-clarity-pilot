
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PayrollHistory = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll History</CardTitle>
        <CardDescription>Recent payments to this employee</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="mb-4 text-muted-foreground">
            No payroll records found for this employee.
          </p>
          <Button onClick={() => navigate("/payroll/create")}>
            Create Payroll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
