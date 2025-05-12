
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { invoiceService } from "@/services/invoice";
import { Customer, NewInvoice, NewInvoiceItem } from "@/types/invoice";
import { InvoiceFormValues } from "./types";

interface InvoiceFormProps {
  customers?: Customer[];
  invoiceNumber?: string;
}

export const InvoiceForm = ({ customers, invoiceNumber }: InvoiceFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<InvoiceFormValues>({
    defaultValues: {
      customer_id: "",
      invoice_number: invoiceNumber || "",
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: "",
      items: [{ description: "", quantity: 1, price: 0 }],
    },
  });

  // Update invoice number when available
  React.useEffect(() => {
    if (invoiceNumber && !form.getValues("invoice_number")) {
      form.setValue("invoice_number", invoiceNumber);
    }
  }, [invoiceNumber, form]);

  // Add useFieldArray for managing the items array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Calculate totals
  const calculateItemAmount = (quantity: number, price: number) => {
    return (quantity || 0) * (price || 0);
  };

  const calculateTotal = () => {
    return form
      .getValues("items")
      .reduce((sum, item) => sum + calculateItemAmount(Number(item.quantity) || 0, Number(item.price) || 0), 0);
  };

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormValues) => {
      // Prepare invoice data
      const newInvoice: NewInvoice = {
        user_id: "", // Will be set by the service
        customer_id: data.customer_id,
        invoice_number: data.invoice_number,
        issue_date: data.issue_date,
        due_date: data.due_date,
        status: "draft",
        total_amount: calculateTotal(),
        notes: data.notes,
      };

      // Prepare invoice items
      const invoiceItems: NewInvoiceItem[] = data.items.map((item) => ({
        invoice_id: "", // Will be set by the service
        description: item.description,
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        amount: calculateItemAmount(Number(item.quantity) || 0, Number(item.price) || 0),
      }));

      // Create the invoice
      return await invoiceService.createInvoice(newInvoice, invoiceItems);
    },
    onSuccess: (data) => {
      toast({
        title: "Invoice created",
        description: `Invoice #${data.invoice_number} has been created successfully.`,
      });

      navigate(`/invoices/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Error creating invoice:", error);
      toast({
        variant: "destructive",
        title: "Failed to create invoice",
        description: error.message || "An unexpected error occurred.",
      });
    }
  });

  // Submit handler
  const handleSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true);
    try {
      await createInvoiceMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Invoice Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoice_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ description: "", quantity: 1, price: 0 })}
                className="gap-1"
              >
                <Plus size={14} />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value, 10) : 0;
                                field.onChange(value);
                                form.trigger("items");
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : 0;
                                field.onChange(value);
                                form.trigger("items");
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormLabel>Amount</FormLabel>
                    <div className="h-10 px-3 py-2 rounded-md border border-input bg-secondary/40 flex items-center">
                      $
                      {calculateItemAmount(
                        Number(form.getValues(`items.${index}.quantity`)) || 0,
                        Number(form.getValues(`items.${index}.price`)) || 0
                      ).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1 pb-1">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t mt-6">
              <div className="flex justify-end">
                <div className="w-1/3">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Add any notes here..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/invoices")}
            className="w-32"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="w-32 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={16} />
                Save Invoice
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
