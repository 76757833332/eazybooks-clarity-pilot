import { format } from "date-fns";
import { BasePdfService } from "./pdfBase";
import { pdfFormatUtils } from "./pdfFormatUtils";
import { Quotation, QuotationItem } from "@/types/quotation";

/**
 * Service for generating quotation PDFs
 */
export class QuotationPdfService extends BasePdfService {
  /**
   * Generate a quotation PDF and trigger download
   */
  generateQuotationPDF(quotation: Quotation, items: QuotationItem[], business: any): void {
    try {
      const doc = this.createDocument();
      const { width } = this.getPageDimensions(doc);

      // Header: Business Logo and Name
      let cursorY = 15;
      const logoUrl = business?.logo_url as string | undefined;
      if (logoUrl) {
        const added = pdfFormatUtils.addLogo(doc, logoUrl, 15, cursorY - 5, 25, 25);
        if (added) {
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

      // Quotation Title
      doc.setFontSize(22);
      doc.text(`Quotation #${quotation.quotation_number}`, 15, cursorY);
      cursorY += 8;

      // Dates and status
      doc.setFontSize(10);
      const issue = format(new Date(quotation.issue_date), "PP");
      const valid = format(new Date(quotation.valid_until), "PP");
      doc.text(`Issue Date: ${issue}`, 15, cursorY);
      doc.text(`Valid Until: ${valid}`, 70, cursorY);
      doc.text(`Status: ${quotation.status.toUpperCase()}`, 130, cursorY);
      cursorY += 10;

      // Business block (From)
      doc.setFontSize(12);
      doc.text("From:", 15, cursorY);
      doc.setFontSize(10);
      cursorY += 6;
      const businessName = (business?.legal_name || business?.name || "Business") as string;
      doc.text(businessName, 15, cursorY);
      if (business?.email) {
        cursorY += 5;
        doc.text(String(business.email), 15, cursorY);
      }
      if (business?.phone) {
        cursorY += 5;
        doc.text(String(business.phone), 15, cursorY);
      }
      if (business?.website) {
        cursorY += 5;
        doc.text(String(business.website), 15, cursorY);
      }
      if (business?.tax_id) {
        cursorY += 5;
        doc.text(`Tax ID: ${String(business.tax_id)}`, 15, cursorY);
      }
      if (
        business?.address ||
        business?.city ||
        business?.state ||
        business?.postal_code ||
        business?.country
      ) {
        cursorY += 5;
        const cityState = [business?.city, business?.state].filter(Boolean).join(", ");
        const addressCombined = [
          business?.address,
          cityState,
          business?.postal_code,
          business?.country,
        ]
          .filter(Boolean)
          .join(" ");
        if (addressCombined) {
          const splitBizAddr = doc.splitTextToSize(String(addressCombined), width - 30);
          doc.text(splitBizAddr, 15, cursorY);
          cursorY += Array.isArray(splitBizAddr) ? splitBizAddr.length * 5 : 5;
        }
      } else {
        cursorY += 5;
      }

      cursorY += 4;

      // Customer block
      if ((quotation as any).customer) {
        const customer = (quotation as any).customer as any;
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
        margin: { left: 15, right: 15 },
      });

      // Totals
      // @ts-ignore - lastAutoTable may not exist on types
      const lastY = (doc as any).lastAutoTable?.finalY || tableStartY + 10;
      const totalsY = lastY + 12;
      doc.setFontSize(12);
      doc.text("Total:", 135, totalsY);
      doc.setFontSize(12);
      doc.text(this.formatCurrency(quotation.total_amount as unknown as number), 175, totalsY, { align: "right" });

      // Notes
      if (quotation.notes) {
        const notesY = totalsY + 12;
        doc.setFontSize(11);
        doc.text("Notes:", 15, notesY);
        doc.setFontSize(10);
        const splitNotes = doc.splitTextToSize(String(quotation.notes), width - 30);
        doc.text(splitNotes, 15, notesY + 6);
      }

      // Save file
      const fileName = `quotation-${quotation.quotation_number}.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error("Error generating quotation PDF:", e);
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
