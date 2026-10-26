/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { HeroSection } from './components/landing/HeroSection.tsx';
import { ProblemSolutionSection } from './components/landing/ProblemSolutionSection.tsx';
import { HowItWorksSection } from './components/landing/HowItWorksSection.tsx';
import { TestimonialsSection } from './components/landing/TestimonialsSection.tsx';
import { FaqSection } from './components/landing/FaqSection.tsx';
import { CareerDirectory } from './components/careers/CareerDirectory.tsx';
import { AssessmentWizard } from './components/assessment/AssessmentWizard.tsx';
import { StudentDashboard } from './components/dashboard/StudentDashboard.tsx';
import { ProfileSettings } from './components/profile/ProfileSettings.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import type { CareerRecommendation } from './types/index.ts';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartAssessment = () => {
    if (!user) {
      handleOpenAuth('register');
      return;
    }
    setActiveTab('assessment');
  };

  const handleAssessmentComplete = (recs: CareerRecommendation[]) => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-300">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onStartAssessment={handleStartAssessment}
              onExploreCareers={() => setActiveTab('explore')}
            />
            <ProblemSolutionSection />
            <HowItWorksSection onStartAssessment={handleStartAssessment} />
            <TestimonialsSection />
            <FaqSection onStartAssessment={handleStartAssessment} />
          </div>
        )}

        {activeTab === 'explore' && (
          <CareerDirectory onStartAssessment={handleStartAssessment} />
        )}

        {activeTab === 'assessment' && (
          <AssessmentWizard
            onComplete={handleAssessmentComplete}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            onNavigateToAssessment={() => setActiveTab('assessment')}
            onNavigateToExplore={() => setActiveTab('explore')}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettings />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Split-screen Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (activeTab === 'home') {
            setActiveTab('dashboard');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
