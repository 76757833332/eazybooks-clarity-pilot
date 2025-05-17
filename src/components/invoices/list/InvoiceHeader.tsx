
import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InvoiceHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold">All Invoices</h2>
      <Button 
        className="bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
        asChild
      >
        <Link to="/invoices/create">
          <Plus size={16} className="mr-1" />
          Create Invoice
        </Link>
      </Button>
    </div>
  );
};
