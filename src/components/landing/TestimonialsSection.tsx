import React from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: '3rd Year Computer Science & Math',
      avatar: '/src/assets/images/avatar_student_sarah_1793021904967.jpg',
      targetCareer: 'AI / Machine Learning Engineer',
      matchScore: '94% Match',
      quote:
        'I had strong math grades but felt overwhelmed by whether to pursue data science, full-stack, or machine learning. CareerAI highlighted that my linear algebra proficiency and analytical thinking mapped directly to AI Engineering. The 5-phase roadmap guided me to build my first RAG project, and I landed a summer research fellowship!'
    },
    {
      name: 'David Alvarez',
      role: 'Recent Information Systems Graduate',
      avatar: '/src/assets/images/avatar_student_david_1793021905828.jpg',
      targetCareer: 'Cybersecurity Analyst',
      matchScore: '91% Match',
      quote:
        'Before using CareerAI, I was applying randomly to generic IT jobs without any portfolio direction. The assessment revealed that my investigative mindset and networking coursework made me an ideal fit for cybersecurity. The specific advice to obtain Security+ and complete TryHackMe SOC labs made all the difference in interviews.'
    }
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold text-indigo-400 tracking-wide uppercase mb-2">
            Student Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            Real student journeys from uncertainty to career clarity
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            See how structured skill benchmarking and milestone roadmaps empowered students to achieve tangible internships and job offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-xs font-mono font-medium text-emerald-400">
                    {t.matchScore}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.role}</div>
                  <div className="text-xs text-indigo-400 font-medium mt-0.5">
                    Target: {t.targetCareer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
