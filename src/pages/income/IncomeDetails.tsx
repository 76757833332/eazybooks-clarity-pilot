
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getIncomeById, deleteIncome } from "@/services/incomeService";
import { useToast } from "@/hooks/use-toast";

// Import our new components
import IncomeHeader from "@/components/income/details/IncomeHeader";
import IncomeDetails from "@/components/income/details/IncomeDetails";
import ActionButtons from "@/components/income/details/ActionButtons";
import DeleteConfirmDialog from "@/components/income/details/DeleteConfirmDialog";

const IncomeDetailsPage: React.FC = () => {
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
          <CardHeader>
            <IncomeHeader income={income} />
          </CardHeader>

          <CardContent>
            <IncomeDetails
              createdAt={income.created_at}
              incomeDate={income.income_date}
              notes={income.notes}
            />
          </CardContent>

          <CardFooter>
            <ActionButtons 
              incomeId={income.id} 
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          </CardFooter>
        </Card>

        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </AppLayout>
  );
};

export default IncomeDetailsPage;
