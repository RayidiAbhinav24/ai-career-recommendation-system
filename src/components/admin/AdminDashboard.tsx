import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type { Career, AdminStats, AdminAuditLog } from '../../types/index.ts';
import {
  ShieldCheck,
  Users,
  Briefcase,
  FileText,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  Layers,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for creating/editing career
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Partial<Career> | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, careersData, logsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminCareers(),
        api.getAdminAuditLogs()
      ]);
      setStats(statsData.stats);
      setCareers(careersData.careers);
      setAuditLogs(logsData.auditLogs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCareer({
      title: '',
      category: 'Software Engineering',
      tagline: '',
      description: '',
      responsibilities: ['Architect scalable systems', 'Conduct code reviews'],
      coreSkills: ['TypeScript', 'Python'],
      secondarySkills: ['Docker', 'Git'],
      educationPaths: ['B.S. in Computer Science or related degree'],
      industryDemand: 'High',
      salaryRange: {
        entry: '$85,000 / yr',
        median: '$130,000 / yr',
        experienced: '$180,000+ / yr',
        source: 'US BLS Occupational Outlook'
      },
      typicalDay: 'Collaborating with cross-functional engineering teams and deploying features.',
      learningResources: [
        { title: 'Official Documentation', type: 'Documentation', url: 'https://developer.mozilla.org', platform: 'MDN', isFree: true }
      ],
      careerProgression: ['Junior Engineer', 'Senior Engineer', 'Principal Architect'],
      relatedCareers: ['Data Scientist', 'DevOps Specialist'],
      recommendedCertifications: ['AWS Developer Associate'],
      suitableInterests: ['Programming and technology', 'Engineering']
    });
    setIsModalOpen(true);
  };

  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCareer?.title || !editingCareer?.category) return;

    try {
      if (editingCareer.id) {
        await api.updateAdminCareer(editingCareer.id, editingCareer);
        setStatusMsg(`Updated "${editingCareer.title}"`);
      } else {
        await api.createAdminCareer(editingCareer);
        setStatusMsg(`Created career "${editingCareer.title}"`);
      }
      setIsModalOpen(false);
      setEditingCareer(null);
      loadAdminData();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save career.');
    }
  };

  const handleDeleteCareer = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the career "${title}"?`)) return;
    try {
      await api.deleteAdminCareer(id);
      setStatusMsg(`Deleted career "${title}"`);
      loadAdminData();
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete career.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          This portal requires administrative authorization. Please sign in with an admin account (e.g. demo admin: admin@careerai.dev).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrative Command Console</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            CareerAI System & Catalog Governance
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Career Path</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Stats KPI Strip */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Registered Accounts</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{stats.totalUsers}</div>
            <div className="text-[11px] text-slate-500 mt-1">{stats.totalStudents} Active Students</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Assessments Completed</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{stats.totalAssessments}</div>
            <div className="text-[11px] text-indigo-400 mt-1">Multi-factor profiled</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">AI Recommendations Generated</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{stats.totalRecommendationsGenerated}</div>
            <div className="text-[11px] text-emerald-400 mt-1">High-intent matches</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Active Learning Roadmaps</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">{stats.totalRoadmapsActive}</div>
            <div className="text-[11px] text-amber-400 mt-1">5-Phase progress tracking</div>
          </div>
        </div>
      )}

      {/* Catalog Management Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            Curated Career Catalog ({careers.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">Role definitions & benchmark metrics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Career Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Demand</th>
                <th className="py-3 px-4">Median Salary</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {careers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-100">
                    <div>{c.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal font-mono truncate max-w-xs">{c.tagline}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {c.category}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-medium">{c.industryDemand}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {c.salaryRange.median.split(' ')[0]}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingCareer(c); setIsModalOpen(true); }}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit career"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCareer(c.id, c.title)}
                        className="p-1.5 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Delete career"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Audit Trail */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white tracking-tight">
          System Governance Audit Logs
        </h2>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-mono text-indigo-400 font-semibold">{log.action}</span>
                <span className="text-slate-400 mx-2">·</span>
                <span className="text-slate-300">{log.details}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()} · {log.adminEmail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Edit / Create Modal */}
      {isModalOpen && editingCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-base font-bold text-white">
                {editingCareer.id ? 'Edit Career Definition' : 'Add New Career Path'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingCareer(null); }}
                className="p-1.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCareer} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Career Title</label>
                <input
                  type="text"
                  required
                  value={editingCareer.title || ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, title: e.target.value })}
                  placeholder="e.g. Distributed Systems Engineer"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editingCareer.category || ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, category: e.target.value })}
                  placeholder="e.g. Software Engineering"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingCareer.tagline || ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, tagline: e.target.value })}
                  placeholder="Brief compelling one-liner"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={editingCareer.description || ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Core Skills (Comma separated)</label>
                <input
                  type="text"
                  value={editingCareer.coreSkills?.join(', ') || ''}
                  onChange={(e) => setEditingCareer({
                    ...editingCareer,
                    coreSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Median Salary Estimate</label>
                <input
                  type="text"
                  value={editingCareer.salaryRange?.median || ''}
                  onChange={(e) => setEditingCareer({
                    ...editingCareer,
                    salaryRange: {
                      ...(editingCareer.salaryRange || { entry: '$80,000 / yr', experienced: '$170,000+ / yr', source: 'BLS' }),
                      median: e.target.value
                    }
                  })}
                  placeholder="e.g. $140,000 / yr"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
