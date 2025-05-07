
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { ExpenseCategory, NewExpense } from "@/types/expense";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";

const CreateExpense: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch expense categories
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .order("name");

      if (error) {
        throw new Error(error.message);
      }
      return data as ExpenseCategory[];
    },
  });

  const form = useForm<NewExpense>({
    defaultValues: {
      category: "",
      amount: 0,
      description: "",
      expense_date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      payment_method: "Cash",
      status: "recorded",
      user_id: "", // Will be set on submit
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: NewExpense) => {
      const { error } = await supabase.from("expenses").insert([data]);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    },
    onSuccess: () => {
      toast.success("Expense recorded successfully!");
      navigate("/expenses");
    },
    onError: (error) => {
      console.error("Error recording expense:", error);
      toast.error("Failed to record expense. Please try again.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (data: NewExpense) => {
    setIsSubmitting(true);
    
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to record an expense");
      setIsSubmitting(false);
      return;
    }

    // Set the user_id
    const newExpense: NewExpense = {
      ...data,
      user_id: user.id,
    };
    
    createExpenseMutation.mutate(newExpense);
  };

  return (
    <AppLayout title="Record Expense">
      <div className="flex flex-col max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Record New Expense</h2>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        disabled={loadingCategories} 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
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
                  name="amount"
                  rules={{ 
                    required: "Amount is required",
                    min: { value: 0.01, message: "Amount must be greater than 0" } 
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expense_date"
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How was this paid?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Check">Check</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="recorded">Recorded</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="reimbursed">Reimbursed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={3} placeholder="Describe this expense..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/expenses")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Recording..." : "Record Expense"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateExpense;
