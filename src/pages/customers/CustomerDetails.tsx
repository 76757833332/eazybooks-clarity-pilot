
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { customerService } from "@/services/customerService";
import { invoiceService } from "@/services/invoice";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ArrowLeft, Receipt, Eye, FileText, Trash2, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const CustomerDetails = () => {
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

  // Set up form with customer data
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    values: customer ? {
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    } : undefined,
  });

  // Update form values when customer data is loaded
  React.useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
    }
  }, [customer, form]);

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

  const onSubmit = (data: CustomerFormValues) => {
    updateCustomerMutation.mutate(data);
  };

  if (isLoadingCustomer) {
    return (
      <AppLayout title="Customer Details">
        <div className="flex justify-center py-12">Loading customer details...</div>
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout title="Customer Details">
        <div className="flex flex-col items-center py-12">
          <p className="text-lg text-muted-foreground mb-4">Customer not found</p>
          <Button onClick={() => navigate("/customers")}>
            Back to Customers
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Customer: ${customer.name}`}>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/customers")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Customers
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>View and update customer information</CardDescription>
              </div>
              {!isEditing && (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Details
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Customer</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {customer.name}? This action cannot be undone.
                          {invoices.length > 0 && (
                            <p className="mt-2 font-semibold text-destructive">
                              Warning: This customer has {invoices.length} invoices associated with them. 
                              Deleting this customer may cause issues with those invoices.
                            </p>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteCustomerMutation.mutate()}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={updateCustomerMutation.isPending}
                      >
                        {updateCustomerMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                      <p className="mt-1">{customer.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="mt-1">
                        {customer.email || <span className="italic text-muted-foreground">Not provided</span>}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                      <p className="mt-1">
                        {customer.phone || <span className="italic text-muted-foreground">Not provided</span>}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
                      <p className="mt-1">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <p className="mt-1 whitespace-pre-wrap">
                      {customer.address || <span className="italic text-muted-foreground">Not provided</span>}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Summary</CardTitle>
              <CardDescription>Overview of customer activity</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-3">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Invoices</p>
                      <p className="text-2xl font-semibold">{invoices.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-3">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-2xl font-semibold">
                        {formatCurrency(
                          invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/invoices/create?customerId=${customer.id}`)}
                >
                  Create New Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Invoices */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All invoices associated with this customer</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingInvoices ? (
                <div className="flex justify-center py-8">Loading invoices...</div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No invoices found for this customer.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2" />
                              {new Date(invoice.issue_date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(invoice.total_amount)}
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                              ${
                                invoice.status === 'paid'
                                  ? 'bg-green-500/10 text-green-500'
                                  : invoice.status === 'overdue'
                                  ? 'bg-red-500/10 text-red-500'
                                  : invoice.status === 'sent'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            `}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/invoices/${invoice.id}`)}
                            >
                              <Eye size={16} className="mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerDetails;
