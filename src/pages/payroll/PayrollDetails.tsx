
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/auth";
import { payrollService } from "@/services/payrollService";
import { pdfService } from "@/services/pdf";
import { toast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

const PayrollDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { business } = useAuth();

  const { data: payroll, isLoading, error } = useQuery({
    queryKey: ['payroll', id],
    queryFn: () => payrollService.getPayrollById(id!),
    meta: {
      onError: (error: any) => {
        console.error("Error loading payroll:", error);
        toast({
          title: "Error loading payroll details",
          description: error.message || "Failed to load payroll details",
          variant: "destructive",
        });
      }
    }
  });

  const handleDownloadPayslip = () => {
    try {
      if (payroll && business) {
        pdfService.generatePayslipPDF(payroll, business);
        toast({
          title: "Payslip downloaded",
          description: "Your payslip has been downloaded successfully.",
        });
      } else {
        toast({
          title: "Download failed",
          description: "Payroll or business data is missing.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error downloading payslip:", error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download payslip",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600";
      case "processed":
        return "bg-blue-500/20 text-blue-600";
      case "paid":
        return "bg-green-500/20 text-green-600";
      case "cancelled":
        return "bg-red-500/20 text-red-600";
      default:
        return "bg-gray-500/20 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Payroll Details">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error || !payroll) {
    return (
      <AppLayout title="Payroll Details">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Error loading payroll details</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Failed to load payroll data"}
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Payroll Details">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Payroll #{payroll.id.slice(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              {payroll.employee?.first_name} {payroll.employee?.last_name} • 
              {format(new Date(payroll.payment_date), " MMMM d, yyyy")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(payroll.status)}>
              {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
            </Badge>
            <Button 
              onClick={handleDownloadPayslip} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Payslip
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gross Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payroll.gross_amount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payroll.net_amount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payroll.taxes.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Deductions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${payroll.deductions.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pay Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-md font-medium">
                {format(new Date(payroll.pay_period_start), "MMM d")} - {format(new Date(payroll.pay_period_end), "MMM d, yyyy")}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Payment Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-md font-medium">
                {format(new Date(payroll.payment_date), "MMMM d, yyyy")}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-md font-medium">
                  {payroll.employee?.first_name} {payroll.employee?.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-md font-medium">{payroll.employee?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Position</p>
                <p className="text-md font-medium">{payroll.employee?.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-md font-medium">{payroll.employee?.department || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hire Date</p>
                <p className="text-md font-medium">
                  {payroll.employee?.hire_date ? format(new Date(payroll.employee.hire_date), "MMMM d, yyyy") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Annual Salary</p>
                <p className="text-md font-medium">${payroll.employee?.salary.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {payroll.payroll_deductions && payroll.payroll_deductions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payroll.payroll_deductions.map((deduction) => (
                    <TableRow key={deduction.id}>
                      <TableCell className="font-medium">
                        {deduction.deduction_type?.name}
                      </TableCell>
                      <TableCell>
                        {deduction.deduction_type?.is_percentage ? "Percentage" : "Fixed"}
                        {deduction.deduction_type?.rate && ` (${deduction.deduction_type.rate}%)`}
                      </TableCell>
                      <TableCell className="text-right">${deduction.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">
                      Total Deductions
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ${payroll.deductions.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {payroll.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{payroll.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default PayrollDetails;
