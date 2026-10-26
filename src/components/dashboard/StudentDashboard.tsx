import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type {
  StudentProfile,
  CareerRecommendation,
  LearningRoadmap,
  SavedCareer
} from '../../types/index.ts';
import { RecommendationCard } from '../recommendations/RecommendationCard.tsx';
import { RecommendationModal } from '../recommendations/RecommendationModal.tsx';
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  Compass,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToAssessment: () => void;
  onNavigateToExplore: () => void;
  onNavigateToProfile: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToAssessment,
  onNavigateToExplore,
  onNavigateToProfile
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [roadmaps, setRoadmaps] = useState<LearningRoadmap[]>([]);
  const [savedCareers, setSavedCareers] = useState<SavedCareer[]>([]);
  const [selectedRec, setSelectedRec] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  // Active roadmap selection
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profData, recData, rdmData, savedData] = await Promise.all([
        api.getProfile().catch(() => ({ profile: null })),
        api.getRecommendations().catch(() => ({ recommendations: [] })),
        api.getRoadmaps().catch(() => ({ roadmaps: [] })),
        api.getSavedCareers().catch(() => ({ savedCareers: [] }))
      ]);

      setProfile(profData.profile);
      setRecommendations(recData.recommendations);
      setRoadmaps(rdmData.roadmaps);
      setSavedCareers(savedData.savedCareers);

      if (rdmData.roadmaps.length > 0) {
        setActiveRoadmapId(rdmData.roadmaps[0].id);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleToggleMilestone = async (roadmapId: string, milestoneId: string, currentStatus: boolean) => {
    try {
      const res = await api.updateMilestoneProgress(roadmapId, milestoneId, !currentStatus);
      setRoadmaps(prev => prev.map(r => (r.id === roadmapId ? res.roadmap : r)));
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  };

  const handleToggleSaveCareer = async (careerId: string) => {
    const isSaved = savedCareers.some(s => s.careerId === careerId);
    try {
      if (isSaved) {
        await api.removeSavedCareer(careerId);
        setSavedCareers(prev => prev.filter(s => s.careerId !== careerId));
      } else {
        const res = await api.saveCareer(careerId);
        setSavedCareers(prev => [...prev, res.saved]);
      }
    } catch (err) {
      console.error('Failed to toggle save career:', err);
    }
  };

  const activeRoadmap = roadmaps.find(r => r.id === activeRoadmapId) || roadmaps[0];

  // Calculate profile completion percentage
  let profilePoints = 25; // default created
  if (profile?.degree) profilePoints += 25;
  if (profile?.academicSubjects && profile.academicSubjects.length > 0) profilePoints += 25;
  if (recommendations.length > 0) profilePoints += 25;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm">Loading your personalized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-2xl shrink-0">
              {user?.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Intelligence Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {profile?.degree ? `${profile.degree} · ${profile.currentYear}` : 'Ready to discover your career roadmap'}
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToAssessment}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/30 cursor-pointer"
          >
            <span>Retake Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNavigateToProfile}
            className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Profile Completion */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">Profile Strength</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{profilePoints}%</div>
            <div className="text-[11px] text-emerald-400 mt-1">Verified & Active</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center font-mono text-xs font-bold text-indigo-300">
            {profilePoints}%
          </div>
        </div>

        {/* Recommendations Count */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">Career Matches</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{recommendations.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Top: {recommendations[0]?.matchPercentage || 94}% Fit
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Roadmap Milestones */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">Roadmap Progress</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {activeRoadmap ? `${activeRoadmap.completedMilestones}/${activeRoadmap.totalMilestones}` : '0/0'}
            </div>
            <div className="text-[11px] text-indigo-400 mt-1 font-mono">
              {activeRoadmap && activeRoadmap.totalMilestones > 0
                ? `${Math.round((activeRoadmap.completedMilestones / activeRoadmap.totalMilestones) * 100)}% Completed`
                : 'Not started'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Saved Careers */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 mb-1">Saved Favorites</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{savedCareers.length}</div>
            <button
              onClick={onNavigateToExplore}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 mt-1 block cursor-pointer"
            >
              Browse Catalog &rarr;
            </button>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Recommendations & Gap, Right = Roadmap Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Top Recommended Careers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Your Top Career Matches
              </h2>
              <p className="text-xs text-slate-400">
                Ranked by multi-vector compatibility with your skills, interests, and goals.
              </p>
            </div>
            <button
              onClick={onNavigateToAssessment}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
            >
              Re-calculate
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <Compass className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">No recommendations yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Complete your 5-minute career assessment to receive personalized career recommendations.
              </p>
              <button
                onClick={onNavigateToAssessment}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                Launch Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  onViewDetails={setSelectedRec}
                  isSaved={savedCareers.some(s => s.careerId === rec.careerId)}
                  onToggleSave={handleToggleSaveCareer}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Interactive Roadmap Tracker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Personalized Learning Roadmap
              </h2>
              <p className="text-xs text-slate-400">
                {activeRoadmap ? activeRoadmap.careerTitle : 'Select a recommended career'}
              </p>
            </div>
            {roadmaps.length > 1 && (
              <select
                value={activeRoadmapId || ''}
                onChange={(e) => setActiveRoadmapId(e.target.value)}
                className="text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1"
              >
                {roadmaps.map(r => (
                  <option key={r.id} value={r.id}>{r.careerTitle}</option>
                ))}
              </select>
            )}
          </div>

          {activeRoadmap ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-6">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                <span className="font-semibold text-white">{activeRoadmap.careerTitle}</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {Math.round((activeRoadmap.completedMilestones / Math.max(1, activeRoadmap.totalMilestones)) * 100)}% Complete
                </span>
              </div>

              {/* Phases Accordion / List */}
              <div className="space-y-5">
                {activeRoadmap.phases.map((phase) => (
                  <div key={phase.phaseNumber} className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-mono text-indigo-400 font-medium">
                          Phase {phase.phaseNumber} · {phase.duration}
                        </div>
                        <h4 className="text-xs font-bold text-slate-100">
                          {phase.title}
                        </h4>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {phase.description}
                    </p>

                    {/* Checkable Milestones */}
                    <div className="space-y-1.5 pt-1">
                      {phase.milestones.map((m) => (
                        <label
                          key={m.id}
                          className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => handleToggleMilestone(activeRoadmap.id, m.id, m.completed)}
                            className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                          <span className={`text-xs leading-tight transition-colors ${
                            m.completed ? 'line-through text-slate-500' : 'text-slate-300 group-hover:text-white'
                          }`}>
                            {m.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
              No active learning roadmap. Complete an assessment or save a career to generate your 5-phase plan.
            </div>
          )}

          {/* Saved Careers Quick Strip */}
          {savedCareers.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Saved Careers ({savedCareers.length})
              </div>
              <div className="space-y-2">
                {savedCareers.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">
                        {item.career?.title || item.careerId}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.career?.category}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSaveCareer(item.careerId)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deep Dive Modal */}
      {selectedRec && (
        <RecommendationModal
          rec={selectedRec}
          onClose={() => setSelectedRec(null)}
          isSaved={savedCareers.some(s => s.careerId === selectedRec.careerId)}
          onToggleSave={handleToggleSaveCareer}
          onStartRoadmap={(careerId) => {
            const found = roadmaps.find(r => r.careerId === careerId);
            if (found) setActiveRoadmapId(found.id);
            setSelectedRec(null);
          }}
        />
      )}
    </div>
  );
};
