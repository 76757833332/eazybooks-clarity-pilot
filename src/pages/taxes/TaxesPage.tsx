
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Plus, Filter } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { taxService } from "@/services/taxService";
import { formatCurrency } from "@/lib/utils";
import { Tax, TaxCategory, TaxStatus } from "@/types/tax";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<TaxStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  paid: "bg-green-100 text-green-800 hover:bg-green-200",
  overdue: "bg-red-100 text-red-800 hover:bg-red-200",
  filed: "bg-blue-100 text-blue-800 hover:bg-blue-200"
};

const categoryLabels: Record<TaxCategory, string> = {
  income: "Income Tax",
  sales: "Sales Tax",
  property: "Property Tax",
  payroll: "Payroll Tax",
  other: "Other Tax"
};

const TaxesPage = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { data: taxes = [], isLoading, error } = useQuery({
    queryKey: ["taxes", categoryFilter, statusFilter],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      
      let query = supabase
        .from("taxes")
        .select("*")
        .eq("user_id", user.user.id);
        
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }
      
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      
      const { data, error } = await query.order("due_date", { ascending: false });
      
      if (error) {
        console.error("Error fetching taxes:", error);
        throw error;
      }
      
      return data as Tax[];
    },
  });
  
  const { data: summary = { pending: 0, paid: 0, overdue: 0, upcoming: 0, total: 0 }, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["tax-summary"],
    queryFn: taxService.getTaxSummary,
  });

  // Filter taxes based on selected filters
  const filteredTaxes = taxes.filter(tax => {
    const matchesCategory = categoryFilter === "all" || tax.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || tax.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  if (error) {
    console.error("Error fetching taxes:", error);
  }

  return (
    <AppLayout title="Taxes">
      <div className="flex flex-col space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Taxes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isSummaryLoading ? "..." : formatCurrency(summary.total)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isSummaryLoading ? "..." : formatCurrency(summary.paid)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming (30 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {isSummaryLoading ? "..." : formatCurrency(summary.upcoming)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {isSummaryLoading ? "..." : formatCurrency(summary.pending)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isSummaryLoading ? "..." : formatCurrency(summary.overdue)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters and Add Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tax Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tax Types</SelectItem>
                <SelectItem value="income">Income Tax</SelectItem>
                <SelectItem value="sales">Sales Tax</SelectItem>
                <SelectItem value="property">Property Tax</SelectItem>
                <SelectItem value="payroll">Payroll Tax</SelectItem>
                <SelectItem value="other">Other Tax</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="filed">Filed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full sm:w-auto bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
            onClick={() => navigate("/taxes/create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Tax Record
          </Button>
        </div>
        
        {/* Taxes Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-8 text-center">Loading tax records...</div>
            ) : filteredTaxes.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {taxes.length === 0 
                  ? "No tax records found. Add a new tax record to get started."
                  : "No tax records match the selected filters."
                }
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTaxes.map((tax) => (
                    <TableRow 
                      key={tax.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/taxes/${tax.id}`)}
                    >
                      <TableCell className="font-medium">
                        {tax.name}
                      </TableCell>
                      <TableCell>
                        {categoryLabels[tax.category as TaxCategory] || tax.category}
                      </TableCell>
                      <TableCell>
                        {format(new Date(tax.due_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(tax.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={statusColors[tax.status as TaxStatus]}>
                          {tax.status.charAt(0).toUpperCase() + tax.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TaxesPage;
