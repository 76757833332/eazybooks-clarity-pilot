
import React from "react";
import { Link } from "react-router-dom";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyInvoiceStateProps {
  statusFilter: string | null;
  searchTerm: string;
}

export const EmptyInvoiceState = ({ statusFilter, searchTerm }: EmptyInvoiceStateProps) => {
  return (
    <Card className="p-8 text-center bg-secondary/40">
      <div className="flex flex-col items-center gap-2">
        <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium">No invoices found</h3>
        <p className="text-muted-foreground mb-4">
          {statusFilter || searchTerm 
            ? "Try changing your filters or search term" 
            : "Create your first invoice to get started"}
        </p>
        <Button className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary" asChild>
          <Link to="/invoices/create">
            <Plus size={16} className="mr-1" />
            Create Invoice
          </Link>
        </Button>
      </div>
    </Card>
  );
};
