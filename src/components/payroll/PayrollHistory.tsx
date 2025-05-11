
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { payrollService } from "@/services/payrollService";
import { pdfService } from "@/services/pdfService";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import { Payroll } from "@/types/payroll";

export const PayrollHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { business } = useAuth();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: payrolls, isLoading } = useQuery({
    queryKey: ["employee-payrolls", id],
    queryFn: () => payrollService.getPayrolls().then(payrolls => 
      payrolls.filter(payroll => payroll.employee_id === id)
    ),
  });

  const handleDownloadPayslip = (payroll: Payroll) => {
    try {
      setDownloadingId(payroll.id);
      if (business) {
        pdfService.generatePayslipPDF(payroll, business);
        toast({
          title: "Payslip downloaded",
          description: "The payslip has been downloaded successfully.",
        });
      } else {
        toast({
          title: "Download failed", 
          description: "Business information is missing.",
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
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case "processed":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Processed</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Paid</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payroll History</CardTitle>
          <CardDescription>Loading payroll records...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!payrolls || payrolls.length === 0) {
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll History</CardTitle>
        <CardDescription>Recent payments to this employee</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>
                  {format(new Date(payroll.payment_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>${payroll.net_amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/payroll/${payroll.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={downloadingId === payroll.id}
                    onClick={() => handleDownloadPayslip(payroll)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
