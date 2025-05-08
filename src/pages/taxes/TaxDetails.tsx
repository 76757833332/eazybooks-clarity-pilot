
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Edit, Trash2, Check } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { taxService } from "@/services/taxService";
import { formatCurrency } from "@/lib/utils";
import { TaxCategory, TaxStatus } from "@/types/tax";

const statusColors: Record<TaxStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  filed: "bg-blue-100 text-blue-800"
};

const categoryLabels: Record<TaxCategory, string> = {
  income: "Income Tax",
  sales: "Sales Tax",
  property: "Property Tax",
  payroll: "Payroll Tax",
  other: "Other Tax"
};

const TaxDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMarkAsPaidDialogOpen, setIsMarkAsPaidDialogOpen] = useState(false);
  
  const { data: tax, isLoading, error } = useQuery({
    queryKey: ["tax", id],
    queryFn: () => taxService.getTaxById(id!),
    enabled: !!id,
  });
  
  const deleteTaxMutation = useMutation({
    mutationFn: () => taxService.deleteTax(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      toast({
        title: "Tax record deleted",
        description: "The tax record has been successfully deleted.",
      });
      navigate("/taxes");
    },
    onError: (error) => {
      console.error("Error deleting tax record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tax record. Please try again.",
      });
    },
  });
  
  const markAsPaidMutation = useMutation({
    mutationFn: () => taxService.updateTax(id!, { 
      status: "paid", 
      payment_date: new Date().toISOString().slice(0, 10)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax", id] });
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      toast({
        title: "Tax marked as paid",
        description: "The tax record has been successfully updated.",
      });
      setIsMarkAsPaidDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating tax record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tax record. Please try again.",
      });
    },
  });

  if (isLoading) {
    return (
      <AppLayout title="Tax Details">
        <div className="flex items-center justify-center h-96">
          Loading tax details...
        </div>
      </AppLayout>
    );
  }

  if (error || !tax) {
    return (
      <AppLayout title="Tax Details">
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-red-500 mb-4">Error loading tax details.</p>
          <Button onClick={() => navigate("/taxes")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Taxes
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleDelete = () => {
    deleteTaxMutation.mutate();
    setIsDeleteDialogOpen(false);
  };
  
  const handleMarkAsPaid = () => {
    markAsPaidMutation.mutate();
  };

  return (
    <AppLayout title={`Tax Details: ${tax.name}`}>
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/taxes")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Taxes
      </Button>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className={statusColors[tax.status as TaxStatus]}>
                {tax.status.charAt(0).toUpperCase() + tax.status.slice(1)}
              </Badge>
              <CardTitle className="mt-2 text-2xl">{tax.name}</CardTitle>
              <CardDescription>
                {categoryLabels[tax.category as TaxCategory] || tax.category}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="text-3xl font-bold">{formatCurrency(tax.amount)}</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Dates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span className="font-medium">{format(new Date(tax.due_date), "MMM dd, yyyy")}</span>
                </div>
                
                {tax.period_start && (
                  <div className="flex justify-between">
                    <span>Period Start:</span>
                    <span>{format(new Date(tax.period_start), "MMM dd, yyyy")}</span>
                  </div>
                )}
                
                {tax.period_end && (
                  <div className="flex justify-between">
                    <span>Period End:</span>
                    <span>{format(new Date(tax.period_end), "MMM dd, yyyy")}</span>
                  </div>
                )}
                
                {tax.payment_date && (
                  <div className="flex justify-between">
                    <span>Payment Date:</span>
                    <span className="font-medium">{format(new Date(tax.payment_date), "MMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tax Information</h3>
              <div className="space-y-2">
                {tax.tax_authority && (
                  <div className="flex justify-between">
                    <span>Tax Authority:</span>
                    <span>{tax.tax_authority}</span>
                  </div>
                )}
                
                {tax.tax_id_number && (
                  <div className="flex justify-between">
                    <span>Tax ID/Reference:</span>
                    <span>{tax.tax_id_number}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span>{format(new Date(tax.created_at), "MMM dd, yyyy")}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{format(new Date(tax.updated_at), "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>
          </div>
          
          {tax.notes && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <p className="whitespace-pre-line text-sm">{tax.notes}</p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Tax Record</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this tax record? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteTaxMutation.isPending}>
                  {deleteTaxMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => navigate(`/taxes/edit/${tax.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          
          {tax.status !== "paid" && (
            <Dialog open={isMarkAsPaidDialogOpen} onOpenChange={setIsMarkAsPaidDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Paid
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Tax as Paid</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to mark this tax as paid? The payment date will be set to today.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsMarkAsPaidDialogOpen(false)}>Cancel</Button>
                  <Button 
                    variant="default" 
                    onClick={handleMarkAsPaid} 
                    disabled={markAsPaidMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {markAsPaidMutation.isPending ? "Updating..." : "Confirm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </AppLayout>
  );
};

export default TaxDetails;
