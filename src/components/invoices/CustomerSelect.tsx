
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/invoice";
import CustomerForm from "@/pages/invoices/CustomerForm";

interface CustomerSelectProps {
  customers: Customer[];
  onCustomerAdded: (customer: Customer) => void;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({ 
  customers, 
  onCustomerAdded 
}) => {
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const handleCustomerAdded = (customer: Customer) => {
    onCustomerAdded(customer);
    setIsAddCustomerOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddCustomerOpen(true)}
          className="gap-1 ml-auto"
        >
          <Plus size={14} />
          Add Customer
        </Button>
      </div>

      <CustomerForm
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        onSuccess={handleCustomerAdded}
      />
    </div>
  );
};
