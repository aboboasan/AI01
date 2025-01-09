import axios from 'axios';

const API_BASE_URL = 'https://api.deepseek.com/v1';
const API_KEY = 'sk-4c27205edf134b53b269485c766f08d5';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
  timeout: 60000,
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 确保每个请求都带有最新的 token
    config.headers.Authorization = `Bearer ${API_KEY}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('API密钥无效或已过期');
    } else if (error.response?.status === 429) {
      console.error('API调用次数已达到限制');
    } else if (error.response?.status === 500) {
      console.error('服务器内部错误');
    }
    return Promise.reject(error);
  }
);

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LegalCase {
  id: string;
  title: string;
  court: string;
  date: string;
  location: string;
  summary: string;
  caseType: string;
  url: string;
  reference: string;
}

export const legalExamples: LegalCase[] = [
  {
    id: '1',
    title: '张某与李某房屋买卖合同纠纷案',
    court: '北京市第三中级人民法院',
    date: '2023-12-15',
    location: '北京市',
    summary: '根据《中华人民共和国民法典》第五百零九条，本案中买卖双方签订的房屋买卖合同虽未办理过户登记手续，但合同内容完整、意思表示真实，且不违反法律强制性规定，应认定合同有效。',
    caseType: '民事案件',
    url: 'https://wenshu.court.gov.cn/case/1',
    reference: '（2023）京03民终1234号'
  },
  {
    id: '2',
    title: '王某与某科技公司劳动合同纠纷案',
    court: '上海市浦东新区人民法院',
    date: '2023-11-20',
    location: '上海市',
    summary: '根据《劳动合同法》第八十二条，用人单位未依法支付加班工资的，应当依法向劳动者加付赔偿金。本案中公司未支付员工加班工资，应当支付双倍工资差额。',
    caseType: '劳动争议',
    url: 'https://wenshu.court.gov.cn/case/2',
    reference: '（2023）沪0115民初5678号'
  },
  {
    id: '3',
    title: '某软件公司与某网络公司著作权侵权案',
    court: '广州知识产权法院',
    date: '2023-10-25',
    location: '广东省',
    summary: '根据《著作权法》第四十八条，未经许可复制发行他人软件构成侵权。本案中被告未经授权使用原告软件源代码，应当承担停止侵权、赔偿损失的法律责任。',
    caseType: '知识产权',
    url: 'https://wenshu.court.gov.cn/case/3',
    reference: '（2023）粤73知民初9012号'
  },
  {
    id: '4',
    title: '消费者与某电商平台消费维权案',
    court: '深圳市南山区人民法院',
    date: '2023-09-30',
    location: '广东省',
    summary: '根据《消费者权益保护法》第五十五条，平台未尽到审查义务导致消费者购买到假冒商品，应当与销售者承担连带责任。',
    caseType: '消费维权',
    url: 'https://wenshu.court.gov.cn/case/4',
    reference: '（2023）粤0305民初3456号'
  },
  {
    id: '5',
    title: '某建筑公司与业主装修合同纠纷案',
    court: '成都市锦江区人民法院',
    date: '2023-09-15',
    location: '四川省',
    summary: '根据《民法典》第七百九十三条，装修合同中约定的工期延误违约金过高，可以适当调减。本案中双方约定每日千分之五的违约金明显过高，应予调整。',
    caseType: '合同纠纷',
    url: 'https://wenshu.court.gov.cn/case/5',
    reference: '（2023）川0104民初7890号'
  }
];

export const chatCompletion = async (messages: ChatMessage[]) => {
  try {
    if (!messages || messages.length === 0) {
      throw new Error('消息内容不能为空');
    }

    const response = await api.post('/chat/completions', {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message;
    } else {
      throw new Error('无效的API响应格式');
    }
  } catch (error: any) {
    console.error('API调用错误:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || '调用API时出错，请稍后重试');
  }
};

export const analyzeContract = async (content: string) => {
  try {
    if (!content) {
      throw new Error('合同内容不能为空');
    }

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一位专业的法律顾问，请对提供的合同内容进行分析。请注意以下几点：1. 合同的主要条款和核心内容 2. 双方的权利和义务 3. 可能存在的法律风险 4. 具体的改进建议'
      },
      {
        role: 'user',
        content
      }
    ];

    const response = await chatCompletion(messages);
    return response.content;
  } catch (error: any) {
    console.error('合同分析错误:', error);
    throw new Error(error.message || '合同分析失败，请稍后重试');
  }
};

export const searchLegalCases = async (query: string) => {
  try {
    if (!query) {
      throw new Error('搜索内容不能为空');
    }

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `你是一位专业的法律检索助手。请根据用户的查询提供相关的法律案例分析，包含以下要素：
1. 案件标题
2. 审理法院
3. 判决日期
4. 案件地点
5. 案件类型
6. 案号
7. 判决要点
8. 法律依据
请确保分析准确、全面且实用。`
      },
      {
        role: 'user',
        content: `请帮我查找与以下问题相关的法律案例和法规依据：${query}`
      }
    ];

    const response = await chatCompletion(messages);
    return response.content;
  } catch (error: any) {
    console.error('法律检索错误:', error);
    throw new Error(error.message || '法律检索失败，请稍后重试');
  }
};

export const getRandomLegalInfo = (count: number = 3): LegalCase[] => {
  const shuffled = [...legalExamples].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default api; 