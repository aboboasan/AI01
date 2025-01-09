import axios from 'axios';

const API_BASE_URL = 'https://api.deepseek.com/v1';  // 替换为实际的API地址
const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const chatCompletion = async (messages: ChatMessage[]) => {
  try {
    const response = await api.post('/chat/completions', {
      model: 'deepseek-chat',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.data.choices[0].message;
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
};

export default api; 