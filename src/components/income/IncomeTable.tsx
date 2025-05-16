
import React from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Income, IncomeSource, IncomeStatus } from "@/types/income";

interface IncomeTableProps {
  incomes: Income[];
  filteredIncomes: Income[];
  isLoading: boolean;
  error: Error | null;
}

const IncomeTable: React.FC<IncomeTableProps> = ({ 
  incomes, 
  filteredIncomes, 
  isLoading, 
  error 
}) => {
  const navigate = useNavigate();

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

  const renderTableContent = () => {
    if (isLoading) {
      return <div className="text-center py-4">Loading income data...</div>;
    }

    if (error) {
      return (
        <div className="text-center text-red-500 py-4">
          Error loading income data
        </div>
      );
    }

    if (filteredIncomes?.length === 0) {
      return (
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
      );
    }

    return (
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
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Transactions</CardTitle>
        <CardDescription>
          Manage your income sources and transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderTableContent()}
      </CardContent>
    </Card>
  );
};

export default IncomeTable;
