
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { taxService } from "@/services/taxService";
import { TaxCategory, TaxStatus } from "@/types/tax";

const taxSchema = z.object({
  name: z.string().min(1, "Tax name is required"),
  category: z.enum(["income", "sales", "property", "payroll", "other"] as const),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  due_date: z.string().min(1, "Due date is required"),
  period_start: z.string().optional(),
  period_end: z.string().optional(),
  payment_date: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "paid", "overdue", "filed"] as const),
  tax_authority: z.string().optional().or(z.literal("")),
  tax_id_number: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type TaxFormValues = z.infer<typeof taxSchema>;

const EditTax = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      name: "",
      category: "income",
      amount: 0,
      due_date: "",
      period_start: "",
      period_end: "",
      payment_date: "",
      status: "pending",
      tax_authority: "",
      tax_id_number: "",
      notes: "",
    },
  });

  const { data: tax, isLoading } = useQuery({
    queryKey: ["tax", id],
    queryFn: () => taxService.getTaxById(id!),
    enabled: !!id,
  });
  
  // Populate form with tax data when available
  useEffect(() => {
    if (tax) {
      form.reset({
        name: tax.name,
        category: tax.category as TaxCategory,
        amount: tax.amount,
        due_date: tax.due_date.substring(0, 10),
        period_start: tax.period_start ? tax.period_start.substring(0, 10) : "",
        period_end: tax.period_end ? tax.period_end.substring(0, 10) : "",
        payment_date: tax.payment_date ? tax.payment_date.substring(0, 10) : "",
        status: tax.status as TaxStatus,
        tax_authority: tax.tax_authority || "",
        tax_id_number: tax.tax_id_number || "",
        notes: tax.notes || "",
      });
    }
  }, [tax, form]);

  const updateTaxMutation = useMutation({
    mutationFn: (data: TaxFormValues) => taxService.updateTax(id!, {
      ...data,
      amount: Number(data.amount),
    }),
    onSuccess: () => {
      toast({
        title: "Tax record updated",
        description: "Your tax record has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["tax", id] });
      navigate(`/taxes/${id}`);
    },
    onError: (error) => {
      console.error("Error updating tax record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tax record. Please try again.",
      });
    },
  });

  const onSubmit = (data: TaxFormValues) => {
    updateTaxMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AppLayout title="Edit Tax Record">
        <div className="flex justify-center py-12">Loading tax record...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Edit Tax Record">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(`/taxes/${id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tax Details
      </Button>
      
      <div className="mx-auto max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-eazybooks-purple" />
              <h2 className="text-2xl font-semibold">Edit Tax Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Income Tax 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tax category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income Tax</SelectItem>
                        <SelectItem value="sales">Sales Tax</SelectItem>
                        <SelectItem value="property">Property Tax</SelectItem>
                        <SelectItem value="payroll">Payroll Tax</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="filed">Filed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="period_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period Start</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="period_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period End</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Only if already paid
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tax_authority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Authority</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. IRS, State Tax Board" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tax_id_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID/Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any notes about this tax record" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/taxes/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTaxMutation.isPending} className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary">
                {updateTaxMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default EditTax;
