
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, Users, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";
import { customerService } from "@/services/customerService";
import AppLayout from "@/components/layout/AppLayout";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  client_id: z.string().min(1, "Client is required"),
  due_date: z.date().nullable().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  requested_services: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateJobRequest: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch customers for dropdown
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getCustomers,
  });

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      client_id: "",
      due_date: undefined,
      priority: "medium",
      requested_services: [],
    },
  });

  // Handle job request creation
  const createJobRequestMutation = useMutation({
    mutationFn: (data: any) => projectService.createJobRequest(data),
    onSuccess: () => {
      toast({
        title: "Job request created",
        description: "Your job request has been created successfully.",
      });
      navigate("/projects/job-requests");
    },
    onError: (error) => {
      console.error("Error creating job request:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create job request. Please try again.",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createJobRequestMutation.mutate({
      title: data.title,
      description: data.description,
      client_id: data.client_id,
      due_date: data.due_date ? format(data.due_date, "yyyy-MM-dd") : null,
      priority: data.priority,
      requested_services: data.requested_services || [],
    });
  };

  return (
    <AppLayout title="Create Job Request">
      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job title" {...field} />
                  </FormControl>
                  <FormDescription>
                    A clear title describing the job request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the work needed in detail..."
                      className="h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about what needs to be done
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingCustomers ? (
                          <SelectItem value="loading" disabled>
                            Loading clients...
                          </SelectItem>
                        ) : customers.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No clients found
                          </SelectItem>
                        ) : (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the client who requested this job
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
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
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When should this job be completed by?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the priority level for this job request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-6 border-t">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate("/projects/job-requests")}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createJobRequestMutation.isPending}
              >
                {createJobRequestMutation.isPending ? "Creating..." : "Create Job Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default CreateJobRequest;
