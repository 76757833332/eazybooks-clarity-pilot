
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  UserRound, 
  Mail, 
  Phone, 
  Map, 
  Trash2, 
  PenLine
} from "lucide-react";
import { Customer } from "@/types/invoice";
import { customerService } from "@/services/customerService";
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

const CustomersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customers
  const { data: customers = [], isLoading, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getCustomers,
  });

  // Delete customer
  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerService.deleteCustomer(id);
      toast({
        title: "Customer deleted",
        description: "The customer has been removed successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer. Please try again.",
      });
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AppLayout title="Customers">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => navigate("/customers/create")}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>
              Manage your customer database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm 
                  ? "No customers match your search criteria." 
                  : "No customers found. Add your first customer to get started."}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-eazybooks-purple bg-opacity-15 flex items-center justify-center text-eazybooks-purple mr-2">
                              <UserRound size={16} />
                            </div>
                            {customer.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.email ? (
                            <div className="flex items-center text-muted-foreground">
                              <Mail size={14} className="mr-1" />
                              {customer.email}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No email</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {customer.phone ? (
                            <div className="flex items-center text-muted-foreground">
                              <Phone size={14} className="mr-1" />
                              {customer.phone}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No phone</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {customer.address ? (
                            <div className="flex items-center text-muted-foreground">
                              <Map size={14} className="mr-1" />
                              {customer.address.length > 30 ? `${customer.address.substring(0, 30)}...` : customer.address}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">No address</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/customers/${customer.id}`)}
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
                                  <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {customer.name}? This action cannot be undone.
                                    Note: Deleting a customer with associated invoices may cause data inconsistencies.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
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

export default CustomersPage;
