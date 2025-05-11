
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { invoiceService } from "@/services/invoice"; // Updated import path
import { Invoice } from "@/types/invoice";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const InvoicesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", statusFilter, searchTerm],
    queryFn: async () => {
      try {
        const invoiceData = await invoiceService.getInvoices();
        
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
  });

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

  return (
    <AppLayout title="Invoices">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">All Invoices</h2>
          <Button 
            className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
            asChild
          >
            <Link to="/invoices/create">
              <Plus size={16} className="mr-1" />
              Create Invoice
            </Link>
          </Button>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                {statusFilter ? `Status: ${statusFilter}` : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("sent")}>Sent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("overdue")}>Overdue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Invoices list */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eazybooks-purple"></div>
          </div>
        ) : !invoices?.length ? (
          <Card className="p-8 text-center bg-secondary/40">
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium">No invoices found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter || searchTerm 
                  ? "Try changing your filters or search term" 
                  : "Create your first invoice to get started"}
              </p>
              <Button className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary" asChild>
                <Link to="/invoices/create">
                  <Plus size={16} className="mr-1" />
                  Create Invoice
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 bg-secondary/40 rounded-tl-lg">Invoice</th>
                  <th className="px-4 py-3 bg-secondary/40">Customer</th>
                  <th className="px-4 py-3 bg-secondary/40">Issue Date</th>
                  <th className="px-4 py-3 bg-secondary/40">Due Date</th>
                  <th className="px-4 py-3 bg-secondary/40">Amount</th>
                  <th className="px-4 py-3 bg-secondary/40">Status</th>
                  <th className="px-4 py-3 bg-secondary/40 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {invoices?.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      <Link to={`/invoices/${invoice.id}`} className="hover:underline text-eazybooks-purple">
                        #{invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {invoice.customer?.name || 'No Customer'}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${getStatusColor(invoice.status)} rounded-md`}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/invoices/${invoice.id}`}
                        className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default InvoicesPage;
