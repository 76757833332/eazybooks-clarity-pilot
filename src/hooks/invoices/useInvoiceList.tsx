
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { invoiceService } from "@/services/invoice";
import { toast } from "sonner";

export const useInvoiceList = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'sent':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'draft':
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case 'overdue':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", statusFilter, searchTerm, user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) {
          console.error("No user ID available");
          return [];
        }
        
        const invoiceData = await invoiceService.getInvoices(user.id);
        
        // Apply client-side filtering
        return invoiceData.filter(invoice => {
          // Status filter
          if (statusFilter && invoice.status !== statusFilter) {
            return false;
          }
          
          // Search term filter
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesInvoiceNumber = invoice.invoice_number.toLowerCase().includes(searchLower);
            const matchesCustomerName = invoice.customer?.name?.toLowerCase().includes(searchLower);
            
            if (!matchesInvoiceNumber && !matchesCustomerName) {
              return false;
            }
          }
          
          return true;
        });
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to load invoices. Please try again.");
        return [];
      }
    },
    enabled: !!user?.id,
  });

  return {
    invoices,
    isLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    getStatusColor,
  };
};
