import axios from 'axios';
import type { ChatMessage, ChatResponse, LegalCase } from './types';
import { lawyerMessage } from './prompts';
import mammoth from 'mammoth';

// API 配置
const API_BASE_URL = process.env.REACT_APP_DEEPSEEK_API_URL;
const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.error('API密钥未配置，请在环境变量中设置 REACT_APP_DEEPSEEK_API_KEY');
}

if (!API_BASE_URL) {
  console.error('API地址未配置，请在环境变量中设置 REACT_APP_DEEPSEEK_API_URL');
}

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 增加超时时间到2分钟
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json'
  }
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 确保每个请求都带有最新的 API Key
    config.headers['Authorization'] = `Bearer ${API_KEY}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('网络连接失败，请检查网络设置或API服务是否可用');
      throw new Error('网络连接失败，请检查网络设置或API服务是否可用');
    }
    if (error.response) {
      console.error('API响应错误:', error.response.status, error.response.data);
      throw new Error(error.response.data?.error?.message || '服务器响应错误');
    }
    return Promise.reject(error);
  }
);

// 添加重试机制
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

// API functions
export const chatCompletion = async (messages: ChatMessage[]): Promise<{ content: string }> => {
  try {
    console.log('开始API调用，发送消息:', JSON.stringify(messages, null, 2));
    
    const response = await withRetry(() => 
      api.post<ChatResponse>('/chat/completions', {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 4000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      })
    );
    
    if (!response.data || !response.data.choices || !response.data.choices[0]?.message) {
      console.error('API响应格式错误:', response.data);
      throw new Error('API响应格式错误');
    }
    
    const content = response.data.choices[0]?.message?.content || '';
    if (!content) {
      throw new Error('API返回内容为空');
    }
    
    console.log('API返回内容:', content);
    return { content };
  } catch (error) {
    console.error('chatCompletion错误:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      throw new Error(`API调用失败: ${errorMessage}`);
    }
    throw error;
  }
};

export const analyzeContent = async (content: string): Promise<string> => {
  const userMessage: ChatMessage = {
    role: "user",
    content: `请严格按照8个维度标记对以下案件进行全面分析，确保输出结果包含所有必需的维度标记和详细分析内容：\n\n${content}\n\n请注意：分析结果必须包含所有8个维度标记，每个维度至少500字详细分析。`
  };

  try {
    const response = await chatCompletion([lawyerMessage, userMessage]);
    
    // 验证返回的内容是否包含所有必需的维度标记
    const requiredSections = [
      '【案件基础信息】',
      '【事实认定分析】',
      '【法律适用分析】',
      '【有利因素分析】',
      '【抗辩策略设计】',
      '【风险评估】',
      '【辩护建议】',
      '【案件前景预判】'
    ];
    
    const missingSections = requiredSections.filter(section => !response.content.includes(section));
    
    if (missingSections.length > 0) {
      console.error('分析结果缺少以下维度:', missingSections);
      throw new Error(`分析结果不完整，缺少以下维度: ${missingSections.join(', ')}`);
    }
    
    return response.content;
  } catch (error) {
    console.error('内容分析失败:', error);
    throw error;
  }
};

export const analyzeLawyerCase = async (content: string): Promise<string> => {
  return await analyzeContent(content);
};

export const searchLegalCases = async (searchTerm: string): Promise<LegalCase[]> => {
  try {
    const systemMessage: ChatMessage = {
      role: "system",
      content: `你是一个专业的法律搜索助手。请根据用户的搜索词返回最相关的案例。请注意：
      1. 每个案例必须包含完整的标题、案号、法院名称、判决结果等基本信息
      2. 案件摘要必须详细说明案件起因、争议焦点、证据和判决理由
      3. 所有案例必须是真实存在的，并提供准确的中国裁判文书网链接
      4. 如果找不到完全匹配的案例，返回最相关的类似案例
      5. 确保返回的案例信息结构完整，格式统一`
    };

    const userMessage: ChatMessage = {
      role: "user",
      content: `请搜索与"${searchTerm}"相关的案例（至少3个最相关的案例），并按照以下格式返回：\n\n案例1：\n标题：（案件完整标题）\n案号：（标准案号格式）\n法院：（完整法院名称）\n案件类型：（案件大类）\n子类型：（具体案件类型）\n审理程序：（一审/二审/再审等）\n审理时间：（具体日期）\n判决结果：（详细判决内容）\n\n案件摘要：\n1. 案件起因：（详细说明）\n2. 争议焦点：（具体列举）\n3. 主要证据：（分条列举）\n4. 法院认定：（详细说明）\n5. 判决理由：（法律依据）\n\n相关法条：（引用的法律条文）\n\n文书链接：（中国裁判文书网链接）\n\n案例2：\n...`
    };

    const response = await chatCompletion([systemMessage, userMessage]);
    
    if (!response.content) {
      throw new Error('未获取到案例数据');
    }
    
    // 解析返回的文本内容
    const cases: LegalCase[] = [];
    const caseTexts = response.content.split(/案例\d+[：:]/g).filter(text => text.trim());
    
    for (const caseText of caseTexts) {
      try {
        const lines = caseText.split('\n').filter(line => line.trim());
        const caseData: Partial<LegalCase> = {
          id: String(cases.length + 1),
          content: caseText.trim(),
          summary: '',
        };
        
        let currentSection = '';
        let summaryContent = '';
        
        for (const line of lines) {
          const colonIndex = Math.max(line.indexOf('：'), line.indexOf(':'));
          if (colonIndex === -1) continue;
          
          const key = line.substring(0, colonIndex).trim();
          const value = line.substring(colonIndex + 1).trim();
          
          if (!value) continue;
          
          switch (key) {
            case '标题':
              caseData.title = value;
              break;
            case '案号':
              caseData.reference = value;
              break;
            case '法院':
              caseData.court = value;
              break;
            case '案件类型':
              caseData.type = value;
              break;
            case '子类型':
              caseData.caseType = value;
              break;
            case '审理时间':
              caseData.date = value;
              break;
            case '判决结果':
              caseData.result = value;
              break;
            case '文书链接':
              caseData.url = value;
              break;
            case '案件摘要':
              currentSection = 'summary';
              summaryContent = value + '\n';
              break;
          }
        }
        
        if (summaryContent) {
          caseData.summary = summaryContent.trim();
        }
        
        if (caseData.title && caseData.reference && caseData.court) {
          cases.push(caseData as LegalCase);
        }
      } catch (error) {
        console.error('解析单个案例时出错:', error);
      }
    }
    
    if (cases.length === 0) {
      throw new Error(`未找到与"${searchTerm}"相关的案例，请尝试其他关键词`);
    }
    
    return cases;
  } catch (error) {
    console.error('搜索案例失败:', error);
    throw error;
  }
};

export const exportToWord = async (content: string): Promise<Blob> => {
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>导出文档</title>
        <style>
          @page {
            size: A4;
            margin: 2.54cm 3.17cm;
          }
          @font-face {
            font-family: SimSun;
            panose-1:2 1 6 0 3 1 1 1 1 1;
          }
          body {
            font-family: SimSun;
            font-size: 12pt;
            line-height: 1.5;
          }
          .title {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            margin: 24pt 0;
          }
          .paragraph {
            text-indent: 2em;
            margin: 12pt 0;
            text-align: justify;
          }
          .date, .signature {
            text-align: right;
            margin: 24pt 0;
          }
        </style>
      </head>
      <body>
        ${content.split('\n').map(line => {
          if (line.trim().startsWith('标题：')) {
            return `<div class="title">${line.replace('标题：', '')}</div>`;
          } else if (line.trim().startsWith('日期：')) {
            return `<div class="date">${line.replace('日期：', '')}</div>`;
          } else if (line.trim().startsWith('签名：')) {
            return `<div class="signature">${line.replace('签名：', '')}</div>`;
          } else {
            return line.trim() ? `<div class="paragraph">${line}</div>` : '<br/>';
          }
        }).join('\n')}
      </body>
    </html>
  `;

  return new Blob(['\ufeff', htmlContent], {
    type: 'application/vnd.ms-word;charset=utf-8'
  });
};

export { api }; 