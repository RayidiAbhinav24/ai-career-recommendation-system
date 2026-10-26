import React from 'react';
import type { CareerRecommendation } from '../../types/index.ts';
import { X, Check, AlertCircle, Bookmark, Layers, Code, Award, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface RecommendationModalProps {
  rec: CareerRecommendation | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (careerId: string) => void;
  onStartRoadmap?: (careerId: string) => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  rec,
  onClose,
  isSaved = false,
  onToggleSave,
  onStartRoadmap
}) => {
  if (!rec) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div>
            <div className="text-xs text-slate-400 mb-1">
              <span>{rec.category}</span>
              <span aria-hidden="true" className="mx-2">·</span>
              <span className="font-mono text-emerald-400 font-bold">{rec.matchPercentage}% Compatibility Match</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {rec.careerTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(rec.careerId)}
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
          {/* Match Rationale & Breakdown */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <h3 className="text-sm font-semibold text-white mb-2">Why This Career Matches You</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {rec.matchRationale}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/60 font-mono text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Interests Match</span>
                <span className="text-sm font-bold text-indigo-400">{rec.scoreBreakdown.interestScore}%</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Skills Match</span>
                <span className="text-sm font-bold text-indigo-400">{rec.scoreBreakdown.skillScore}%</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Academic Fit</span>
                <span className="text-sm font-bold text-sky-400">{rec.scoreBreakdown.academicScore}%</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Work Style</span>
                <span className="text-sm font-bold text-emerald-400">{rec.scoreBreakdown.workStyleScore}%</span>
              </div>
            </div>
          </div>

          {/* Strengths & Skill Gaps Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Existing Strengths */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Your Existing Strengths</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {rec.existingStrengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-xs mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skill Gaps to Bridge */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Identified Skill Gaps</span>
              </h4>
              <div className="space-y-3">
                {rec.skillGaps.map((gap, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{gap.skill}</span>
                      <span className="text-[10px] font-mono text-amber-400">{gap.importance}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Current: Level {gap.currentLevel}/5</span>
                      <span>Target: Level {gap.requiredLevel}/5</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Beginner Projects */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Recommended Beginner Projects to Build</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {rec.beginnerProjects.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="text-xs font-bold text-slate-200 mb-1">{p.title}</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.techStack.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Education Paths */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Recommended Certifications</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {rec.recommendedCertifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2">
                    <span className="text-indigo-400 font-mono">•</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Career Progression Ladder</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                {rec.careerProgression.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Salary Benchmark Citation */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">Industry Compensation Benchmarks</span>
              <span className="text-[10px] text-slate-500 font-mono">Reference Data</span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-center">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Entry Level</span>
                <span className="text-slate-200 font-bold">{rec.salaryEstimate.entry}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Median Experience</span>
                <span className="text-emerald-400 font-bold">{rec.salaryEstimate.median}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Senior / Lead</span>
                <span className="text-indigo-300 font-bold">{rec.salaryEstimate.experienced}</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 leading-tight">
              Source: {rec.salaryEstimate.source}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between gap-4 shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {rec.roadmapPhases.length} Structured Learning Phases Ready
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
            >
              Close
            </button>
            {onStartRoadmap && (
              <button
                onClick={() => onStartRoadmap(rec.careerId)}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                Track in Dashboard Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
