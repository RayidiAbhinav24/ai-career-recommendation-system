import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { Sun, Moon, Sparkles, User as UserIcon, LogOut, ShieldCheck, Compass, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { user, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/85 dark:bg-slate-950/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-left flex items-center gap-2 group cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Career<span className="text-indigo-400">AI</span>
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'home' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'explore' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Explore Careers
          </button>
          {user && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Student Dashboard
            </button>
          )}
          {user && (
            <button
              onClick={() => setActiveTab('assessment')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'assessment' ? 'text-indigo-400 font-semibold' : ''
              }`}
            >
              Career Assessment
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 text-amber-400 ${
                activeTab === 'admin' ? 'font-semibold' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action or user control */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle visual theme"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-850 hover:border-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="truncate max-w-[110px]">{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={logout}
                title="Sign out"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => demoLogin('student')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Demo Student
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-sm shadow-indigo-600/30 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
