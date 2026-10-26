import React from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartAssessment: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartAssessment }) => {
  const steps = [
    {
      num: '01',
      title: 'Complete the Multi-Step Assessment',
      desc: 'Input your academic history, select passions, rate 10 key skills from 1–5, and define work preferences and career goals.',
      meta: 'Takes ~5 minutes · No prior preparation needed'
    },
    {
      num: '02',
      title: 'Multi-Vector Matching & Weighting',
      desc: 'Our scoring engine measures alignment across interests (35%), skills (35%), academics (15%), and work dynamics (15%).',
      meta: 'Configurable weights · Transparent calculation'
    },
    {
      num: '03',
      title: 'Receive Ranked Recommendations',
      desc: 'Get matched with top career paths complete with match rationale, existing strengths, skill gaps, and salary benchmarks.',
      meta: 'Top 3–4 vetted roles · BLS data sources'
    },
    {
      num: '04',
      title: 'Follow Your 5-Phase Learning Roadmap',
      desc: 'Track your transition through curated study topics, free/paid courses, beginner portfolio projects, and certifications.',
      meta: 'Interactive milestones · Checkbox progress tracking'
    }
  ];

  return (
    <section className="py-20 bg-slate-900/30 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-indigo-400 tracking-wide uppercase mb-2">
            The Roadmap To Success
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            How CareerAI turns your interests into an actionable career plan
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            From discovering hidden alignments to tracking every study milestone in an interactive dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Steps List */}
          <div className="lg:col-span-7 space-y-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors flex items-start gap-5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="pt-1 text-xs text-indigo-300/80 font-mono">
                    {step.meta}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Graphic Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
              <img
                src="/src/assets/images/career_stem_pathway_1793021905309.jpg"
                alt="Personalized Career Pathway Architecture"
                className="w-full h-auto object-cover max-h-[440px]"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 border-t border-slate-800 bg-slate-950/80">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Intelligent Trajectory Architecture
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Each recommended career automatically generates structured learning phases with realistic projects and verified resource links.
                </p>
                <button
                  onClick={onStartAssessment}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Career Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
