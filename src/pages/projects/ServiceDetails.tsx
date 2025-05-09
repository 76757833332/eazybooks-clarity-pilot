
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, DollarSign, Pencil } from "lucide-react";
import { format } from "date-fns";
import { projectService } from "@/services/projectService";
import { Service } from "@/types/project";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch service details
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: () => projectService.getServiceById(id as string),
    enabled: !!id
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => projectService.deleteService(id),
    onSuccess: () => {
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
      });
      navigate("/projects/services");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete service",
        description: "There was an error deleting the service.",
      });
      console.error("Error deleting service:", error);
    }
  });

  const handleDeleteService = () => {
    if (!service) return;
    deleteServiceMutation.mutate(service.id);
  };

  if (isLoading) {
    return (
      <AppLayout title="Service Details">
        <div className="flex justify-center items-center h-64">
          Loading service details...
        </div>
      </AppLayout>
    );
  }

  if (!service) {
    return (
      <AppLayout title="Service Not Found">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service not found</h2>
          <p className="mb-6">The service you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/projects/services")}>Go back to Services</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={service.name}>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  Service details and pricing
                </CardDescription>
              </div>
              <Badge variant={service.is_hourly ? "info" : "secondary"}>
                {service.is_hourly ? "Hourly Rate" : "Fixed Price"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {service.description && (
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-1">Rate</h3>
                <div className="flex items-center text-2xl font-semibold">
                  <DollarSign className="h-5 w-5 mr-1 text-green-500" />
                  {formatCurrency(service.rate)}
                  {service.is_hourly && <span className="text-sm text-muted-foreground ml-1">/hour</span>}
                </div>
              </div>
              
              {service.delivery_time !== null && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-1">Estimated Delivery Time</h3>
                  <div className="flex items-center text-2xl font-semibold">
                    <Clock className="h-5 w-5 mr-1 text-blue-500" />
                    {service.delivery_time} hours
                  </div>
                </div>
              )}
              
              {service.tax_rate !== null && (
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-1">Tax Rate</h3>
                  <div className="flex items-center text-2xl font-semibold">
                    {service.tax_rate}%
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Date Added</h3>
              <p className="text-muted-foreground">
                {format(new Date(service.created_at), "PPP")}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/projects/services")}
            >
              Back to Services
            </Button>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Service</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      service and remove it from any linked tasks or projects.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteService}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button onClick={() => navigate(`/projects/services/edit/${service.id}`)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit Service
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ServiceDetails;
