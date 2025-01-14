interface PDFPageProxy {
  getTextContent(): Promise<{ items: Array<{ str: string }> }>;
}

interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFJSLib {
  getDocument(data: { data: ArrayBuffer }): { promise: Promise<PDFDocumentProxy> };
}

declare global {
  interface Window {
    pdfjsLib: PDFJSLib;
  }
} 