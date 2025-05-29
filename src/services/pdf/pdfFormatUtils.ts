
import { jsPDF } from "jspdf";
import autoTable, { CellDef, Styles, UserOptions } from "jspdf-autotable";

/**
 * Utility functions for formatting PDF documents
 */
export const pdfFormatUtils = {
  /**
   * Add company logo to the PDF
   */
  addLogo(doc: jsPDF, logoUrl: string, x: number, y: number, width: number, height: number): boolean {
    try {
      doc.addImage(logoUrl, 'JPEG', x, y, width, height);
      return true;
    } catch (logoError) {
      console.error("Error adding logo to PDF:", logoError);
      return false;
    }
  },
  
  /**
   * Create a data table in the PDF
   */
  createTable(
    doc: jsPDF,
    startY: number,
    headers: string[],
    data: (string | number)[][],
    options: UserOptions = {}
  ): any {
    return autoTable(doc, {
      startY,
      head: [headers],
      body: data,
      theme: options.theme || "plain",
      styles: options.styles || {
        cellPadding: 5,
        fontSize: 10,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: options.headStyles || {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: options.columnStyles,
      ...options // Spread all other options to support startX and other properties
    });
  },
};
