
import React from "react";
import { format } from "date-fns";
import { Tax } from "@/types/tax";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface TaxReportTableProps {
  taxes: Tax[];
}

const TaxReportTable: React.FC<TaxReportTableProps> = ({ taxes }) => {
  if (!taxes?.length) {
    return <div className="text-center py-4">No tax records found</div>;
  }

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-500/20 text-green-700">Paid</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-500/20 text-red-700">Overdue</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700">Pending</Badge>;
      case 'filed':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-700">Filed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxes.map((tax) => (
            <TableRow key={tax.id}>
              <TableCell className="font-medium">{tax.name}</TableCell>
              <TableCell className="capitalize">{tax.category}</TableCell>
              <TableCell className="text-right">{formatCurrency(tax.amount)}</TableCell>
              <TableCell>{format(new Date(tax.due_date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{getStatusBadge(tax.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaxReportTable;
