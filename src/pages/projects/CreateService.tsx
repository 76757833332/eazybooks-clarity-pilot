
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";
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
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
  is_hourly: z.boolean().default(true),
  delivery_time: z.coerce.number().int().min(0).optional().nullable(),
  tax_rate: z.coerce.number().min(0).max(100).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateService: React.FC = () => {
  const navigate = useNavigate();
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      rate: 0,
      is_hourly: true,
      delivery_time: null,
      tax_rate: null,
    },
  });

  const isHourly = form.watch("is_hourly");

  // Handle service creation
  const createServiceMutation = useMutation({
    mutationFn: (data: any) => projectService.createService(data),
    onSuccess: () => {
      toast({
        title: "Service created",
        description: "Your service has been created successfully.",
      });
      navigate("/projects/services");
    },
    onError: (error) => {
      console.error("Error creating service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create service. Please try again.",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createServiceMutation.mutate({
      name: data.name,
      description: data.description || null,
      rate: data.rate,
      is_hourly: data.is_hourly,
      delivery_time: data.delivery_time || null,
      tax_rate: data.tax_rate || null,
    });
  };

  return (
    <AppLayout title="Add Service">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Service</CardTitle>
            <CardDescription>
              Add a new service or product to your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your service or product
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
                          placeholder="Describe your service or product..."
                          className="h-20"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional details about what this service includes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rate {isHourly ? "(per hour)" : "(fixed)"}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-7"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {isHourly ? "The hourly rate for this service" : "The fixed price for this service"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_hourly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {field.value ? "Hourly Rate" : "Fixed Price"}
                          </FormLabel>
                          <FormDescription>
                            {field.value 
                              ? "Billing will be based on tracked time" 
                              : "Fixed price regardless of time spent"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="delivery_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Delivery Time (hours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter hours" 
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : parseInt(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: How many hours this typically takes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              placeholder="Enter tax rate" 
                              {...field}
                              value={field.value === null ? "" : field.value}
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Optional: Tax rate to apply for this service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/projects/services")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createServiceMutation.isPending}
                  >
                    {createServiceMutation.isPending ? "Creating..." : "Create Service"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateService;
