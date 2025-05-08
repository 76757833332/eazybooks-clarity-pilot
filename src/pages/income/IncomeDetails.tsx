
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, ArrowLeft, FileText, Calendar, DollarSign } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getIncomeById, deleteIncome } from "@/services/incomeService";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const IncomeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { data: income, isLoading, error } = useQuery({
    queryKey: ["income", id],
    queryFn: () => (id ? getIncomeById(id) : Promise.resolve(null)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => (id ? deleteIncome(id) : Promise.reject("No income ID provided")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      toast({ title: "Income deleted", description: "Income entry has been removed" });
      navigate("/income");
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "sales":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "services":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "consulting":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "investment":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "other":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Income Details">
        <div className="text-center py-8">Loading income details...</div>
      </AppLayout>
    );
  }

  if (error || !income) {
    return (
      <AppLayout title="Income Details">
        <div className="text-center py-8 text-red-500">
          {error instanceof Error ? error.message : "Income not found"}
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={() => navigate("/income")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Income
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Income Details">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/income")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Income
        </Button>

        <Card className="border border-border">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{income.description}</CardTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={getStatusColor(income.status)}>
                  {income.status.charAt(0).toUpperCase() + income.status.slice(1)}
                </Badge>
                <Badge className={getSourceColor(income.source)}>
                  {income.source.charAt(0).toUpperCase() + income.source.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(income.amount)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {new Date(income.income_date).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> Date Recorded
                </h3>
                <p>{new Date(income.created_at).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" /> Income Date
                </h3>
                <p>{new Date(income.income_date).toLocaleDateString()}</p>
              </div>
            </div>

            {income.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4" /> Notes
                </h3>
                <p className="text-sm whitespace-pre-line">{income.notes}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(`/income/edit/${income.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this income
                entry and remove it from your records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default IncomeDetails;
