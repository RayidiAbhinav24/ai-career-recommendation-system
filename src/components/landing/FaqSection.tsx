import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface FaqSectionProps {
  onStartAssessment: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onStartAssessment }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does CareerAI calculate my career match percentage?',
      a: 'We use a transparent multi-factor scoring formula that evaluates four vectors: Interest Alignment (35%), Self-Assessed Skills vs Industry Core Demands (35%), Academic Background & Degree Coursework (15%), and Work Style Preferences (15%). When you review your assessment, you can even customize these weights before recommendations are generated.'
    },
    {
      q: 'Is this assessment a scientifically validated psychological test?',
      a: 'No. CareerAI is an educational and skills-oriented career exploration platform. We intentionally avoid pseudoscientific personality typologies (such as MBTI or horoscope-like labels). Instead, our system evaluates real tangible factors: coursework you have completed, technical and interpersonal skills you have developed, and concrete industry work environments you prefer.'
    },
    {
      q: 'Can I retake or update my assessment answers later?',
      a: 'Yes, absolutely. You can update your profile, adjust your self-rated skill proficiencies as you learn new technologies, and retake the assessment at any time from your Student Dashboard. Each completed assessment is archived so you can track your growth over time.'
    },
    {
      q: 'Where do the salary ranges and demand statistics come from?',
      a: 'All salary and industry demand projections cite official benchmarks from the US Bureau of Labor Statistics (BLS Occupational Outlook Handbook 2024–2034) and established tech industry compensation surveys. We clearly label all figures as reference estimates and never invent false salary guarantees.'
    },
    {
      q: 'How does the personalized 5-phase learning roadmap work?',
      a: 'For every recommended career, we automatically construct a 5-phase curriculum: Fundamentals, Intermediate Concepts, Specialized Tooling, Portfolio Capstone Building, and Certification/Interview Prep. As you study, you can check off specific milestone tasks directly in your student dashboard to track progress.'
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950/70">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-indigo-400 tracking-wide uppercase mb-2">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Common questions about CareerAI
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Transparent methodology, rigorous standards, and honest guidance.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors"
                >
                  <span className="text-base font-semibold text-slate-100">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final CTA Strip */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 text-center flex flex-col items-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            Ready to find your ideal career trajectory?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mb-6 leading-relaxed">
            Take the 5-minute assessment today and get your personalized career recommendations and structured roadmap.
          </p>
          <button
            onClick={onStartAssessment}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <span>Start Free Career Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
