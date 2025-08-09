import { format } from "date-fns";
import { BasePdfService } from "./pdfBase";
import { pdfFormatUtils } from "./pdfFormatUtils";
import { Invoice, InvoiceItem } from "@/types/invoice";

/**
 * Service for generating invoice PDFs
 */
export class InvoicePdfService extends BasePdfService {
  /**
   * Generate an invoice PDF and trigger download
   */
  generateInvoicePDF(invoice: Invoice, items: InvoiceItem[], business: any): void {
    try {
      const doc = this.createDocument();
      const { width } = this.getPageDimensions(doc);

      // Header: Business Logo and Name
      let cursorY = 15;
      const logoUrl = business?.logo_url as string | undefined;
      if (logoUrl) {
        // Attempt to add logo (might fail if cross-origin); it's okay to continue without it
        const added = pdfFormatUtils.addLogo(doc, logoUrl, 15, cursorY - 5, 25, 25);
        if (added) {
          // Align title to the right of the logo
          doc.setFontSize(18);
          doc.text(business?.name || "Business", 45, cursorY + 5);
        } else {
          doc.setFontSize(18);
          doc.text(business?.name || "Business", 15, cursorY);
        }
      } else {
        doc.setFontSize(18);
        doc.text(business?.name || "Business", 15, cursorY);
      }
      cursorY += 20;

      // Invoice Title
      doc.setFontSize(22);
      doc.text(`Invoice #${invoice.invoice_number}`, 15, cursorY);
      cursorY += 8;

      // Dates and status
      doc.setFontSize(10);
      const issue = format(new Date(invoice.issue_date), "PP");
      const due = format(new Date(invoice.due_date), "PP");
      doc.text(`Issue Date: ${issue}`, 15, cursorY);
      doc.text(`Due Date: ${due}`, 70, cursorY);
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 130, cursorY);
      cursorY += 10;

      // Customer block
      if ((invoice as any).customer) {
        const customer = (invoice as any).customer as any;
        doc.setFontSize(12);
        doc.text("Bill To:", 15, cursorY);
        doc.setFontSize(10);
        cursorY += 6;
        doc.text(customer?.name || "Customer", 15, cursorY);
        if (customer?.email) {
          cursorY += 5;
          doc.text(customer.email, 15, cursorY);
        }
        if (customer?.phone) {
          cursorY += 5;
          doc.text(customer.phone, 15, cursorY);
        }
        if (customer?.address) {
          cursorY += 5;
          // Split long address into lines
          const split = doc.splitTextToSize(String(customer.address), width - 30);
          doc.text(split, 15, cursorY);
          cursorY += Array.isArray(split) ? split.length * 5 : 5;
        } else {
          cursorY += 5;
        }
      }

      // Items table
      const tableStartY = Math.max(cursorY, 60);
      const headers = ["Description", "Qty", "Price", "Amount"];
      const body = (items || []).map((it) => [
        it.description,
        String(it.quantity),
        this.formatCurrency(it.price),
        this.formatCurrency(it.amount),
      ]);

      pdfFormatUtils.createTable(doc, tableStartY, headers, body, {
        theme: "grid",
        styles: { cellPadding: 4, fontSize: 10 },
        headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { halign: "right", cellWidth: 20 },
          2: { halign: "right", cellWidth: 30 },
          3: { halign: "right", cellWidth: 30 },
        },
        // Ensure full width
        margin: { left: 15, right: 15 },
      });

      // Totals
      // @ts-ignore - lastAutoTable may not exist on types
      const lastY = (doc as any).lastAutoTable?.finalY || tableStartY + 10;
      const totalsY = lastY + 12;
      doc.setFontSize(12);
      doc.text("Total:", 135, totalsY);
      doc.setFontSize(12);
      doc.text(this.formatCurrency(invoice.total_amount), 175, totalsY, { align: "right" });

      // Notes
      if (invoice.notes) {
        const notesY = totalsY + 12;
        doc.setFontSize(11);
        doc.text("Notes:", 15, notesY);
        doc.setFontSize(10);
        const splitNotes = doc.splitTextToSize(String(invoice.notes), width - 30);
        doc.text(splitNotes, 15, notesY + 6);
      }

      // Save file
      const fileName = `invoice-${invoice.invoice_number}.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error("Error generating invoice PDF:", e);
      throw e;
    }
  }

  private formatCurrency(value: number): string {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value ?? 0);
    } catch {
      return `$${(value ?? 0).toFixed(2)}`;
    }
  }
}
