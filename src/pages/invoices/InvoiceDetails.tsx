import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, Download, Send, Trash2, Edit, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Invoice, InvoiceItem } from "@/types/invoice";
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

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch invoice details
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!id) throw new Error("Invoice ID is required");
      
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(*)
        `)
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching invoice:", error);
        throw new Error(error.message);
      }
      
      return data as unknown as Invoice;
    },
  });

  // Fetch invoice items
  const { data: invoiceItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ["invoiceItems", id],
    queryFn: async () => {
      if (!id) throw new Error("Invoice ID is required");
      
      const { data, error } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)
        .order("created_at");
      
      if (error) {
        console.error("Error fetching invoice items:", error);
        throw new Error(error.message);
      }
      
      return data as InvoiceItem[];
    },
  });

  // Helper functions
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

  // Actions
  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    
    try {
      const { error } = await supabase
        .from("invoices")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Invoice status has been updated to ${newStatus}.`,
      });
      
      // Refresh data
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Invoice deleted",
        description: "The invoice has been permanently deleted.",
      });
      
      navigate("/invoices");
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete invoice",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingInvoice || isLoadingItems;

  return (
    <AppLayout title="Invoice Details">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eazybooks-purple"></div>
        </div>
      ) : !invoice ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">Invoice not found</h3>
          <p className="text-muted-foreground my-2">
            The invoice you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate("/invoices")}
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to Invoices
          </Button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/invoices")}
                className="mr-2"
              >
                <ChevronLeft size={16} />
              </Button>
              <div>
                <h2 className="text-2xl font-semibold">
                  Invoice #{invoice.invoice_number}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge className={`${getStatusColor(invoice.status)}`}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                  <span>•</span>
                  <span>Created {new Date(invoice.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {invoice.status === 'draft' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUpdateStatus('sent')}
                >
                  <Send size={16} className="mr-1" />
                  Mark as Sent
                </Button>
              )}
              
              {invoice.status === 'sent' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  size="sm"
                  onClick={() => handleUpdateStatus('paid')}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                    <path d="M2 20h.01"></path>
                  </svg>
                  Mark as Paid
                </Button>
              )}
              
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-1" />
                Download PDF
              </Button>
              
              <Button variant="outline" size="sm">
                <Copy size={16} className="mr-1" />
                Duplicate
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete Invoice #{invoice.invoice_number}. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteInvoice}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="flex items-center gap-1">
                          <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          Deleting...
                        </span>
                      ) : "Delete Invoice"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              {/* Invoice Content */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-8">
                    {/* Your Company Info */}
                    <div>
                      <h3 className="font-bold text-lg mb-1">Your Business</h3>
                      <p>Your Company Name</p>
                      <p className="text-sm text-muted-foreground">
                        123 Business Street<br />
                        City, State 12345<br />
                        contact@yourbusiness.com
                      </p>
                    </div>

                    {/* Invoice Number & Dates */}
                    <div className="text-right">
                      <h2 className="text-2xl font-bold">INVOICE</h2>
                      <p className="text-muted-foreground">#{invoice.invoice_number}</p>
                      <div className="mt-4 text-sm">
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground mr-4">Issue Date:</span>
                          <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground mr-4">Due Date:</span>
                          <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Billed To */}
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">BILLED TO:</h3>
                    <div className="font-medium">{invoice.customer?.name || "No Customer"}</div>
                    {invoice.customer?.address && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {invoice.customer.address}
                      </div>
                    )}
                    {invoice.customer?.email && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {invoice.customer.email}
                      </div>
                    )}
                  </div>

                  {/* Invoice Items */}
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                        <th className="pb-2">Description</th>
                        <th className="pb-2 text-right">Qty</th>
                        <th className="pb-2 text-right">Price</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {invoiceItems?.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="py-3">{item.description}</td>
                          <td className="py-3 text-right">{item.quantity}</td>
                          <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                          <td className="py-3 text-right">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end mt-6">
                    <div className="w-1/3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>${invoice.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-border font-medium">
                        <span>Total:</span>
                        <span className="text-lg">${invoice.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoice.notes && (
                    <div className="mt-8 pt-6 border-t border-border">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">NOTES:</h3>
                      <p className="text-sm">{invoice.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-4 space-y-6">
              {/* Status Card */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Status:</span>
                      <Badge className={`${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Info */}
              {invoice.customer && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Customer</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="font-medium">{invoice.customer.name}</div>
                        {invoice.customer.email && (
                          <div className="text-sm text-muted-foreground">{invoice.customer.email}</div>
                        )}
                      </div>
                      {invoice.customer.phone && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Phone: </span>
                          <span>{invoice.customer.phone}</span>
                        </div>
                      )}
                      {invoice.customer.address && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Address: </span>
                          <span>{invoice.customer.address}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Actions</h3>
                  <div className="space-y-2">
                    {invoice.status === 'draft' && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleUpdateStatus('sent')}
                      >
                        <Send size={16} className="mr-2" />
                        Mark as Sent
                      </Button>
                    )}
                    
                    {invoice.status === 'sent' && (
                      <Button 
                        className="w-full justify-start bg-green-600 hover:bg-green-700" 
                        onClick={() => handleUpdateStatus('paid')}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                          <path d="M2 20h.01"></path>
                        </svg>
                        Mark as Paid
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Edit size={16} className="mr-2" />
                      Edit Invoice
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Copy size={16} className="mr-2" />
                      Duplicate
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                          <Trash2 size={16} className="mr-2" />
                          Delete Invoice
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete Invoice #{invoice.invoice_number}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteInvoice}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete Invoice
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default InvoiceDetails;
