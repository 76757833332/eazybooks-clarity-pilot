
import { fetchInvoices, fetchInvoiceById, useInvoicesQuery, useInvoiceQuery } from "./invoiceQueryService";
import { invoiceCalculationService } from "./invoiceCalculationService";
import { invoiceCreateService } from "./invoiceCreateService";
import { invoiceUpdateService } from "./invoiceUpdateService";
import { invoiceDeleteService } from "./invoiceDeleteService";

// Create and export a unified invoiceService object that combines all the specialized services
export const invoiceService = {
  // Query operations
  getInvoices: fetchInvoices,
  getInvoiceById: fetchInvoiceById,
  getInvoiceItems: async (invoiceId: string) => {
    const invoice = await fetchInvoiceById(invoiceId);
    return invoice?.items || [];
  },
  
  // Create operations
  createInvoice: invoiceCreateService.createInvoice,
  generateInvoiceNumber: invoiceCreateService.generateInvoiceNumber,
  
  // Update operations
  updateInvoice: invoiceUpdateService.updateInvoice,
  updateInvoiceItems: invoiceUpdateService.updateInvoiceItems,
  
  // Delete operations
  deleteInvoice: invoiceDeleteService.deleteInvoice,
  deleteInvoiceItem: invoiceDeleteService.deleteInvoiceItem
};

// Re-export all the individual services for direct access if needed
export * from "./invoiceQueryService";
export * from "./invoiceCalculationService";
export * from "./invoiceCreateService";
export * from "./invoiceUpdateService";
export * from "./invoiceDeleteService";
