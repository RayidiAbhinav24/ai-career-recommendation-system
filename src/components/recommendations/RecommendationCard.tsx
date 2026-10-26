import React from 'react';
import type { CareerRecommendation } from '../../types/index.ts';
import { Sparkles, ArrowRight, Bookmark, Check, AlertTriangle, Layers, ExternalLink } from 'lucide-react';

interface RecommendationCardProps {
  rec: CareerRecommendation;
  onViewDetails: (rec: CareerRecommendation) => void;
  isSaved?: boolean;
  onToggleSave?: (careerId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  rec,
  onViewDetails,
  isSaved = false,
  onToggleSave
}) => {
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg shadow-slate-950/40">
      <div>
        {/* Header strip with zero-pill clean text metadata */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="text-xs text-slate-400">
            <span>{rec.category}</span>
            <span aria-hidden="true" className="mx-1.5">·</span>
            <span className="font-mono text-slate-400">Entry: {rec.salaryEstimate.entry.split(' ')[0]}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
              {rec.matchPercentage}% Match
            </span>
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(rec.careerId)}
                title={isSaved ? 'Remove from saved' : 'Save career'}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
          {rec.careerTitle}
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
          {rec.matchRationale}
        </p>

        {/* Multi-Factor Score Bars */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Alignment Vector Breakdown</span>
            <span className="text-indigo-400 font-mono text-[10px]">Weighted</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Interests</span>
                <span className="text-slate-200">{rec.scoreBreakdown.interestScore}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rec.scoreBreakdown.interestScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Skills</span>
                <span className="text-slate-200">{rec.scoreBreakdown.skillScore}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rec.scoreBreakdown.skillScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Academics</span>
                <span className="text-slate-200">{rec.scoreBreakdown.academicScore}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${rec.scoreBreakdown.academicScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Work Dynamics</span>
                <span className="text-slate-200">{rec.scoreBreakdown.workStyleScore}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rec.scoreBreakdown.workStyleScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Existing Strengths preview */}
        {rec.existingStrengths && rec.existingStrengths.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <div className="text-[11px] font-semibold text-slate-400">Core Strengths Identified:</div>
            {rec.existingStrengths.slice(0, 2).map((str, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-mono text-[11px] mt-0.5">✓</span>
                <span className="truncate">{str}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500 font-mono">
          {rec.roadmapPhases ? `${rec.roadmapPhases.length} Roadmap Phases` : 'Roadmap Ready'}
        </span>

        <button
          onClick={() => onViewDetails(rec)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Deep Dive</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
