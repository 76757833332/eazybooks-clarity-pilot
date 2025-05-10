
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MailIcon, PhoneIcon } from "lucide-react";
import { Employee } from "@/types/employee";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EmployeeInfoProps {
  employee: Employee;
}

export const EmployeeInfo = ({ employee }: EmployeeInfoProps) => {
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

  return (
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
  );
};
