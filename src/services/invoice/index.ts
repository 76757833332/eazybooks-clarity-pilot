
import { invoiceQueryService } from "./invoiceQueryService";
import { invoiceCreateService } from "./invoiceCreateService";
import { invoiceUpdateService } from "./invoiceUpdateService";
import { invoiceDeleteService } from "./invoiceDeleteService";
import { invoiceCalculationService } from "./invoiceCalculationService";

/**
 * Main invoice service that combines all invoice-related functionality
 */
export const invoiceService = {
  // Query methods
  getInvoices: invoiceQueryService.getInvoices,
  getInvoiceById: invoiceQueryService.getInvoiceById,
  getInvoiceItems: invoiceQueryService.getInvoiceItems,
  
  // Create methods
  createInvoice: invoiceCreateService.createInvoice,
  generateInvoiceNumber: invoiceCreateService.generateInvoiceNumber,
  
  // Update methods
  updateInvoice: invoiceUpdateService.updateInvoice,
  
  // Delete methods
  deleteInvoice: invoiceDeleteService.deleteInvoice,
  deleteInvoiceItem: invoiceDeleteService.deleteInvoiceItem,
  
  // Calculation methods for direct access
  calculateItemsTotal: invoiceCalculationService.calculateItemsTotal,
  prepareInvoiceItems: invoiceCalculationService.prepareInvoiceItems
};
