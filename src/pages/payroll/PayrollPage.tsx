
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PlusCircle, Search, FilterIcon } from "lucide-react";
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
import { Payroll } from "@/types/payroll";
import { Employee } from "@/types/employee";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const fetchPayrolls = async () => {
  const { data, error } = await supabase
    .from("payrolls")
    .select(`
      *,
      employee:employees(id, first_name, last_name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as (Payroll & { employee: Pick<Employee, "id" | "first_name" | "last_name"> })[];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const PayrollStatusBadge = ({ status }: { status: Payroll["status"] }) => {
  const variants: Record<Payroll["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processed: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status}
    </Badge>
  );
};

const PayrollPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: payrolls = [], isLoading } = useQuery({
    queryKey: ["payrolls"],
    queryFn: fetchPayrolls,
  });

  const filteredPayrolls = payrolls.filter((payroll) => {
    if (!payroll.employee) return false;
    
    const employeeName = `${payroll.employee.first_name} ${payroll.employee.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return (
      employeeName.includes(query) ||
      payroll.status.toLowerCase().includes(query) ||
      format(new Date(payroll.payment_date), "MMM d, yyyy").toLowerCase().includes(query)
    );
  });

  return (
    <AppLayout title="Payroll">
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payrolls..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link to="/payroll/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Payroll
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Records</CardTitle>
          <CardDescription>
            Manage employee payments and view payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading payroll records...</div>
          ) : filteredPayrolls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-4 text-muted-foreground">
                {searchQuery
                  ? "No payroll records found matching your search"
                  : "No payroll records found. Create your first payroll to get started."}
              </p>
              {!searchQuery && (
                <Link to="/payroll/create">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Payroll
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Gross Amount</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayrolls.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell>
                        {payroll.employee ? (
                          <Link
                            to={`/payroll/employees/${payroll.employee_id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {payroll.employee.first_name} {payroll.employee.last_name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Unknown Employee</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payroll.pay_period_start), "MMM d")} - {format(new Date(payroll.pay_period_end), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payroll.payment_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{formatCurrency(payroll.gross_amount)}</TableCell>
                      <TableCell>{formatCurrency(payroll.net_amount)}</TableCell>
                      <TableCell>
                        <PayrollStatusBadge status={payroll.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/payroll/${payroll.id}`}>
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

export default PayrollPage;
