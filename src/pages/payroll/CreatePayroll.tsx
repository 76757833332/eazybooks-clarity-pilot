
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Minus } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Employee } from "@/types/employee";
import { NewPayroll, DeductionType } from "@/types/payroll";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  employee_id: z.string().uuid("Please select an employee"),
  pay_period_start: z.date(),
  pay_period_end: z.date(),
  payment_date: z.date(),
  gross_amount: z.number().min(0.01, "Gross amount must be greater than 0"),
  deductions: z.array(
    z.object({
      deduction_type_id: z.string().uuid("Please select a deduction type"),
      amount: z.number(),
      isCustomAmount: z.boolean().default(false),
      customAmount: z.number().optional(),
    })
  ).optional(),
  taxes: z.number().min(0, "Taxes must be a positive number"),
  notes: z.string().optional(),
  status: z.enum(["pending", "processed", "paid", "cancelled"]),
});

type FormValues = z.infer<typeof formSchema>;

const fetchEmployees = async () => {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("status", "active")
    .order("last_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Employee[];
};

const fetchDeductionTypes = async () => {
  const { data, error } = await supabase
    .from("deduction_types")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as DeductionType[];
};

const calculateNetAmount = (gross: number, taxes: number, deductionsTotal: number) => {
  return Math.max(0, gross - taxes - deductionsTotal);
};

const CreatePayroll = () => {
  const navigate = useNavigate();
  const [selectedDeductions, setSelectedDeductions] = useState<
    Array<{ deduction_type_id: string; amount: number; isCustomAmount: boolean; customAmount?: number }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [netAmount, setNetAmount] = useState(0);

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const { data: deductionTypes = [], isLoading: isLoadingDeductionTypes } = useQuery({
    queryKey: ["deduction-types"],
    queryFn: fetchDeductionTypes,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      pay_period_start: new Date(),
      pay_period_end: new Date(),
      payment_date: new Date(),
      gross_amount: 0,
      deductions: [],
      taxes: 0,
      notes: "",
      status: "pending",
    },
  });

  const { watch, setValue } = form;
  const grossAmount = watch("gross_amount");
  const taxes = watch("taxes");
  const watchedDeductions = watch("deductions") || [];

  // Update net amount when values change
  useEffect(() => {
    const deductionsTotal = watchedDeductions.reduce((sum, deduction) => {
      const amount = deduction.isCustomAmount && deduction.customAmount !== undefined
        ? deduction.customAmount
        : deduction.amount;
      return sum + amount;
    }, 0);
    
    setNetAmount(calculateNetAmount(grossAmount, taxes, deductionsTotal));
  }, [grossAmount, taxes, watchedDeductions]);

  // Handle employee selection to set default gross amount
  const handleEmployeeChange = (employeeId: string) => {
    const selectedEmployee = employees.find((emp) => emp.id === employeeId);
    if (selectedEmployee) {
      // Set to a biweekly pay (annual salary / 26)
      const biweeklyPay = selectedEmployee.salary / 26;
      form.setValue("gross_amount", parseFloat(biweeklyPay.toFixed(2)));
      
      // Calculate default taxes (20% of gross)
      const defaultTaxes = biweeklyPay * 0.2;
      form.setValue("taxes", parseFloat(defaultTaxes.toFixed(2)));
      
      // Add default deductions
      applyDefaultDeductions(biweeklyPay);
    }
  };

  // Apply default deductions for the employee
  const applyDefaultDeductions = (grossAmount: number) => {
    const newDeductions = deductionTypes.map(deductionType => {
      let amount = 0;
      
      if (deductionType.is_percentage && deductionType.rate) {
        // Calculate percentage-based deduction
        amount = parseFloat((grossAmount * (deductionType.rate / 100)).toFixed(2));
      } else if (!deductionType.is_percentage && deductionType.rate) {
        // Use fixed amount deduction
        amount = deductionType.rate;
      }
      
      return {
        deduction_type_id: deductionType.id,
        amount,
        isCustomAmount: false,
        customAmount: undefined,
      };
    });
    
    setValue("deductions", newDeductions);
    setSelectedDeductions(newDeductions);
  };

  // Toggle custom amount for deduction
  const toggleCustomAmount = (index: number) => {
    const updatedDeductions = [...watchedDeductions];
    updatedDeductions[index].isCustomAmount = !updatedDeductions[index].isCustomAmount;
    
    // If switching from custom to default, remove custom amount
    if (!updatedDeductions[index].isCustomAmount) {
      updatedDeductions[index].customAmount = undefined;
    }
    
    setValue("deductions", updatedDeductions);
  };

  // Update custom amount for deduction
  const updateCustomAmount = (index: number, amount: number) => {
    const updatedDeductions = [...watchedDeductions];
    updatedDeductions[index].customAmount = amount;
    setValue("deductions", updatedDeductions);
  };

  // Find deduction type by ID
  const getDeductionTypeById = (id: string) => {
    return deductionTypes.find(dt => dt.id === id);
  };

  const createPayrollMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      // Calculate total deductions amount
      const deductionsTotal = formData.deductions?.reduce((sum, deduction) => {
        const amount = deduction.isCustomAmount && deduction.customAmount !== undefined
          ? deduction.customAmount
          : deduction.amount;
        return sum + amount;
      }, 0) || 0;
      
      // Calculate net amount
      const calculatedNetAmount = calculateNetAmount(formData.gross_amount, formData.taxes, deductionsTotal);

      // Create payroll record
      const payrollData: NewPayroll = {
        employee_id: formData.employee_id,
        pay_period_start: format(formData.pay_period_start, "yyyy-MM-dd"),
        pay_period_end: format(formData.pay_period_end, "yyyy-MM-dd"),
        payment_date: format(formData.payment_date, "yyyy-MM-dd"),
        gross_amount: formData.gross_amount,
        net_amount: calculatedNetAmount,
        taxes: formData.taxes,
        deductions: deductionsTotal,
        notes: formData.notes,
        status: formData.status,
        user_id: (await supabase.auth.getUser()).data.user?.id as string,
      };

      // Insert payroll record
      const { data: payrollRecord, error: payrollError } = await supabase
        .from("payrolls")
        .insert(payrollData)
        .select();

      if (payrollError) throw new Error(payrollError.message);
      
      // Insert deduction records if deductions exist
      if (formData.deductions && formData.deductions.length > 0 && payrollRecord[0]) {
        const deductionRecords = formData.deductions.map(deduction => ({
          payroll_id: payrollRecord[0].id,
          deduction_type_id: deduction.deduction_type_id,
          amount: deduction.isCustomAmount && deduction.customAmount !== undefined
            ? deduction.customAmount
            : deduction.amount,
        }));

        const { error: deductionsError } = await supabase
          .from("payroll_deductions")
          .insert(deductionRecords);

        if (deductionsError) throw new Error(deductionsError.message);
      }

      return payrollRecord[0];
    },
    onSuccess: (data) => {
      toast({
        title: "Payroll created",
        description: "The payroll record has been successfully created.",
      });
      navigate("/payroll");
    },
    onError: (error) => {
      toast({
        title: "Error creating payroll",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    createPayrollMutation.mutate(values);
  };

  if (isLoadingEmployees || isLoadingDeductionTypes) {
    return (
      <AppLayout title="Create Payroll">
        <div className="flex justify-center py-12">Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Create Payroll">
      <div className="mx-auto max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Information</CardTitle>
                <CardDescription>
                  Create a new payroll record for an employee
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="employee_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleEmployeeChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.length === 0 ? (
                            <SelectItem value="no-employees" disabled>
                              No active employees found
                            </SelectItem>
                          ) : (
                            employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.first_name} {employee.last_name} - {employee.position}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the employee for this payroll record
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="pay_period_start"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Pay Period Start</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
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
                    name="pay_period_end"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Pay Period End</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
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
                    name="payment_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Payment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
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
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gross_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gross Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taxes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Deductions</FormLabel>
                  </div>

                  {watchedDeductions.map((deduction, index) => {
                    const deductionType = getDeductionTypeById(deduction.deduction_type_id);
                    const displayName = deductionType ? deductionType.name : "Unknown Deduction";
                    
                    return (
                      <div key={index} className="flex items-center gap-4 rounded-md border p-3">
                        <div className="flex-1">
                          <div className="font-medium">{displayName}</div>
                          {deductionType?.description && (
                            <div className="text-sm text-muted-foreground">{deductionType.description}</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {deduction.isCustomAmount ? (
                            <Input
                              type="number"
                              step="0.01"
                              className="w-24"
                              value={deduction.customAmount ?? deduction.amount}
                              onChange={(e) => updateCustomAmount(index, parseFloat(e.target.value) || 0)}
                            />
                          ) : (
                            <div className="w-24 text-right font-medium">
                              {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                              }).format(deduction.amount)}
                            </div>
                          )}
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCustomAmount(index)}
                          >
                            {deduction.isCustomAmount ? "Reset" : "Edit"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
                          placeholder="Add any notes or comments about this payroll record"
                          className="min-h-[100px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t p-6">
                <div className="ml-auto space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Gross Amount:</span>
                    <span>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(grossAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes:</span>
                    <span>
                      -{new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(taxes)}
                    </span>
                  </div>
                  {watchedDeductions.map((deduction, index) => {
                    const deductionType = getDeductionTypeById(deduction.deduction_type_id);
                    const displayName = deductionType ? deductionType.name : "Deduction";
                    const amount = deduction.isCustomAmount && deduction.customAmount !== undefined
                      ? deduction.customAmount
                      : deduction.amount;
                    
                    return (
                      <div key={index} className="flex justify-between text-muted-foreground">
                        <span>{displayName}:</span>
                        <span>
                          -{new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(amount)}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Net Amount:</span>
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(netAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/payroll")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Payroll"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default CreatePayroll;
