/**
 * KRUSHIDRISHTI AI — Master Application Component
 * “Smart Vision for Healthier Crops”
 * Developed by Sopan Pandit Gavali
 */

import React, { useState, useEffect } from 'react';
import { Language, UserProfile, AnalysisRecordData } from './types.js';
import { getStoredUser, clearStoredAuth } from './api.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { AuthModal } from './components/AuthModal.js';
import { HomeView } from './views/HomeView.js';
import { ScanView } from './views/ScanView.js';
import { ResultView } from './views/ResultView.js';
import { HistoryView } from './views/HistoryView.js';
import { KnowledgeView } from './views/KnowledgeView.js';
import { ExpertView } from './views/ExpertView.js';
import { AdminView } from './views/AdminView.js';
import { AboutView } from './views/AboutView.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('kdr_lang') as Language) || 'en';
  });
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AnalysisRecordData | null>(null);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('kdr_lang', newLang);
  };

  const handleLogout = () => {
    clearStoredAuth();
    setUser(null);
  };

  const handleScanComplete = (record: AnalysisRecordData) => {
    setCurrentRecord(record);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryRecord = (record: AnalysisRecordData) => {
    setCurrentRecord(record);
    setActiveTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        setLang={handleSetLang}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeView
            lang={lang}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'scan' && (
          <ScanView
            lang={lang}
            onScanComplete={handleScanComplete}
            onRequestExpert={() => setActiveTab('expert')}
          />
        )}

        {activeTab === 'result' && currentRecord && (
          <ResultView
            record={currentRecord}
            lang={lang}
            onAnalyzeAnother={() => setActiveTab('scan')}
            onRequestExpert={() => setActiveTab('expert')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            lang={lang}
            onSelectRecord={handleSelectHistoryRecord}
            onNewScan={() => setActiveTab('scan')}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeView lang={lang} />
        )}

        {activeTab === 'expert' && (
          <ExpertView
            lang={lang}
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onInspectRecord={handleSelectHistoryRecord}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            lang={lang}
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView lang={lang} />
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </div>
  );
}
