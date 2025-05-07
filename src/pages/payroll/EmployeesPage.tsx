
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/employee";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const fetchEmployees = async () => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Employee[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const EmployeeStatusBadge = ({ status }: { status: Employee["status"] }) => {
  const variants: Record<Employee["status"], string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    on_leave: "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status.replace("_", " ")}
    </Badge>
  );
};

const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      fullName.includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query) ||
      (employee.department && employee.department.toLowerCase().includes(query))
    );
  });

  return (
    <AppLayout title="Employees">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/payroll/employees/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Manage your company's employees and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-4 text-muted-foreground">
                {searchQuery
                  ? "No employees found matching your search"
                  : "No employees found. Add your first employee to get started."}
              </p>
              {!searchQuery && (
                <Link to="/payroll/employees/create">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Link
                          to={`/payroll/employees/${employee.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {employee.first_name} {employee.last_name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {employee.email}
                        </div>
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department || "—"}</TableCell>
                      <TableCell>{formatCurrency(employee.salary)}</TableCell>
                      <TableCell>
                        <EmployeeStatusBadge status={employee.status} />
                      </TableCell>
                      <TableCell>
                        {format(new Date(employee.hire_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/payroll/employees/${employee.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default EmployeesPage;
