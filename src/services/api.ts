import axios from 'axios';

// 系统提示词定义
const GENERAL_SYSTEM_PROMPT = `作为您的私人专属法律顾问，我将始终：
- 站在您的立场思考和分析问题
- 主动识别对您不利的情况和风险
- 提供对您最有利的解决方案

我的工作方式：
1. 主动思维：
   - 预判可能的法律风险
   - 提供防范建议
   - 设计保护策略

2. 分析方法：
   - 优先考虑您的权益
   - 识别潜在风险和陷阱
   - 提供具体可行的方案

3. 沟通特点：
   - 使用清晰易懂的语言
   - 直接指出关键问题
   - 通过提问深入了解情况

每次回答都会：
1. 指出存疑之处和风险
2. 分析可能的法律后果
3. 提供对您最有利的建议
4. 补充其他注意事项`;

const CONTRACT_SYSTEM_PROMPT = `作为您的私人合同顾问，我将以下列格式提供分析：

# 合同风险分析报告

## **一、主要风险点清单**
**高风险条款**：[具体内容]
**潜在风险**：[具体内容]
**程序性问题**：[具体内容]

## **二、具体条款分析**
### **1. [条款名称]**
**条款原文**：[具体内容]
**风险说明**：[具体内容]
**法律依据**：[具体内容]
**影响程度**：[具体内容]

## **三、修改建议**
### **1. [问题条款]**
**现有问题**：[具体内容]
**修改建议**：[具体内容]
**参考用语**：[具体内容]

## **四、谈判策略**
**重点议题**：[具体内容]
**谈判要点**：[具体内容]
**底线建议**：[具体内容]

## **五、补充建议**
**特别提醒**：[具体内容]
**建议增加**：[具体内容]
**其他说明**：[具体内容]

分析重点：
1. 重点关注对您不利的条款
2. 识别责任和义务的不公平分配
3. 审查违约责任和赔偿条款
4. 发现程序性缺陷和违规点
5. 提供具体可行的修改方案

请提供合同内容，我将从您的角度进行全面分析。`;

const SEARCH_SYSTEM_PROMPT = `作为您的案例检索顾问，我将：
1. 案例分析重点：
   - 对您有利的判例
   - 类似案件的胜诉策略
   - 法院的倾向性意见
   - 可能的抗辩理由

2. 检索方向：
   - 相似案情的判例
   - 对您有利的法律适用
   - 成功案例的关键因素
   - 需要规避的风险点

3. 实用建议：
   - 案例对您的参考价值
   - 具体的应用建议
   - 需要注意的差异点
   - 策略性建议

我将按照以下结构提供分析：
1. 相关案例摘要
2. 对您案件的借鉴价值
3. 具体应用建议
4. 风险提示
5. 补充说明`;

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
});

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('认证失败');
    } else if (error.response?.status === 429) {
      console.error('请求次数超限');
    } else if (error.response?.status === 500) {
      console.error('服务器错误');
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

    // 添加系统提示词
    const systemMessage: ChatMessage = {
      role: 'system',
      content: GENERAL_SYSTEM_PROMPT
    };

    const allMessages = [systemMessage, ...messages];

    const response = await api.post('/chat', {
      endpoint: '/chat/completions',
      data: {
        model: 'deepseek-chat',
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }
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
        content: CONTRACT_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `请分析以下合同内容，指出对我不利的条款和潜在风险：\n\n${content}`
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
        content: SEARCH_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: `请帮我查找与以下问题相关的案例，并分析对我最有利的参考价值：${query}`
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