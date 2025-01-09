# AI Legal Assistant (AI法律助手)

一个现代化的AI法律助手网站，提供智能法律咨询、案例搜索、文件分析和法律文书生成服务。

## 项目概述

AI Legal Assistant是一个基于React的Web应用程序，集成了Deepseek和COZE的AI能力，为用户提供专业的法律服务支持。项目采用现代化的科技风格设计，提供直观的用户界面和流畅的交互体验。

## 核心功能

### 1. AI法律对话
- 实时智能对话
- 专业法律问题解答
- 法律建议提供
- 基于Deepseek API

### 2. 案例搜索
- 关键词智能搜索
- 案例快速检索
- 相关案例推荐
- 基于COZE API

### 3. 法律文件分析
- 支持多种文件格式
- 智能文本分析
- 法律风险提示
- 专业建议生成
- 基于COZE API

### 4. 法律文书生成
- 多类型文书模板
- 智能内容生成
- 格式规范把控
- 基于COZE API

## 技术架构

### 前端技术栈
- React.js - 用户界面框架
- Tailwind CSS - 样式框架
- Axios - API请求处理

### API集成
- Deepseek API - AI对话功能
- COZE API - 案例搜索、文件分析、文书生成

## 项目结构
```
legal-ai-assistant/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Chat/                 # AI对话相关组件
│   │   ├── CaseSearch/          # 案例搜索相关组件
│   │   ├── DocumentAnalysis/    # 文件分析相关组件
│   │   ├── DocumentGeneration/  # 文书生成相关组件
│   │   └── common/             # 公共组件
│   ├── services/
│   │   ├── deepseekService.js   # Deepseek API 集成
│   │   └── cozeService.js       # COZE API 集成
│   ├── styles/
│   │   └── main.css
│   └── App.js
├── package.json
└── README.md
```

## 界面设计特点
- 深色主题
- 现代科技风格
- 响应式布局
- 直观的用户交互

## 性能优化
- 组件懒加载
- API请求优化
- 大文件处理优化


## 安全特性
- API密钥保护


## 开发环境要求
- Node.js >= 14.0.0
- npm >= 6.14.0
- 现代浏览器支持

## 快速开始

1. 克隆项目
```bash
git clone [repository-url]
cd legal-ai-assistant
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件，添加必要的API密钥
```

4. 启动开发服务器
```bash
npm start
```

## 注意事项
- 本项目不包含用户注册和登录功能
- 所有会话数据仅保存在当前浏览器会话中
- 需要确保Deepseek和COZE API密钥的正确配置

## 贡献指南
欢迎提交问题和改进建议。

## 许可证
MIT License 