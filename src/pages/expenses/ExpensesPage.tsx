
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Filter, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Expense } from "@/types/expense";
import AppLayout from "@/components/layout/AppLayout";
import { formatCurrency } from "@/lib/utils";

const ExpensesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: expenses, isLoading } = useQuery({
    queryKey: ["expenses", statusFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("expenses")
        .select("*");
  
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('expense_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching expenses:", error);
        throw new Error(error.message);
      }
      
      return data as unknown as Expense[];
    },
  });

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'reimbursed':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'recorded':
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case 'pending':
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;

  return (
    <AppLayout title="Expenses">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">All Expenses</h2>
          <Button 
            className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
            asChild
          >
            <Link to="/expenses/create">
              <Plus size={16} className="mr-1" />
              Record Expense
            </Link>
          </Button>
        </div>
        
        {/* Expense summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-secondary/40">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</div>
          </Card>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                {statusFilter ? `Status: ${statusFilter}` : "Filter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("recorded")}>Recorded</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("reimbursed")}>Reimbursed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Expenses list */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eazybooks-purple"></div>
          </div>
        ) : !expenses?.length ? (
          <Card className="p-8 text-center bg-secondary/40">
            <div className="flex flex-col items-center gap-2">
              <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                {statusFilter || searchTerm 
                  ? "Try changing your filters or search term" 
                  : "Record your first expense to get started"}
              </p>
              <Button className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary" asChild>
                <Link to="/expenses/create">
                  <Plus size={16} className="mr-1" />
                  Record Expense
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 bg-secondary/40 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3 bg-secondary/40">Category</th>
                  <th className="px-4 py-3 bg-secondary/40">Description</th>
                  <th className="px-4 py-3 bg-secondary/40">Amount</th>
                  <th className="px-4 py-3 bg-secondary/40">Status</th>
                  <th className="px-4 py-3 bg-secondary/40 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {expenses?.map((expense) => (
                  <tr key={expense.id} className="hover:bg-secondary/20">
                    <td className="px-4 py-3">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {expense.category}
                    </td>
                    <td className="px-4 py-3">
                      {expense.description || "No description"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`${getStatusColor(expense.status)} rounded-md`}>
                        {expense.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/expenses/${expense.id}`}
                        className="text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ExpensesPage;
