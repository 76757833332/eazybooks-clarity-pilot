
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  DollarSign, 
  Clock, 
  Percent,
  Trash2, 
  PenLine,
  FileText
} from "lucide-react";
import { Service } from "@/types/project";
import { projectService } from "@/services/projectService";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch services
  const { data: services = [], isLoading, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: projectService.getServices,
  });

  // Delete service
  const handleDeleteService = async (id: string) => {
    try {
      await projectService.deleteService(id);
      toast({
        title: "Service deleted",
        description: "The service has been removed successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service. Please try again.",
      });
    }
  };

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AppLayout title="Services">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => navigate("/projects/services/create")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Services Catalog</CardTitle>
            <CardDescription>
              Manage your services and products for client billing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading services...</div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm 
                  ? "No services match your search criteria." 
                  : "No services found. Create your first service to get started."}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead className="hidden md:table-cell">Rate</TableHead>
                      <TableHead className="hidden lg:table-cell">Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Delivery Time</TableHead>
                      <TableHead className="hidden xl:table-cell">Tax Rate</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id} className="cursor-pointer" onClick={() => navigate(`/projects/services/${service.id}`)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-2">
                              <FileText size={16} />
                            </div>
                            {service.name}
                          </div>
                          {service.description && (
                            <div className="text-xs text-muted-foreground mt-1 truncate max-w-60">
                              {service.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign size={14} className="mr-1" />
                            {formatCurrency(service.rate)}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant={service.is_hourly ? "default" : "secondary"}>
                            {service.is_hourly ? "Hourly" : "Fixed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {service.delivery_time ? (
                            <div className="flex items-center text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              {service.delivery_time} {service.delivery_time === 1 ? "hour" : "hours"}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not specified</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {service.tax_rate !== null ? (
                            <div className="flex items-center text-muted-foreground">
                              <Percent size={14} className="mr-1" />
                              {service.tax_rate}%
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No tax</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/services/${service.id}`);
                              }}
                            >
                              <PenLine size={16} />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this service? This may affect tasks and projects that reference this service.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ServicesPage;
