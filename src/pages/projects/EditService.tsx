import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { projectService } from "@/services/projectService";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
  is_hourly: z.boolean().default(true),
  delivery_time: z.coerce.number().int().min(0).optional().nullable(),
  tax_rate: z.coerce.number().min(0).max(100).optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const EditService: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => projectService.getServiceById(id as string),
    enabled: !!id,
  });

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
    values: service
      ? {
          name: service.name,
          description: service.description || "",
          rate: Number(service.rate),
          is_hourly: !!service.is_hourly,
          delivery_time: service.delivery_time ?? null,
          tax_rate: service.tax_rate ?? null,
        }
      : undefined,
  });

  const updateServiceMutation = useMutation({
    mutationFn: (data: any) => projectService.updateService(id as string, data),
    onSuccess: () => {
      toast({ title: "Service updated", description: "Your service has been updated." });
      navigate(`/projects/services/${id}`);
    },
    onError: (error) => {
      console.error("Error updating service:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update service." });
    },
  });

  const onSubmit = (data: FormValues) => {
    updateServiceMutation.mutate({
      name: data.name,
      description: data.description || null,
      rate: data.rate,
      is_hourly: data.is_hourly,
      delivery_time: data.delivery_time || null,
      tax_rate: data.tax_rate || null,
    });
  };

  if (isLoading || !service) {
    return (
      <AppLayout title="Edit Service">
        <div className="flex justify-center items-center h-64">Loading service...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Edit ${service.name}`}>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Service</CardTitle>
            <CardDescription>Update your service details</CardDescription>
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
                        <Textarea placeholder="Describe your service" className="h-20" {...field} />
                      </FormControl>
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
                        <FormLabel>Rate</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                            <Input type="number" placeholder="0.00" className="pl-7" {...field} />
                          </div>
                        </FormControl>
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
                          <FormLabel className="text-base">{field.value ? "Hourly Rate" : "Fixed Price"}</FormLabel>
                          <FormDescription>
                            {field.value ? "Billing based on tracked time" : "Fixed price regardless of time"}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => navigate(`/projects/services/${id}`)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateServiceMutation.isPending}>
                    {updateServiceMutation.isPending ? "Saving..." : "Save Changes"}
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

export default EditService;
