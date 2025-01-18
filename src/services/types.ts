export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  choices: Array<{
    message: ChatMessage;
  }>;
}

export interface LegalCase {
  id: string;
  title: string;
  content: string;
  date: string;
  court: string;
  type: string;
  result: string;
  reference: string;
  location?: string;
  caseType?: string;
  summary: string;
  url: string;
} 