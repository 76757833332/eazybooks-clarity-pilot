
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { createLeaveApplication } from '@/services/leaveService';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/layout/Sidebar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const leaveFormSchema = z.object({
  employee_id: z.string().min(1, { message: 'Please select an employee' }),
  start_date: z.string().min(1, { message: 'Start date is required' }),
  end_date: z.string().min(1, { message: 'End date is required' }),
  leave_type: z.string().min(1, { message: 'Leave type is required' }),
  reason: z.string().optional(),
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

const ApplyForLeave: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(), 'yyyy-MM-dd'),
      leave_type: 'vacation',
      reason: '',
    },
  });
  
  // Fetch employees that belong to the current user
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('User not found');
      
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.user.id);
        
      if (error) throw error;
      return data;
    },
  });
  
  const onSubmit = async (values: LeaveFormValues) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to apply for leave",
          variant: "destructive",
        });
        return;
      }
      
      await createLeaveApplication({
        ...values,
        user_id: user.user.id,
      });
      
      toast({
        title: "Success",
        description: "Leave application submitted successfully",
      });
      
      navigate('/leaves');
    } catch (error) {
      console.error('Error submitting leave application:', error);
      toast({
        title: "Error",
        description: "Failed to submit leave application",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-eazybooks-purple-dark/80">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-border p-4">
          <h1 className="text-xl font-bold">Apply for Leave</h1>
        </header>
        
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Leave Application Form</h2>
              <p className="text-muted-foreground">Submit your leave request for approval.</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center p-8">Loading employees...</div>
            ) : !employees || employees.length === 0 ? (
              <div className="bg-amber-500/20 border border-amber-500/50 p-4 rounded-lg">
                <p className="text-amber-200">You need to add employees before applying for leave.</p>
                <Button 
                  onClick={() => navigate('/payroll/employees/create')}
                  className="mt-4 bg-amber-500 hover:bg-amber-600"
                >
                  Add Employee
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="employee_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.first_name} {employee.last_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="date" {...field} />
                              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type="date" {...field} />
                              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="leave_type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Leave Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            {['vacation', 'sick', 'personal', 'bereavement', 'unpaid'].map((type) => (
                              <FormItem
                                key={type}
                                className="flex items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <RadioGroupItem value={type} />
                                </FormControl>
                                <FormLabel className="font-normal capitalize">
                                  {type}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide details about your leave request"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplyForLeave;
