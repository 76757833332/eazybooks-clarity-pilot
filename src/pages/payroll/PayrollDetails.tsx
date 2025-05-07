
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Payroll, PayrollDeduction } from "@/types/payroll";
import { Employee } from "@/types/employee";
import { supabase } from "@/integrations/supabase/client";

const fetchPayroll = async (id: string) => {
  const { data, error } = await supabase
    .from("payrolls")
    .select(`
      *,
      employee:employees(id, first_name, last_name, email, position, department),
      payroll_deductions:payroll_deductions(
        id,
        amount,
        deduction_type:deduction_types(id, name, description, is_percentage, rate)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Payroll & { 
    employee: Pick<Employee, "id" | "first_name" | "last_name" | "email" | "position" | "department">,
    payroll_deductions: Array<PayrollDeduction & { 
      deduction_type: { 
        id: string;
        name: string;
        description?: string;
        is_percentage: boolean;
        rate?: number;
      } 
    }>
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processed: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PayrollDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<"pending" | "processed" | "paid" | "cancelled">("pending");

  const { data: payroll, isLoading, error } = useQuery({
    queryKey: ["payroll", id],
    queryFn: () => fetchPayroll(id!),
    onSuccess: (data) => {
      setStatus(data.status as "pending" | "processed" | "paid" | "cancelled");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("payrolls")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll", id] });
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      toast({
        title: "Status updated",
        description: `Payroll status has been updated to ${status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePayrollMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsDeleting(true);
      const { error } = await supabase.from("payrolls").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      toast({
        title: "Payroll deleted",
        description: "The payroll record has been successfully deleted.",
      });
      navigate("/payroll");
    },
    onError: (error) => {
      toast({
        title: "Error deleting payroll",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    },
  });

  const handleStatusChange = (newStatus: string) => {
    const validStatus = newStatus as "pending" | "processed" | "paid" | "cancelled";
    setStatus(validStatus);
    updateStatusMutation.mutate({ id: id!, status: validStatus });
  };

  if (isLoading) {
    return (
      <AppLayout title="Payroll Details">
        <div className="flex justify-center py-12">Loading payroll details...</div>
      </AppLayout>
    );
  }

  if (error || !payroll) {
    return (
      <AppLayout title="Payroll Details">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-bold">Error Loading Payroll</h2>
          <p className="mb-4 text-muted-foreground">
            {error instanceof Error ? error.message : "Payroll record not found"}
          </p>
          <Button onClick={() => navigate("/payroll")}>
            Back to Payroll
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Payroll - ${payroll.employee ? `${payroll.employee.first_name} ${payroll.employee.last_name}` : 'Unknown Employee'}`}>
      <div className="mb-6 flex items-center justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/payroll")}>
          Back to Payroll
        </Button>
        <Button onClick={() => navigate(`/payroll/${id}/edit`)}>
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
                payroll record from your database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePayrollMutation.mutate(id!)}
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
                  <CardTitle>Payroll Details</CardTitle>
                  <CardDescription>Payment information and deductions</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[140px]">
                      <Badge className={statusColors[status]} variant="outline">
                        {status}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Employee Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Name</div>
                      <div>
                        {payroll.employee ? (
                          <span>{payroll.employee.first_name} {payroll.employee.last_name}</span>
                        ) : (
                          <span className="text-muted-foreground">Unknown Employee</span>
                        )}
                      </div>
                    </div>
                    {payroll.employee?.email && (
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div>{payroll.employee.email}</div>
                      </div>
                    )}
                    {payroll.employee?.position && (
                      <div>
                        <div className="text-sm text-muted-foreground">Position</div>
                        <div>{payroll.employee.position}</div>
                      </div>
                    )}
                    {payroll.employee?.department && (
                      <div>
                        <div className="text-sm text-muted-foreground">Department</div>
                        <div>{payroll.employee.department}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">Payment Period</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Pay Period</div>
                      <div>
                        {format(new Date(payroll.pay_period_start), "MMMM d, yyyy")} - {format(new Date(payroll.pay_period_end), "MMMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Payment Date</div>
                      <div>
                        {format(new Date(payroll.payment_date), "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="mb-2 font-medium">Deductions</h3>
                {!payroll.payroll_deductions || payroll.payroll_deductions.length === 0 ? (
                  <div className="text-muted-foreground">No deductions applied to this payroll</div>
                ) : (
                  <div className="space-y-2">
                    {payroll.payroll_deductions.map((deduction) => (
                      <div key={deduction.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="font-medium">{deduction.deduction_type?.name || "Unknown Deduction"}</div>
                          {deduction.deduction_type?.description && (
                            <div className="text-sm text-muted-foreground">{deduction.deduction_type.description}</div>
                          )}
                        </div>
                        <div className="font-medium">
                          {formatCurrency(deduction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {payroll.notes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="mb-2 font-medium">Notes</h3>
                    <div className="rounded-md bg-muted p-4 text-sm">
                      {payroll.notes}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <div className="text-sm text-muted-foreground">
                Created on {format(new Date(payroll.created_at), "MMMM d, yyyy")}
                <br />
                Last updated on {format(new Date(payroll.updated_at), "MMMM d, yyyy")}
              </div>
              <div className="text-right">
                <div className="mb-1">
                  <span className="mr-2 text-sm text-muted-foreground">Gross Amount:</span>
                  <span className="font-medium">{formatCurrency(payroll.gross_amount)}</span>
                </div>
                <div className="mb-1">
                  <span className="mr-2 text-sm text-muted-foreground">Taxes:</span>
                  <span className="font-medium">-{formatCurrency(payroll.taxes)}</span>
                </div>
                <div className="mb-1">
                  <span className="mr-2 text-sm text-muted-foreground">Deductions:</span>
                  <span className="font-medium">-{formatCurrency(payroll.deductions)}</span>
                </div>
                <div className="mt-2">
                  <span className="mr-2 font-medium">Net Amount:</span>
                  <span className="text-lg font-bold">{formatCurrency(payroll.net_amount)}</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PayrollDetails;
