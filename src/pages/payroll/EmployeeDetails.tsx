import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, Trash2, MailIcon, PhoneIcon, AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Employee } from "@/types/employee";
import { payrollService } from "@/services/payrollService";

const fetchEmployee = async (id: string) => {
  const employee = await payrollService.getEmployeeById(id);
  return employee;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  on_leave: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
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
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`${employee?.first_name} ${employee?.last_name}`}>
      <div className="mb-6 flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/payroll/employees")}>
          Back to Employees
        </Button>
        <Button onClick={() => navigate(`/payroll/employees/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                employee record from your database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteEmployeeMutation.mutate(id!)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Information</CardTitle>
                  <CardDescription>Personal and employment details</CardDescription>
                </div>
                <Badge className={statusColors[employee.status]} variant="outline">
                  {employee.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Full Name</div>
                      <div>
                        {employee.first_name} {employee.last_name}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="flex items-center">
                        <MailIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${employee.email}`}
                          className="text-primary hover:underline"
                        >
                          {employee.email}
                        </a>
                      </div>
                    </div>
                    {employee.phone && (
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="flex items-center">
                          <PhoneIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                          <a
                            href={`tel:${employee.phone}`}
                            className="text-primary hover:underline"
                          >
                            {employee.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">Employment Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Position</div>
                      <div>{employee.position}</div>
                    </div>
                    {employee.department && (
                      <div>
                        <div className="text-sm text-muted-foreground">Department</div>
                        <div>{employee.department}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">Hire Date</div>
                      <div>
                        {format(new Date(employee.hire_date), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Compensation</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Annual Salary</div>
                      <div className="text-lg font-semibold">
                        {formatCurrency(employee.salary)}
                      </div>
                    </div>
                    {employee.hourly_rate && (
                      <div>
                        <div className="text-sm text-muted-foreground">Hourly Rate</div>
                        <div>{formatCurrency(employee.hourly_rate)}/hour</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">System Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Created</div>
                      <div>
                        {format(new Date(employee.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Last Updated</div>
                      <div>
                        {format(new Date(employee.updated_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
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
        </div>
      </div>
    </AppLayout>
  );
};

export default EmployeeDetails;
