import axios from 'axios';
import type { ChatMessage } from './types';
import type { CaseAnalysis } from '../components/CaseAnalysis/types/index';
import mammoth from 'mammoth';

// 添加ChatResponse接口定义
export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const API_BASE_URL = 'https://api.deepseek.com/v1';
const API_KEY = 'sk-4c27205edf134b53b269485c766f08d5';

// 创建axios实例时添加重试配置
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 120000, // 增加默认超时时间到120秒
  withCredentials: false
});

// 添加请求重试拦截器
api.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  
  // 如果没有设置重试配置，就设置重试次数为3
  if (!config || !config.retry) {
    config.retry = 3;
  }
  
  config.retryCount = config.retryCount || 0;
  
  // 检查是否还可以重试
  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }
  
  // 重试计数加1
  config.retryCount += 1;
  
  // 创建新的Promise来处理重试
  const backoff = new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 1000);
  });
  
  // 等待后重试
  await backoff;
  return api(config);
});

api.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${API_KEY}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export const chatCompletion = async (messages: ChatMessage[]): Promise<{ content: string }> => {
  try {
    console.log('开始API调用，发送消息:', messages);
    const response = await api.post<ChatResponse>('/chat/completions', {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 4000, // 增加token限制
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });
    
    console.log('API响应状态:', response.status);
    console.log('API响应头:', response.headers);
    
    if (!response.data || !response.data.choices || !response.data.choices[0]?.message) {
      console.error('API响应格式错误:', response.data);
      throw new Error('API响应格式错误');
    }
    
    const content = response.data.choices[0]?.message?.content || '';
    if (!content) {
      throw new Error('API返回内容为空');
    }
    
    console.log('API返回内容长度:', content.length);
    console.log('API返回内容预览:', content.substring(0, 200));
    
    return { content };
  } catch (error) {
    console.error('chatCompletion错误详情:', error);
    if (axios.isAxiosError(error)) {
      console.error('API错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('分析请求超时，请稍后重试');
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('网络连接失败，请检查网络设置或API服务是否可用');
      }
      
      const message = error.response?.data?.error?.message || error.message;
      throw new Error(`API调用失败: ${message}`);
    }
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

// 添加文件读取函数
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (file.type === 'text/plain') {
          // 文本文件直接读取
          resolve(e.target?.result as string);
        } else if (
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'application/msword'
        ) {
          // Word 文档需要使用 mammoth 处理
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } else {
          reject(new Error('不支持的文件格式'));
        }
      } catch (error) {
        reject(new Error('读取文件失败'));
      }
    };

    reader.onerror = () => reject(new Error('读取文件失败'));

    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

// 分析案件文件
export async function analyzeCaseFile(file: File): Promise<string> {
  try {
    // 读取文件内容
    const fileContent = await readFileContent(file);
    console.log('文件内容长度:', fileContent.length);

    // 直接处理完整内容，不再分段
    const result = await analyzeContent(fileContent);
    
    // 检查结果格式
    if (!result.includes('【案件事实的全面性与准确性】')) {
      throw new Error('分析结果格式不正确');
    }
    
    return result;
  } catch (error) {
    console.error('案件分析失败:', error);
    throw new Error(`案件分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 处理内容的辅助函数
async function analyzeContent(content: string): Promise<string> {
  const systemMessage: ChatMessage = {
    role: "system" as const,
    content: `作为一名具有20年丰富经验的资深检测官，我将基于事实依据、法律准绳和公平正义原则，对案件进行全面、客观、专业的分析。请按照以下要求进行分析：

1. 分析结果必须包含以下九个维度，每个维度都要给出详细、专业的定性分析：

【案件事实的全面性与准确性】
请对案件基本事实进行全面梳理和定性。包括：案件性质认定、当事人关系界定、案件发生的完整过程、事实之间的因果关系、争议焦点等。必须明确指出案件性质的法律定性，并说明定性理由。如果事实存在争议或者信息不足，必须明确指出。

【证据的合法性、真实性与充分性】
详细分析全部证据材料，包括：证据的种类和形式、证据的合法性、真实性、关联性、证明力等。评估证据链的完整性，说明证据之间的印证关系。如果证据存在瑕疵或者遗漏，必须指出。

【法律适用的准确性与合理性】
必须明确列举适用的法律条文，包括具体的法律名称和条款号。例如：《中华人民共和国民法典》第X条规定："具体条文内容"。分析法律适用的准确性和合理性，说明是否符合立法本意。

【程序的合法性与正当性】
全面评估诉讼程序的合法性，包括：立案、管辖、送达、举证质证、审理期限等各个环节。分析是否存在程序瑕疵，当事人的程序性权利是否得到保障。

【当事人的主观状态与责任认定】
深入分析当事人的主观过错程度、行为动机、责任能力等。根据过错责任原则，明确责任承担方式和免责事由。必须给出明确的责任认定结论。

【公平与正义的实现】
评估案件处理在实体和程序方面是否实现公平正义。分析利益平衡情况、权利义务对等性、救济途径的保障等。必须说明判决结果的公平性和可接受性。

【社会效果与公共利益的考量】
分析案件处理的社会影响，包括：对类似案件的指导意义、对社会诚信的影响、对法治建设的促进作用等。评估是否实现了社会效果与法律效果的统一。

【法律监督职责的履行】
评估案件审理过程中的监督机制运行情况，包括：程序监督、实体监督、法律适用监督等。分析是否存在需要纠正的违法情形。

【司法廉洁与独立性】
评估审判人员的廉洁性和独立性，包括：回避制度执行、防止干预措施等。分析是否存在影响司法公正的因素。

2. 输出要求：
- 每个维度必须给出完整的分析段落，使用专业的法律术语
- 分析内容要具体详实，避免空泛表述
- 如果某些方面存在信息不足，必须明确指出："因卷宗材料不完整，缺乏必要的证据支持，无法对xxx作出准确定性。需要补充xxx相关材料后再行评估。"
- 对于法律适用部分，必须引用具体的法律条文内容
- 所有分析结论必须有事实依据和法律依据支持

请严格按照上述要求，对提供的案件材料进行专业、全面的分析。`
  };

  const userMessage: ChatMessage = {
    role: "user" as const,
    content: `请按照要求对以下案件进行全面分析，务必确保分析内容专业、具体、详实：\n\n${content}`
  };

  try {
    const response = await chatCompletion([systemMessage, userMessage]);
    return response.content;
  } catch (error) {
    console.error('内容分析失败:', error);
    throw error;
  }
}

export type { ChatMessage } from './types';

export default api; 