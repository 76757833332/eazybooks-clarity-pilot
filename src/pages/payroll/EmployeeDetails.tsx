
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { Employee } from "@/types/employee";
import { payrollService } from "@/services/payrollService";
import { toast } from "@/hooks/use-toast";
import { EmployeeHeader } from "@/components/payroll/EmployeeHeader";
import { EmployeeInfo } from "@/components/payroll/EmployeeInfo";
import { PayrollHistory } from "@/components/payroll/PayrollHistory";
import { EmployeeError } from "@/components/payroll/EmployeeError";

const fetchEmployee = async (id: string) => {
  const employee = await payrollService.getEmployeeById(id);
  return employee;
};

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: employee, isLoading, error } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployee(id!),
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsDeleting(true);
      return payrollService.deleteEmployee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Employee deleted",
        description: "The employee has been successfully removed from your directory.",
      });
      navigate("/payroll/employees");
    },
    onError: (error) => {
      toast({
        title: "Error deleting employee",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    if (id) {
      deleteEmployeeMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Employee Details">
        <div className="flex justify-center py-12">Loading employee details...</div>
      </AppLayout>
    );
  }

  if (error || !employee) {
    return (
      <AppLayout title="Employee Details">
        <EmployeeError error={error instanceof Error ? error : null} />
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`${employee.first_name} ${employee.last_name}`}>
      <EmployeeHeader 
        id={id!} 
        isDeleting={isDeleting} 
        onDelete={handleDelete} 
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <EmployeeInfo employee={employee} />
        </div>

        <div>
          <PayrollHistory />
        </div>
      </div>
    </AppLayout>
  );
};

export default EmployeeDetails;
