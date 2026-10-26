import React from 'react';
import type { Career } from '../../types/index.ts';
import { X, Bookmark, ExternalLink, Briefcase, GraduationCap, DollarSign, Award, Clock, ArrowRight } from 'lucide-react';

interface CareerDetailModalProps {
  career: Career | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (careerId: string) => void;
  onStartAssessment?: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  onClose,
  isSaved = false,
  onToggleSave,
  onStartAssessment
}) => {
  if (!career) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div>
            <div className="text-xs text-slate-400 mb-1">
              <span>{career.category}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span className="text-emerald-400 font-medium">Demand: {career.industryDemand}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {career.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 italic">
              "{career.tagline}"
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(career.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isSaved ? 'Saved to favorites' : 'Save career'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Role Overview
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {career.description}
            </p>
          </div>

          {/* Typical Day */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>A Typical Day in the Life</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{career.typicalDay}"
            </p>
          </div>

          {/* Key Responsibilities */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Primary Responsibilities
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {career.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core & Secondary Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5">
                Core Requisite Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.coreSkills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5">
                Secondary & Tooling Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {career.secondarySkills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Curated Learning Resources */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Curated Free & Professional Learning Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {career.learningResources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between group"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                      {res.title}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{res.platform}</span>
                      <span>·</span>
                      <span className={res.isFree ? 'text-emerald-400' : 'text-slate-400'}>
                        {res.isFree ? 'Free' : 'Accredited'}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Salary Benchmarks */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">Industry Compensation Estimates</span>
              <span className="text-[10px] text-slate-500 font-mono">Reference Benchmarks</span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Entry Level</span>
                <span className="text-slate-200 font-bold">{career.salaryRange.entry}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Median Experience</span>
                <span className="text-emerald-400 font-bold">{career.salaryRange.median}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Senior / Lead</span>
                <span className="text-indigo-300 font-bold">{career.salaryRange.experienced}</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 leading-tight">
              Source: {career.salaryRange.source}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
          >
            Close
          </button>

          {onStartAssessment && (
            <button
              onClick={() => { onClose(); onStartAssessment(); }}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Test My Match for This Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
