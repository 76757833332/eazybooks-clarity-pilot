
import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
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
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";

const ExpenseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'reimbursed':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'recorded':
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case 'pending':
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const { data: expense, isLoading, isError, refetch } = useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching expense details:", error);
        throw new Error(error.message);
      }
      
      return data as unknown as Expense;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;

      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      navigate("/expenses");
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!id) return;

      const { error } = await supabase
        .from("expenses")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Expense status updated");
      refetch();
    },
    onError: (error) => {
      console.error("Error updating expense status:", error);
      toast.error("Failed to update status");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateStatusMutation.mutate(newStatus);
  };

  if (isLoading) {
    return (
      <AppLayout title="Expense Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eazybooks-purple"></div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !expense) {
    return (
      <AppLayout title="Expense Details">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Expense not found</h2>
          <p className="text-muted-foreground mb-6">The expense you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link to="/expenses">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Expenses
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Expense Details">
      <div className="flex flex-col max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/expenses")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold">Expense Details</h2>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Recorded on {new Date(expense.created_at).toLocaleDateString()}
                </p>
                <h3 className="text-xl font-medium">{expense.description || "No description"}</h3>
              </div>
              <Badge className={`${getStatusColor(expense.status)} mt-2 md:mt-0`}>
                {expense.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Amount</h4>
                <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                <p>{expense.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Date</h4>
                <p>{new Date(expense.expense_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h4>
                <p>{expense.payment_method || "Not specified"}</p>
              </div>
              {expense.description && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p>{expense.description}</p>
                </div>
              )}
              {expense.receipt_url && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Receipt</h4>
                  <a 
                    href={expense.receipt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-eazybooks-purple hover:underline"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                {expense.status !== 'recorded' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleStatusUpdate('recorded')}
                  >
                    Mark as Recorded
                  </Button>
                )}
                {expense.status !== 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleStatusUpdate('pending')}
                  >
                    Mark as Pending
                  </Button>
                )}
                {expense.status !== 'approved' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleStatusUpdate('approved')}
                  >
                    Mark as Approved
                  </Button>
                )}
                {expense.status !== 'reimbursed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleStatusUpdate('reimbursed')}
                  >
                    Mark as Reimbursed
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/expenses/edit/${expense.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this expense record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ExpenseDetails;
