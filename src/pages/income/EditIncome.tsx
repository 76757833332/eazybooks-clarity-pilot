import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { getIncomeById, updateIncome, getIncomeSources, getIncomeStatuses } from "@/services/incomeService";
import type { Income } from "@/types/income";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.string().refine((value) => {
    return /^\d+(\.\d{1,2})?$/.test(value);
  }, {
    message: "Amount must be a valid number with up to 2 decimal places.",
  }),
  date: z.date(),
  source: z.string({
    required_error: "Please select an income source.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  notes: z.string().optional(),
});

const EditIncome: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sources, setSources] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [income, setIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      date: new Date(),
      source: "",
      status: "",
      notes: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [incomeSources, incomeStatuses] = await Promise.all([
          getIncomeSources(),
          getIncomeStatuses()
        ]);
        setSources(incomeSources);
        setStatuses(incomeStatuses);
      } catch (e) {
        console.error("Error loading selection data:", e);
        toast.error("Failed to load form data");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const fetchIncome = async () => {
      if (!id) return;
      try {
        const data = await getIncomeById(id);
        setIncome(data);
        // Prefill form
        form.reset({
          description: data.description,
          amount: String(data.amount),
          date: new Date(data.income_date),
          source: data.source,
          status: data.status,
          notes: data.notes || "",
        });
      } catch (error) {
        console.error("Error fetching income:", error);
        toast.error("Failed to load income");
      } finally {
        setLoading(false);
      }
    };
    fetchIncome();
  }, [id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateIncome(id, {
        description: values.description,
        amount: parseFloat(values.amount),
        income_date: values.date.toISOString(),
        source: values.source as any,
        status: values.status as any,
        notes: values.notes || undefined,
      });
      toast.success("Income updated!");
      navigate(`/income/${id}`);
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppLayout title="Edit Income">
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Edit Income</h1>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : !income ? (
          <div className="text-sm text-destructive">Income not found</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Client Payment"
                        className="bg-secondary/20 border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 50.00"
                        className="bg-secondary/20 border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3.5 bg-secondary/20 border-border text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <select
                      className="bg-secondary/20 border-border rounded-md h-10 px-3"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="" disabled>
                        Select income source
                      </option>
                      {sources.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
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
                    <select
                      className="bg-secondary/20 border-border rounded-md h-10 px-3"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="" disabled>
                        Select status
                      </option>
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional notes..."
                        className="bg-secondary/20 border-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </AppLayout>
  );
};

export default EditIncome;
