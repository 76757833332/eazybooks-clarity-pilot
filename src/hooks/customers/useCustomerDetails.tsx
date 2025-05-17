
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { customerService } from "@/services/customerService";
import { invoiceService } from "@/services/invoice";
import { Customer } from "@/types/invoice";
import { CustomerFormValues } from "@/components/customers/details/CustomerForm";

export const useCustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  // Fetch customer data
  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomerById(id!),
    enabled: !!id,
  });

  // Fetch customer's invoices
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["customerInvoices", id],
    queryFn: () => invoiceService.getInvoices(user?.id || '').then(invoices => 
      invoices.filter(invoice => invoice.customer_id === id)
    ),
    enabled: !!id,
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: (data: CustomerFormValues) => customerService.updateCustomer(id!, data),
    onSuccess: () => {
      toast({
        title: "Customer updated",
        description: "Customer information has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error updating customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer. Please try again.",
      });
    },
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: () => customerService.deleteCustomer(id!),
    onSuccess: () => {
      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully.",
      });
      navigate("/customers");
    },
    onError: (error) => {
      console.error("Error deleting customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer. Please try again.",
      });
    },
  });

  const handleSubmit = (data: CustomerFormValues) => {
    updateCustomerMutation.mutate(data);
  };

  return {
    id,
    customer: customer as Customer | undefined,
    invoices,
    isEditing,
    setIsEditing,
    isLoadingCustomer,
    isLoadingInvoices,
    handleSubmit,
    updateCustomerMutation,
    deleteCustomerMutation,
    navigate
  };
};
