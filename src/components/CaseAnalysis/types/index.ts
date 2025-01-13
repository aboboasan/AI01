// 基础类型定义
export type PartyType = "原告" | "被告" | "第三人";
export type IdentityType = "自然人" | "法人" | "其他组织";
export type RelevanceLevel = "高" | "中" | "低";
export type LawLevel = "法律" | "行政法规" | "司法解释" | "地方性法规";

// 案件基本信息
export interface CaseBasicInfo {
  title: string;          // 案件标题
  caseNumber: string;     // 案号
  court: string;          // 法院
  caseType: string;       // 案件类型
  filingDate: string;     // 立案日期
  jurisdiction: {         // 管辖权信息
    basis: string;        // 管辖权依据
    analysis: string;     // 管辖权分析
  };
}

// 当事人信息
export interface PartyInfo {
  type: string;           // 当事人类型
  name: string;           // 姓名
  info: {
    type: string;         // 身份类型
    identity: string;     // 身份信息
    address: string;      // 地址
    contact: string;      // 联系方式
  };
  representation: {
    type: string;         // 代表人类型
    name: string;         // 代表人姓名
  };
}

// 法律条文引用
export interface LawReference {
  name: string;           // 法律名称
  article: string;        // 条文编号
  content: string;        // 条文内容
  relevance: string;      // 相关性分析
}

// 诉讼请求
export interface Claim {
  party: string;          // 主张方
  content: string;        // 请求内容
  basis: {
    facts: string;        // 事实依据
    laws: LawReference[]; // 法律依据
  };
}

// 证据信息
export interface Evidence {
  type: string;           // 证据类型
  content: string;        // 证据内容
  submitter: string;      // 提交方
  validity: {
    authenticity: string; // 真实性分析
    legality: string;     // 合法性分析
    relevance: string;    // 关联性分析
  };
  probativeForce: string; // 证明力分析
}

// 争议焦点
export interface Dispute {
  point: string;          // 争议点
  positions: {
    plaintiff: string;    // 原告观点
    defendant: string;    // 被告观点
  };
  analysis: string;       // 法官分析
}

// 事实认定
export interface FactFinding {
  basicFacts: {
    timeline: string;     // 案件时间线
    mainEvents: string;   // 主要事件经过
  };
  evidence: {
    submitted: Evidence[];// 证据列表
    chain: string;        // 证据链分析
  };
  disputes: Dispute[];    // 争议焦点列表
}

// 法律分析
export interface LegalAnalysis {
  relationship: {
    type: string;         // 法律关系性质
    analysis: string;     // 法律关系分析
  };
  applicableLaws: {
    type: string;         // 法律类型
    name: string;         // 法律名称
    article: string;      // 条文编号
    content: string;      // 条文内容
    analysis: string;     // 适用分析
    hierarchy: string;    // 法律位阶
  }[];
  precedents: {
    caseRef: string;      // 案例编号
    relevance: string;    // 参考价值
    analysis: string;     // 指导意义
  }[];
}

// 判决信息
export interface Judgment {
  reasoning: {
    factual: string;      // 事实认定理由
    legal: string;        // 法律适用理由
    equity: string;       // 公平正义考量
  };
  result: {
    decisions: {
      content: string;    // 判决内容
      basis: string;      // 判决依据
      execution: string;  // 执行方式
    }[];
    costs: string;        // 诉讼费用承担
  };
}

// 执行信息
export interface Execution {
  feasibility: string;    // 执行可行性分析
  suggestions: {
    aspect: string;       // 执行建议
    details: string;      // 具体措施
    priority: string;     // 优先级
  }[];
}

// 案件总结
export interface CaseSummary {
  keyPoints: {
    point: string;        // 要点
    significance: string; // 重要性
  }[];
  significance: {
    legal: string;        // 法律意义
    social: string;       // 社会影响
  };
}

// 案件分析结果
export interface CaseAnalysis {
  basicInfo: CaseBasicInfo;       // 基本信息
  parties: PartyInfo[];           // 当事人信息
  claims: Claim[];                // 诉讼请求
  factFinding: FactFinding;       // 事实认定
  legalAnalysis: LegalAnalysis;   // 法律分析
  judgment: Judgment;             // 判决信息
  execution: Execution;           // 执行信息
  summary: CaseSummary;           // 案件总结
}

// 文件信息
export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  uploadTime: string;
  preview?: string;
}

// 分析选项
export interface AnalysisOptions {
  includeParties: boolean;
  includeEvidence: boolean;
  includeLawReferences: boolean;
  includeTimeline: boolean;
  includeRisks: boolean;
  customOptions?: string[];
} 