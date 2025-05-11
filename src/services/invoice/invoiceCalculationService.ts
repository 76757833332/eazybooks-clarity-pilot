
import { InvoiceItem } from "@/types/invoice";

/**
 * Service for invoice calculations
 */
export const invoiceCalculationService = {
  /**
   * Calculate the total amount for an array of invoice items
   */
  calculateItemsTotal: (items: Array<{price?: number | string, quantity?: number | string}>) => {
    return items.reduce((sum, item) => {
      // Ensure price and quantity are numbers
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const itemAmount = price * quantity;
      return sum + itemAmount;
    }, 0);
  },
  
  /**
   * Prepare invoice items by calculating amounts and adding invoice ID
   */
  prepareInvoiceItems: (items: Array<{description?: string, price?: number | string, quantity?: number | string}>, invoiceId: string) => {
    return items.map(item => {
      // Calculate amount based on price and quantity
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const amount = price * quantity;
      
      return {
        invoice_id: invoiceId,
        description: item.description || '', // Ensure description is always provided
        price: price,
        quantity: quantity,
        amount: amount
      };
    });
  }
};
