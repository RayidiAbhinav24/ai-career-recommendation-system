import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">CareerAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent, objective career guidance platform empowering students and early-career talent with transparent skill benchmarking and personalized learning roadmaps.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Explore Careers Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Career Assessment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Student Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Top Fields */}
          <div>
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Specializations
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>Artificial Intelligence & Machine Learning</li>
              <li>Full Stack Software Engineering</li>
              <li>Cybersecurity & Infrastructure</li>
              <li>Data Science & Business Intelligence</li>
              <li>UI/UX & Product Design</li>
            </ul>
          </div>

          {/* Methodological Transparency & Trust */}
          <div>
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Methodology & Ethics
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Career recommendations are educational estimates combining self-reported proficiency and curricular coursework. Salary data references US BLS 2024–2034 statistics.
            </p>
            <div className="flex items-center gap-1.5 text-indigo-400 text-[11px]">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>Transparent & Non-Commercial</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} CareerAI. All rights reserved. Built for students worldwide.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
