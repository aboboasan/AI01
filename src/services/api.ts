import axios from 'axios';
import mammoth from 'mammoth';
import type { Message, ChatMessage, ChatResponse, LegalCase } from './types';
export type { ChatMessage, ChatResponse, LegalCase };

const API_BASE_URL = 'https://api.deepseek.com/v1';
const API_KEY = 'sk-4c27205edf134b53b269485c766f08d5';

// Create axios instance with retry configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  timeout: 120000,
  withCredentials: false
});

// Add retry interceptor
api.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  
  if (!config || !config.retry) {
    config.retry = 3;
  }
  
  config.retryCount = config.retryCount || 0;
  
  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }
  
  config.retryCount += 1;
  
  const backoff = new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, config.retryDelay || 1000);
  });
  
  await backoff;
  return api(config);
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${API_KEY}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
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

// API functions
export const chatCompletion = async (messages: ChatMessage[]): Promise<{ content: string }> => {
  try {
    console.log('开始API调用，发送消息:', JSON.stringify(messages, null, 2));
    const response = await api.post<ChatResponse>('/chat/completions', {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
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
    console.log('API返回内容预览:', content.substring(0, 500));
    
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
      content: `请搜索与"${searchTerm}"相关的案例（至少3个最相关的案例），并按照以下格式返回：

      案例1：
      标题：（案件完整标题）
      案号：（标准案号格式）
      法院：（完整法院名称）
      案件类型：（案件大类）
      子类型：（具体案件类型）
      审理程序：（一审/二审/再审等）
      审理时间：（具体日期）
      判决结果：（详细判决内容）
      
      案件摘要：
      1. 案件起因：（详细说明）
      2. 争议焦点：（具体列举）
      3. 主要证据：（分条列举）
      4. 法院认定：（详细说明）
      5. 判决理由：（法律依据）
      
      相关法条：（引用的法律条文）
      
      文书链接：（中国裁判文书网链接）
      
      案例2：
      ...`
    };

    console.log('开始搜索案例，关键词:', searchTerm);
    const response = await chatCompletion([systemMessage, userMessage]);
    console.log('获取到API响应');
    
    if (!response.content) {
      console.error('API返回内容为空');
      throw new Error('未获取到案例数据');
    }
    
    // 解析返回的文本内容
    const cases: LegalCase[] = [];
    console.log('API返回的原始内容:', response.content);
    
    // 使用更灵活的分隔方式
    const caseTexts = response.content.split(/案例\d+[：:]/g).filter(text => text.trim());
    console.log('分割后的案例数量:', caseTexts.length);
    
    for (const caseText of caseTexts) {
      try {
        console.log('正在解析案例:', caseText.substring(0, 100) + '...');
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
          if (colonIndex === -1) {
            if (currentSection === 'summary') {
              summaryContent += line.trim() + '\n';
            }
            continue;
          }
          
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
            case '案件性质':
              caseData.type = value;
              break;
            case '子类型':
              caseData.caseType = value;
              break;
            case '审理时间':
            case '裁判日期':
              caseData.date = value;
              break;
            case '判决结果':
            case '裁判结果':
              caseData.result = value;
              break;
            case '文书链接':
            case '案例链接':
              caseData.url = value.replace(/[\[\]]/g, '');
              break;
          }
          
          if (key === '案件摘要' || key.includes('案件起因')) {
            currentSection = 'summary';
            summaryContent = value + '\n';
          }
        }
        
        if (summaryContent) {
          caseData.summary = summaryContent.trim();
        }
        
        // 验证必要字段
        if (caseData.title && caseData.reference && caseData.court) {
          // 如果没有URL，生成一个模拟的链接
          if (!caseData.url) {
            caseData.url = `https://wenshu.court.gov.cn/website/wenshu/181107ANFZ0BXSK4/index.html?docId=${caseData.reference}`;
          }
          
          cases.push(caseData as LegalCase);
          console.log('成功解析案例:', {
            title: caseData.title,
            reference: caseData.reference,
            court: caseData.court
          });
        } else {
          console.warn('案例数据不完整:', caseData);
        }
      } catch (error) {
        console.error('解析单个案例时出错:', error);
      }
    }

    if (cases.length === 0) {
      console.error('未能成功解析任何案例，API返回内容:', response.content);
      throw new Error(`未找到与"${searchTerm}"相关的案例，请尝试其他关键词`);
    }

    console.log('成功解析案例数量:', cases.length);
    return cases;
  } catch (error) {
    console.error('搜索案例失败:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('搜索案例失败，请稍后重试');
  }
};

export const getRandomLegalInfo = async (): Promise<LegalCase[]> => {
  try {
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
      }
    ];
  } catch (error) {
    console.error('获取随机案例失败:', error);
    return [];
  }
};

export const analyzeCaseFile = async (content: string): Promise<string> => {
  try {
    console.log('文件内容长度:', content.length);
    return await analyzeContent(content, 'prosecutor');
  } catch (error) {
    console.error('案件分析失败:', error);
    throw error;
  }
};

export const analyzeLawyerCase = async (content: string): Promise<string> => {
  try {
    console.log('文件内容长度:', content.length);
    return await analyzeContent(content, 'lawyer');
  } catch (error) {
    console.error('案件分析失败:', error);
    throw error;
  }
};

export const analyzeContent = async (content: string, type: 'prosecutor' | 'lawyer' = 'prosecutor'): Promise<string> => {
  const prosecutorMessage: ChatMessage = {
    role: "system",
    content: `作为一名经验丰富的检察官，我将以维护法律正义和社会公平为己任，主动从案件材料中发现违法犯罪事实，深入挖掘定罪量刑依据。我会重点关注社会危害性，积极发现执法瑕疵，确保案件办理质量。我将从以下8个维度进行深入分析：

请严格按照以下格式输出分析结果，确保包含所有维度标记：

【案件基础审查】
(主动发现案件受理、管辖权、当事人资格等方面的问题，深入分析程序启动的合法性，重点关注期限遵守情况，为后续处理打好基础)

【证据链完整性审查】
(积极排查证据的合法性、关联性、真实性问题，主动发现证据之间的矛盾点，深入分析证据链条的完整性和充分性，为定罪量刑提供有力支持)

【实体问题审查】
(深入分析犯罪构成要件，主动发现从重情节，重点关注社会危害性，积极寻找类案量刑标准，确保法律适用准确性)

【程序合法性审查】
(积极排查强制措施使用是否合法，主动发现侦查行为中的程序瑕疵，深入分析诉讼权利保障情况，确保程序正义)

【法律文书审查】
(主动发现法律文书中的形式和实质问题，深入分析文书逻辑性和规范性，积极纠正不当表述，确保文书质量)

【社会影响评估】
(深入分析案件的社会关注度，主动发掘案件的警示教育意义，积极评估舆论导向，重点关注类案的社会影响)

【执法办案质量评估】
(积极发现办案程序中的不规范之处，主动排查证据采信的合理性，深入分析法律适用的准确性，确保执法质量)

【综合建议】
(结合前述分析，主动提出案件定性的明确意见，积极建议处理方式，深入提出程序完善建议，确保案件办理质量)

注意事项：
1. 必须严格按照上述8个维度进行分析，每个维度的标题必须完全一致
2. 每个维度下必须包含实质性的分析内容
3. 每个维度的分析必须：
   - 引用具体的法律条文
   - 给出明确的主观判断
   - 提供具体的改进建议
   - 保持分析的可操作性
4. 分析结果中必须包含所有8个维度标记，缺一不可
5. 每个维度的分析至少包含300字以上的详细内容
6. 特别强调主动发现问题、积极提出建议`
  };

  const lawyerMessage: ChatMessage = {
    role: "system",
    content: `作为一名经验丰富的金牌辩护律师，我将以维护当事人合法权益为己任，主动从案件材料中发现对委托人有利的信息，深入挖掘无罪或罪轻的证据支持。我会积极寻找案件中的程序瑕疵和证据漏洞，为委托人争取最大利益。我将从以下8个维度进行深入分析：

请严格按照以下格式输出分析结果，确保包含所有维度标记：

【案件基础信息】
(主动发现对委托人有利的基本信息，深入分析管辖权异议可能，积极寻找程序启动瑕疵，重点关注有利于委托人的案件背景)

【事实认定分析】
(积极发现对方证据的矛盾之处，主动寻找有利于委托人的事实依据，深入分析时间线中的漏洞，重点挖掘对方认定事实的不足)

【法律适用分析】
(深入分析法律适用是否准确，主动寻找对委托人有利的法律解释，积极收集有利的判例支持，重点发现法律适用中的争议点)

【有利因素分析】
(积极发现可能减轻处罚的情节，主动寻找法定从轻情节，深入分析可能的免责事由，重点挖掘对委托人有利的主观因素)

【抗辩策略设计】
(根据前述分析，主动设计最有利的辩护思路，积极准备证据质证方案，深入制定程序性抗辩策略，重点突出对委托人有利的辩点)

【风险评估】
(深入分析案件的不利因素，主动预判对方可能的举证方向，积极设计风险应对预案，重点关注最坏情况的防范)

【辩护建议】
(结合案情分析，主动提出具体的辩护方案，积极建议证据补充方向，深入设计法庭质证策略，重点提出具体的和解方案)

【案件前景预判】
(深入分析胜诉可能性，主动评估最佳和最坏结果，积极预判法院可能的裁判倾向，重点提出应对预案)

注意事项：
1. 必须严格按照上述8个维度进行分析，每个维度的标题必须完全一致
2. 每个维度下必须包含实质性的分析内容
3. 每个维度的分析必须：
   - 引用具体的法律条文
   - 给出明确的专业判断
   - 提供具体的策略建议
   - 保持分析的可操作性
4. 分析结果中必须包含所有8个维度标记，缺一不可
5. 每个维度的分析至少包含300字以上的详细内容
6. 特别强调主动发现对委托人有利的信息，积极提出辩护策略`
  };

  const userMessage: ChatMessage = {
    role: "user",
    content: `请严格按照8个维度标记对以下案件进行全面分析，确保输出结果包含所有必需的维度标记和详细分析内容：\n\n${content}\n\n请注意：分析结果必须包含所有8个维度标记，每个维度至少300字详细分析。`
  };

  try {
    const systemMessage = type === 'prosecutor' ? prosecutorMessage : lawyerMessage;
    const response = await chatCompletion([systemMessage, userMessage]);
    
    // 验证返回的内容是否包含所有必需的维度标记
    const requiredSections = type === 'prosecutor' ? [
      '【案件基础审查】',
      '【证据链完整性审查】',
      '【实体问题审查】',
      '【程序合法性审查】',
      '【法律文书审查】',
      '【社会影响评估】',
      '【执法办案质量评估】',
      '【综合建议】'
    ] : [
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

export interface DocumentTemplate {
  id: string;
  title: string;
  content: string;
  fields: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'select';
    options?: string[];
    required?: boolean;
  }>;
}

export interface DocumentPreview {
  html: string;
  text: string;
}

export const generateDocumentPreview = async (
  template: DocumentTemplate,
  values: Record<string, string>
): Promise<DocumentPreview> => {
  const content = await generateDocument(template, values);
  
  // 创建预览用的HTML
  const previewHtml = `
    <div class="document-preview">
      <div class="title">${template.title}</div>
      ${content.split('\n').map(line => 
        line.trim() ? `<p class="paragraph">${line}</p>` : '<br/>'
      ).join('\n')}
    </div>
  `;
  
  return {
    html: previewHtml,
    text: content
  };
};

export const generateDocument = async (
  template: DocumentTemplate,
  values: Record<string, string>
): Promise<string> => {
  const systemMessage: ChatMessage = {
    role: "system",
    content: `你是一个专业的法律文书起草专家。请根据提供的模板和用户输入的信息，生成规范的法律文书。
    请确保：
    1. 格式规范，符合法律文书的标准格式要求
    2. 用语专业，符合法律文书的行文规范和用语习惯
    3. 内容完整，包含所有必要的法律要素和关键信息
    4. 逻辑严谨，论述清晰有力
    5. 分段合理，使用空行分隔不同部分
    6. 标题居中，正文两端对齐
    7. 日期、落款等格式规范`
  };

  const userMessage: ChatMessage = {
    role: "user",
    content: `请根据以下模板和信息生成规范的法律文书：
    
    模板标题：${template.title}
    模板内容：${template.content}
    
    填写信息：
    ${Object.entries(values)
      .map(([key, value]) => `${key}：${value}`)
      .join('\n')}
    
    请确保生成的文书格式规范，并使用换行符分隔不同段落。`
  };

  try {
    const response = await chatCompletion([systemMessage, userMessage]);
    return response.content;
  } catch (error) {
    console.error('文书生成失败:', error);
    throw new Error('文书生成失败，请稍后重试');
  }
};

export const exportToWord = async (content: string): Promise<Blob> => {
  // 创建一个完整的Word文档结构
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>导出文档</title>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
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
            margin: 0;
            padding: 0;
          }
          .title {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            margin: 24pt 0;
            line-height: 1.5;
          }
          .paragraph {
            text-indent: 2em;
            margin: 12pt 0;
            line-height: 1.5;
            text-align: justify;
          }
          .date {
            text-align: right;
            margin: 24pt 0;
          }
          .signature {
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

  // 使用正确的MIME类型
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/vnd.ms-word;charset=utf-8'
  });
  
  return blob;
};

export { api }; 