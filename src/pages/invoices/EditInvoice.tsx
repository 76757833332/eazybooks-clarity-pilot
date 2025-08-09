
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/invoice";
import { invoiceService } from "@/services/invoice";

// Local form type allowing optional id on items for edit scenarios
interface EditInvoiceFormValues {
  customer_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  notes: string;
  items: Array<{
    id?: string;
    description: string;
    quantity: number;
    price: number;
  }>;
}

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [removedItemIds, setRemovedItemIds] = useState<string[]>([]);

  // Fetch customers
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data || []) as Customer[];
    },
  });

  // Fetch invoice with items
  const { data: invoiceWithItems, isLoading } = useQuery({
    queryKey: ["invoice-edit", id],
    queryFn: () => invoiceService.getInvoiceById(id as string),
    enabled: !!id,
  });

  const form = useForm<EditInvoiceFormValues>({
    defaultValues: {
      customer_id: "",
      invoice_number: "",
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      notes: "",
      items: [{ description: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Populate form when data is ready
  useEffect(() => {
    if (!invoiceWithItems) return;
    form.reset({
      customer_id: invoiceWithItems.customer_id || "",
      invoice_number: invoiceWithItems.invoice_number,
      issue_date: invoiceWithItems.issue_date,
      due_date: invoiceWithItems.due_date,
      notes: invoiceWithItems.notes || "",
      items: (invoiceWithItems.items || []).map((it) => ({
        id: it.id,
        description: it.description,
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
      })),
    });
    setRemovedItemIds([]);
  }, [invoiceWithItems, form]);

  const calculateItemAmount = (q: number, p: number) => (Number(q) || 0) * (Number(p) || 0);
  const calculateTotal = () =>
    form.getValues("items").reduce((sum, item) => sum + calculateItemAmount(item.quantity, item.price), 0);

  const handleRemoveItem = (index: number) => {
    const item = form.getValues(`items.${index}` as const);
    if ((item as any)?.id) setRemovedItemIds((prev) => [...prev, String((item as any).id)]);
    remove(index);
  };

  const onSubmit = async (data: EditInvoiceFormValues) => {
    if (!id) return;
    try {
      const total = data.items.reduce((sum, it) => sum + calculateItemAmount(it.quantity, it.price), 0);

      // Prepare invoice partial
      const updatedInvoice = {
        customer_id: data.customer_id,
        invoice_number: data.invoice_number,
        issue_date: data.issue_date,
        due_date: data.due_date,
        notes: data.notes,
        total_amount: total,
      } as any;

      // Prepare items array with optional id for updates/inserts
      const itemsPayload = data.items.map((it) => ({
        id: (it as any).id,
        description: it.description,
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
      }));

      await invoiceService.updateInvoice(id, updatedInvoice, itemsPayload as any);

      // Delete removed items
      if (removedItemIds.length) {
        await Promise.all(removedItemIds.map((itemId) => invoiceService.deleteInvoiceItem(itemId)));
      }

      toast({ title: "Invoice updated", description: "Changes saved successfully." });
      navigate(`/invoices/${id}`);
    } catch (error: any) {
      console.error("Error updating invoice:", error);
      toast({ variant: "destructive", title: "Failed to update", description: error?.message || "Unexpected error." });
    }
  };

  return (
    <AppLayout title="Edit Invoice">
      {isLoading || !invoiceWithItems ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eazybooks-purple"></div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description` as const}
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
                          name={`items.${index}.quantity` as const}
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
                          name={`items.${index}.price` as const}
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
                          ${calculateItemAmount(
                            Number(form.getValues(`items.${index}.quantity` as const)) || 0,
                            Number(form.getValues(`items.${index}.price` as const)) || 0
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
                            onClick={() => handleRemoveItem(index)}
                          >
                            ×
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
              <Button type="button" variant="outline" onClick={() => navigate(`/invoices/${id}`)} className="w-32">
                Cancel
              </Button>
              <Button type="submit" className="w-32 bg-eazybooks-purple hover:bg-eazybooks-purple-secondary">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      )}
    </AppLayout>
  );
};

export default EditInvoice;
