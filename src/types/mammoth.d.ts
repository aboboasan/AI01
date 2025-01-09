declare module 'mammoth' {
  interface ExtractResult {
    value: string;
    messages: any[];
  }

  interface Options {
    arrayBuffer: ArrayBuffer;
  }

  export function extractRawText(options: Options): Promise<ExtractResult>;
  export function convertToHtml(options: Options): Promise<ExtractResult>;
} 