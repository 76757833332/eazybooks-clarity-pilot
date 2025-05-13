
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

/**
 * Base PDF service with common functionality
 */
export class BasePdfService {
  /**
   * Create a new PDF document
   */
  protected createDocument(): jsPDF {
    return new jsPDF();
  }
  
  /**
   * Get page dimensions
   */
  protected getPageDimensions(doc: jsPDF): { width: number; height: number } {
    return {
      width: doc.internal.pageSize.getWidth(),
      height: doc.internal.pageSize.getHeight(),
    };
  }
  
  /**
   * Add a footer to the PDF
   */
  protected addFooter(doc: jsPDF): void {
    const { width, height } = this.getPageDimensions(doc);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated on ${format(new Date(), "MMMM d, yyyy")}`,
      width / 2,
      height - 10,
      { align: "center" }
    );
  }
  
  /**
   * Add a horizontal line to the PDF
   */
  protected addHorizontalLine(doc: jsPDF, y: number, margin: number = 20): void {
    const { width } = this.getPageDimensions(doc);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, width - margin, y);
  }
}
