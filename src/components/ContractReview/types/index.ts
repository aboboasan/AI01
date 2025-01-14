// 基础类型定义
export type RiskLevel = "高" | "中" | "低";
export type ContractType = "采购合同" | "销售合同" | "服务合同" | "劳动合同" | "租赁合同" | "其他";
export type ClauseType = "主要条款" | "一般条款" | "特殊条款";

// 合同基本信息
export interface ContractBasicInfo {
  title: string;          // 合同标题
  type: ContractType;     // 合同类型
  parties: {              // 合同当事人
    partyA: string;       // 甲方
    partyB: string;       // 乙方
    others?: string[];    // 其他相关方
  };
  date: string;           // 签订日期
  amount: string;         // 合同金额
  period: {              // 合同期限
    start: string;       // 开始日期
    end: string;         // 结束日期
  };
}

// 合同条款
export interface ContractClause {
  type: ClauseType;      // 条款类型
  title: string;         // 条款标题
  content: string;       // 条款内容
  analysis: {
    risk: RiskLevel;     // 风险等级
    issues: string[];    // 存在的问题
    suggestions: string[]; // 修改建议
  };
}

// 风险分析
export interface RiskAnalysis {
  category: string;      // 风险类别
  level: RiskLevel;      // 风险等级
  description: string;   // 风险描述
  impact: string;        // 影响分析
  suggestion: string;    // 处理建议
  priority: number;      // 处理优先级
}

// 合规性分析
export interface ComplianceAnalysis {
  legalCompliance: {     // 法律合规性
    issues: string[];    // 问题列表
    references: string[]; // 法律依据
  };
  industryStandards: {   // 行业标准
    issues: string[];    // 问题列表
    standards: string[]; // 标准引用
  };
  internalPolicies: {    // 内部政策
    issues: string[];    // 问题列表
    policies: string[]; // 政策引用
  };
}

// 权利义务分析
export interface RightsObligationsAnalysis {
  balance: string;       // 权利义务平衡性
  partyA: {             // 甲方权利义务
    rights: string[];    // 权利列表
    obligations: string[]; // 义务列表
  };
  partyB: {             // 乙方权利义务
    rights: string[];    // 权利列表
    obligations: string[]; // 义务列表
  };
}

// 修改建议
export interface Suggestion {
  target: string;       // 修改目标
  content: string;      // 修改内容
  reason: string;       // 修改原因
  priority: RiskLevel;  // 优先级
}

// 合同审查结果
export interface ContractReviewResult {
  basicInfo: ContractBasicInfo;
  clauses: ContractClause[];
  risks: RiskAnalysis[];
  compliance: ComplianceAnalysis;
  rightsObligations: RightsObligationsAnalysis;
  suggestions: Suggestion[];
  overallRisk: RiskLevel;
}

// 文件信息
export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: string;
} 