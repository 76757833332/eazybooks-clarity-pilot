
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/components/layout/AppLayout";
import { CustomerForm } from "@/components/customers/details/CustomerForm";
import { CustomerSummary } from "@/components/customers/details/CustomerSummary";
import { CustomerInvoices } from "@/components/customers/details/CustomerInvoices";
import { DeleteCustomerDialog } from "@/components/customers/details/DeleteCustomerDialog";
import { useCustomerDetails } from "@/hooks/customers/useCustomerDetails";

const CustomerDetails = () => {
  const {
    customer,
    invoices,
    isEditing,
    setIsEditing,
    isLoadingCustomer,
    isLoadingInvoices,
    handleSubmit,
    updateCustomerMutation,
    deleteCustomerMutation,
    navigate
  } = useCustomerDetails();

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
                  <DeleteCustomerDialog 
                    customerName={customer.name}
                    invoices={invoices}
                    onDelete={() => deleteCustomerMutation.mutate()}
                  />
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <CustomerForm 
                customer={customer}
                isEditing={isEditing}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                isSubmitting={updateCustomerMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>

        {/* Customer Summary */}
        <div>
          <CustomerSummary customerId={customer.id} invoices={invoices} />
        </div>

        {/* Customer Invoices */}
        <div className="lg:col-span-3">
          <CustomerInvoices 
            invoices={invoices} 
            isLoading={isLoadingInvoices} 
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerDetails;
