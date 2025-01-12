import axios from 'axios';
import type { ChatMessage } from './types';

const API_BASE_URL = 'https://api.deepseek.com/v1';  // 替换为实际的API地址
const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export interface LegalCase {
  id: string;
  title: string;
  content: string;
  date: string;
  court: string;
  type: string;
  result: string;
  reference: string;
  location: string;
  caseType: string;
  summary: string;
  url: string;
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

export const searchLegalCases = async (searchTerm: string): Promise<LegalCase[]> => {
  try {
    // 模拟API调用
    const mockCases: LegalCase[] = [
      {
        id: '1',
        title: '张三与李四房屋买卖合同纠纷案',
        content: '案件详细内容...',
        date: '2023-12-01',
        court: '北京市第一中级人民法院',
        type: '民事案件',
        result: '调解结案',
        reference: '(2023)京01民终1234号',
        location: '北京市',
        caseType: '房屋买卖纠纷',
        summary: '本案为房屋买卖合同纠纷，经法院调解双方达成协议...',
        url: 'https://example.com/case/1'
      },
      // 可以添加更多模拟数据...
    ];

    return mockCases.filter(c => 
      c.title.includes(searchTerm) || 
      c.content.includes(searchTerm) ||
      c.summary.includes(searchTerm)
    );
  } catch (error) {
    console.error('搜索案例失败:', error);
    return [];
  }
};

export const getRandomLegalInfo = async (): Promise<LegalCase[]> => {
  try {
    // 返回模拟数据
    return [
      {
        id: '1',
        title: '张三与李四房屋买卖合同纠纷案',
        content: '案件详细内容...',
        date: '2023-12-01',
        court: '北京市第一中级人民法院',
        type: '民事案件',
        result: '调解结案',
        reference: '(2023)京01民终1234号',
        location: '北京市',
        caseType: '房屋买卖纠纷',
        summary: '本案为房屋买卖合同纠纷，经法院调解双方达成协议...',
        url: 'https://example.com/case/1'
      },
      // 可以添加更多模拟数据...
    ];
  } catch (error) {
    console.error('获取随机案例失败:', error);
    return [];
  }
};

export type { ChatMessage } from './types';

export default api; 