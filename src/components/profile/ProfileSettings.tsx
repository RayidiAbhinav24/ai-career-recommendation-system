import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { api } from '../../services/api.ts';
import type { StudentProfile, Assessment } from '../../types/index.ts';
import {
  User as UserIcon,
  GraduationCap,
  Lock,
  Download,
  Trash2,
  Check,
  AlertTriangle,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  // Profile Form
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [currentYear, setCurrentYear] = useState('3rd Year');
  const [gpaOrScore, setGpaOrScore] = useState('');
  const [bio, setBio] = useState('');

  // Password Change
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Status
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [profData, assessData] = await Promise.all([
          api.getProfile(),
          api.getAssessments().catch(() => ({ assessments: [] }))
        ]);
        if (profData.profile) {
          setProfile(profData.profile);
          setEducationLevel(profData.profile.educationLevel || 'Undergraduate');
          setDegree(profData.profile.degree || '');
          setSpecialization(profData.profile.specialization || '');
          setCurrentYear(profData.profile.currentYear || '3rd Year');
          setGpaOrScore(profData.profile.gpaOrScore || '');
          setBio(profData.profile.bio || '');
        }
        setAssessments(assessData.assessments || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProfileSuccess(null);
    try {
      const res = await api.updateProfile({
        educationLevel,
        degree,
        specialization,
        currentYear,
        gpaOrScore,
        bio
      });
      setProfile(res.profile);
      setProfileSuccess('Academic profile updated successfully.');
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPasswordSuccess(null);
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      if (user?.email) {
        await api.resetPassword({ email: user.email, code: 'profile_direct', newPassword });
        setPasswordSuccess('Password updated successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => setPasswordSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    }
  };

  const handleDownloadAssessment = () => {
    if (assessments.length === 0) {
      alert('No completed assessments found to export.');
      return;
    }
    const reportData = {
      user: {
        name: user?.name,
        email: user?.email,
        createdAt: user?.createdAt
      },
      academicProfile: profile,
      latestAssessment: assessments[0]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CareerAI_Assessment_Report_${user?.name?.replace(/\s+/g, '_') || 'Student'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Account & Profile Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal details, academic coursework, security credentials, and export reports.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* 1. Academic & Personal Details */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Academic Credentials & Specialization</h2>
          </div>
          {profileSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{profileSuccess}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.name || ''}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email (Account ID)</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              >
                <option value="High School">High School Senior / Graduate</option>
                <option value="Undergraduate">Undergraduate (College / University)</option>
                <option value="Postgraduate">Postgraduate (Master's / Ph.D.)</option>
                <option value="Bootcamp/Self-Taught">Coding Bootcamp / Self-Directed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Degree / Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Specialization / Minor</label>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Machine Learning & Algorithms"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Personal Academic Bio / Career Aspirations</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your learning objectives and ambitions..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
          >
            Save Academic Profile
          </button>
        </form>
      </div>

      {/* 2. Security & Password Change */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Security & Password</h2>
          </div>
          {passwordSuccess && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{passwordSuccess}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 3. Export Data & Preferences */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Data Export & Display Preferences
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-xs font-semibold text-slate-200">Export Assessment & Profile Data</div>
            <div className="text-[11px] text-slate-400">
              Download your complete assessment answers, skill ratings, and AI roadmaps as portable JSON.
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadAssessment}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (.json)</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <div className="text-xs font-semibold text-slate-200">Visual Theme Mode</div>
            <div className="text-[11px] text-slate-400">
              Current active theme is {theme === 'dark' ? 'Deep Slate Dark Mode' : 'Clean Light Mode'}.
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-950 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
