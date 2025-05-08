import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Filter, ArrowUpDown, ChevronDown, ChevronRight, Wallet } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getIncomes } from "@/services/incomeService";
import { formatCurrency } from "@/lib/utils";
import { IncomeSource, IncomeStatus } from "@/types/income";

const IncomePage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | null>(null);
  
  const { data: incomes, isLoading, error } = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
  });

  const filteredIncomes = filter 
    ? incomes?.filter(income => income.source === filter)
    : incomes;

  // Calculate total income (received only)
  const totalReceivedIncome = incomes
    ?.filter(income => income.status === "received")
    .reduce((sum, income) => sum + income.amount, 0) || 0;

  // Calculate pending income
  const totalPendingIncome = incomes
    ?.filter(income => income.status === "pending")
    .reduce((sum, income) => sum + income.amount, 0) || 0;

  // Group by source
  const incomeBySource = incomes?.reduce((acc, income) => {
    if (!acc[income.source]) {
      acc[income.source] = 0;
    }
    if (income.status === "received") {
      acc[income.source] += income.amount;
    }
    return acc;
  }, {} as Record<IncomeSource, number>) || {};

  // Get source with highest income
  let topSource: IncomeSource | null = null;
  let topAmount = 0;
  
  Object.entries(incomeBySource).forEach(([source, amount]) => {
    // Fix: Cast source to IncomeSource type and ensure amount is treated as number
    const typedSource = source as IncomeSource;
    const typedAmount = amount as number;
    
    if (typedAmount > topAmount) {
      topSource = typedSource;
      topAmount = typedAmount;
    }
  });

  const getStatusColor = (status: IncomeStatus) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getSourceColor = (source: IncomeSource) => {
    switch (source) {
      case "sales":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "services":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "consulting":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "investment":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "other":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <AppLayout title="Income">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Income</CardTitle>
              <CardDescription>Received payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalReceivedIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {incomes?.filter(i => i.status === "received").length || 0} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending Income</CardTitle>
              <CardDescription>Expected payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPendingIncome)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {incomes?.filter(i => i.status === "pending").length || 0} pending transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Top Income Source</CardTitle>
              <CardDescription>Highest revenue generator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {topSource ? topSource : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {topSource ? formatCurrency(topAmount) : "No data available"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <Button 
            onClick={() => navigate("/income/create")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Income
          </Button>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" /> 
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="h-4 w-4" /> 
                Sort
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" /> 
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {["sales", "services", "consulting", "investment", "other"].map((source) => (
            <Badge
              key={source}
              variant="outline"
              className={`
                cursor-pointer px-3 py-1 
                ${filter === source ? 'bg-primary/10 border-primary' : ''}
              `}
              onClick={() => setFilter(filter === source ? null : source)}
            >
              {filter === source && <ChevronRight className="mr-1 h-3 w-3" />}
              {source.charAt(0).toUpperCase() + source.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Income Table */}
        <Card>
          <CardHeader>
            <CardTitle>Income Transactions</CardTitle>
            <CardDescription>
              Manage your income sources and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading income data...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">
                Error loading income data
              </div>
            ) : filteredIncomes?.length === 0 ? (
              <div className="text-center py-8">
                <Wallet className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                <h3 className="mt-4 text-lg font-medium">No income recorded yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add your first income transaction to get started.
                </p>
                <Button 
                  onClick={() => navigate("/income/create")} 
                  className="mt-4"
                >
                  Add Income
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIncomes?.map((income) => (
                    <TableRow 
                      key={income.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/income/${income.id}`)}
                    >
                      <TableCell className="font-medium">{income.description}</TableCell>
                      <TableCell>
                        <Badge className={getSourceColor(income.source)}>
                          {income.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(income.income_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(income.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(income.status)}>
                          {income.status}
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

export default IncomePage;
