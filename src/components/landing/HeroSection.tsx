import React from 'react';
import { ArrowRight, Compass, Sparkles, TrendingUp, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface HeroSectionProps {
  onStartAssessment: () => void;
  onExploreCareers: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartAssessment,
  onExploreCareers
}) => {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed editorial kicker (zero-pill compliance) */}
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Career Intelligence</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Objective Skill & Goal Analysis</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white text-balance leading-[1.12]">
              Discover Your Future. <br />
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-100 to-slate-200 bg-clip-text text-transparent">
                Build Your Career.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              AI-powered career guidance that understands your interests, skills, and ambitions to help you discover the right path. Avoid guesswork and peer pressure with personalized 5-phase learning roadmaps.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAssessment}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-2.5 cursor-pointer"
              >
                <span>{user ? 'Launch Career Assessment' : 'Discover My Career'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCareers}
                className="px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Explore Career Paths</span>
              </button>
            </div>

            {/* Quiet Trust Markers (Zero-Pill Compliance) */}
            <div className="pt-6 border-t border-slate-900/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Transparent Scoring Weights</span>
              </div>
              <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span>5-Phase Structured Milestones</span>
              </div>
              <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>BLS Industry Benchmarks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-2xl shadow-indigo-950/40">
              <img
                src="/src/assets/images/hero_career_guidance_1793021903853.jpg"
                alt="AI Career Trajectory and Roadmap Visualization"
                className="w-full h-auto object-cover object-center max-h-[480px]"
                referrerPolicy="no-referrer"
              />

              {/* Floating Match Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800/90 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-medium text-slate-400">Primary Match Preview</div>
                  <div className="text-xs font-bold text-emerald-400 font-mono tabular-nums">94% Compatibility</div>
                </div>
                <div className="text-sm font-semibold text-white">AI / Machine Learning Engineer</div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Python · Math · Algorithms</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-300">5-Phase Roadmap Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
