import React from 'react';
import { AlertCircle, CheckCircle2, Sliders, Target, BookOpen, Layers } from 'lucide-react';

export const ProblemSolutionSection: React.FC = () => {
  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold text-indigo-400 tracking-wide uppercase mb-2">
            The Problem & The Solution
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            Career guidance is broken. CareerAI replaces guesswork with personalized intelligence.
          </h2>
          <p className="mt-3 text-slate-400 text-base leading-relaxed">
            Most students pick specializations based on hearsay or fleeting trends. We provide transparent, data-grounded roadmaps tailored to who you actually are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* The Traditional Dilemma */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-rose-400 mb-4 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>The Traditional Career Dilemma</span>
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-4">
                Decisions driven by pressure, not true alignment
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400/80 font-mono text-xs mt-0.5">✕</span>
                  <span><strong>Peer & Parental Pressure:</strong> Choosing majors because friends or parents expect them, leading to burnout.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400/80 font-mono text-xs mt-0.5">✕</span>
                  <span><strong>Hyped Salary Chasing:</strong> Selecting roles based on superficial social media claims without understanding day-to-day duties.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400/80 font-mono text-xs mt-0.5">✕</span>
                  <span><strong>Generic 1-Hour Counseling:</strong> Infrequent sessions that hand out high-level pamphlets without an actual implementation plan.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-500">
              Result: 43% of college graduates work in fields unrelated to their degree after graduation.
            </div>
          </div>

          {/* The CareerAI Advantage */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex flex-col justify-between shadow-lg shadow-indigo-950/20">
            <div>
              <div className="flex items-center gap-2.5 text-indigo-400 mb-4 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>The CareerAI Intelligent Engine</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Personalized, objective & actionable roadmap
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono text-xs mt-0.5">✓</span>
                  <span><strong>Multi-Vector Profiling:</strong> Evaluates interests, 10 key technical & soft skills, coursework, and work style preferences.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono text-xs mt-0.5">✓</span>
                  <span><strong>Transparent Scoring:</strong> Inspect exactly how interest match (35%), skills (35%), academics (15%), and work style (15%) combine.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-mono text-xs mt-0.5">✓</span>
                  <span><strong>5-Phase Actionable Roadmap:</strong> Checkable study milestones, vetted free/premium resources, and capstone project blueprints.</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-indigo-300/80">
              Outcome: 100% clarity on what skills you need to learn next and how to build a hiring-ready portfolio.
            </div>
          </div>
        </div>

        {/* 3 Pillars Bento Strip */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/70">
            <Sliders className="w-5 h-5 text-indigo-400 mb-3" />
            <h4 className="text-base font-semibold text-white mb-1">Configurable Weights</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fine-tune how much emphasis the engine places on your passions vs current skills or academic background.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/70">
            <Target className="w-5 h-5 text-indigo-400 mb-3" />
            <h4 className="text-base font-semibold text-white mb-1">Accurate Skill-Gap Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pinpoints the exact delta between your current proficiency and industry benchmarks for your target role.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/70">
            <BookOpen className="w-5 h-5 text-indigo-400 mb-3" />
            <h4 className="text-base font-semibold text-white mb-1">Grounded Reference Data</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No hallucinated salaries or fake metrics. All salary figures cite official BLS and industry market reports.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
