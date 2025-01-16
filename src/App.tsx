import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import MobileLayout from './components/Layout/MobileLayout';
import LegalConsultation from './components/LegalConsultation/LegalConsultation';
import LawyerAnalysis from './components/LawyerAnalysis/LawyerAnalysis';
import CaseSearch from './components/CaseSearch/CaseSearch';
import DocumentDraft from './components/DocumentDraft/DocumentDraft';
import { ContractReview } from './components/ContractReview/ContractReview';
import { useMediaQuery } from 'react-responsive';

const App: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const Layout = isMobile ? MobileLayout : MainLayout;

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/legal-consultation" replace />} />
          <Route path="legal-consultation" element={<LegalConsultation />} />
          <Route path="lawyer-analysis" element={<LawyerAnalysis />} />
          <Route path="case-search" element={<CaseSearch />} />
          <Route path="document-draft" element={<DocumentDraft />} />
          <Route path="contract-review" element={<ContractReview />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App; 