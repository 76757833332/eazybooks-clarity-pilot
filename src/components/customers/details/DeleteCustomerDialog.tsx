
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";

interface DeleteCustomerDialogProps {
  customerName: string;
  invoices: Invoice[];
  onDelete: () => void;
}

export const DeleteCustomerDialog = ({ 
  customerName, 
  invoices, 
  onDelete 
}: DeleteCustomerDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Customer</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {customerName}? This action cannot be undone.
            {invoices.length > 0 && (
              <p className="mt-2 font-semibold text-destructive">
                Warning: This customer has {invoices.length} invoices associated with them. 
                Deleting this customer may cause issues with those invoices.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
