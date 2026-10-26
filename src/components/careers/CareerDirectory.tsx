import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import type { Career, SavedCareer } from '../../types/index.ts';
import { CareerDetailModal } from './CareerDetailModal.tsx';
import { Search, Compass, Bookmark, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface CareerDirectoryProps {
  onStartAssessment?: () => void;
}

const CATEGORIES = [
  'All',
  'Artificial Intelligence & Data',
  'Software Engineering',
  'Information Security & Infrastructure',
  'Cloud & Infrastructure',
  'Design & Human-Computer Interaction',
  'Product & Business Strategy',
  'Finance & Analytics',
  'Business & Innovation'
];

export const CareerDirectory: React.FC<CareerDirectoryProps> = ({ onStartAssessment }) => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [savedCareers, setSavedCareers] = useState<SavedCareer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCareers = async () => {
    try {
      setLoading(true);
      const res = await api.getCareers({
        search: searchTerm,
        category: selectedCategory === 'All' ? undefined : selectedCategory
      });
      setCareers(res.careers);

      // fetch saved careers if possible
      api.getSavedCareers()
        .then(data => setSavedCareers(data.savedCareers))
        .catch(() => {});
    } catch (err) {
      console.error('Error fetching careers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCareers();
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory]);

  const handleToggleSave = async (careerId: string) => {
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Directory Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Vetted Industry Directory</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Explore Modern Tech & Business Careers
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Detailed responsibilities, core skills, typical workday insights, curated learning resources, and official compensation benchmarks.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, skill (Python, SQL), or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Clean Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Searching career directory...</p>
        </div>
      ) : careers.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <Compass className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-white">No careers found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => {
            const isSaved = savedCareers.some(s => s.careerId === career.id);
            return (
              <div
                key={career.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg shadow-slate-950/40 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[11px] text-slate-400 truncate">
                      {career.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleSave(career.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={isSaved ? 'Saved to favorites' : 'Save career'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight mb-1">
                    {career.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {career.tagline}
                  </p>

                  {/* Core skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {career.coreSkills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                        {s}
                      </span>
                    ))}
                    {career.coreSkills.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center font-mono">
                        +{career.coreSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                    {career.salaryRange.median.split(' ')[0]}
                  </div>

                  <button
                    onClick={() => setSelectedCareer(career)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Career Details Modal */}
      {selectedCareer && (
        <CareerDetailModal
          career={selectedCareer}
          onClose={() => setSelectedCareer(null)}
          isSaved={savedCareers.some(s => s.careerId === selectedCareer.id)}
          onToggleSave={handleToggleSave}
          onStartAssessment={onStartAssessment}
        />
      )}
    </div>
  );
};
