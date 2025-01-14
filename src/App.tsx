import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import ContentArea from './components/Layout/ContentArea';
import CaseAnalysis from './components/CaseAnalysis/CaseAnalysis';
import LegalConsultation from './components/LegalConsultation/LegalConsultation';
import CaseSearch from './components/CaseSearch/CaseSearch';
import DocumentDraft from './components/DocumentDraft/DocumentDraft';
import ContractReview from './components/ContractReview/ContractReview';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/legal-consultation" replace />} />
        
        <Route 
          path="legal-consultation" 
          element={
            <ContentArea
              title="AI法律咨询"
              description="智能法律顾问为您提供专业的法律咨询服务，解答您的法律问题。"
            >
              <LegalConsultation />
            </ContentArea>
          } 
        />

        <Route 
          path="case-analysis" 
          element={
            <ContentArea
              title="检院案件分析"
              description="上传案件文件，AI将从多个维度进行专业分析，提供详细的案件解析和办案建议。"
            >
              <CaseAnalysis />
            </ContentArea>
          } 
        />

        <Route 
          path="case-search" 
          element={
            <ContentArea
              title="案例搜索"
              description="智能搜索相关案例，帮助您快速找到参考价值的判例。"
            >
              <CaseSearch />
            </ContentArea>
          } 
        />

        <Route 
          path="document-draft" 
          element={
            <ContentArea
              title="文书生成"
              description="智能生成各类法律文书，提高文书撰写效率。"
            >
              <DocumentDraft />
            </ContentArea>
          } 
        />

        <Route 
          path="contract-review" 
          element={
            <ContentArea
              title="合同审查"
              description="AI智能分析合同条款，识别潜在风险，提供修改建议。"
            >
              <ContractReview />
            </ContentArea>
          } 
        />

      </Route>
    </Routes>
  );
};

export default App; 