import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import type {
  AssessmentAnswers,
  CareerRecommendation,
  WorkPreferences,
  ScoringWeights
} from '../../types/index.ts';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sliders,
  GraduationCap,
  Heart,
  Wrench,
  Briefcase,
  Layers,
  HelpCircle
} from 'lucide-react';

interface AssessmentWizardProps {
  onComplete: (recommendations: CareerRecommendation[]) => void;
  onCancel?: () => void;
}

const INTEREST_OPTIONS = [
  { id: 'Programming and technology', label: 'Programming & Technology', icon: '💻', desc: 'Writing software, architectures & apps' },
  { id: 'Artificial intelligence and data science', label: 'AI & Data Science', icon: '🧠', desc: 'Machine learning, neural nets & analytics' },
  { id: 'Business and entrepreneurship', label: 'Business & Entrepreneurship', icon: '🚀', desc: 'Startups, venture scaling & product strategy' },
  { id: 'Design and creativity', label: 'Design & Creativity', icon: '🎨', desc: 'UI/UX design, visual systems & typography' },
  { id: 'Healthcare and life sciences', label: 'Healthcare & Life Sciences', icon: '🧬', desc: 'Bioinformatics, biotech & medical technology' },
  { id: 'Finance and accounting', label: 'Finance & FinTech', icon: '📈', desc: 'Valuation models, algorithmic trading & economics' },
  { id: 'Research and education', label: 'Research & Education', icon: '📚', desc: 'Academic inquiry, publications & scientific discovery' },
  { id: 'Government and public service', label: 'Government & Public Service', icon: '🏛️', desc: 'Policy, civic technology & digital governance' },
  { id: 'Engineering', label: 'Engineering & Infrastructure', icon: '⚙️', desc: 'Cloud systems, hardware & DevOps engineering' },
  { id: 'Communication and media', label: 'Communication & Media', icon: '🎙️', desc: 'Technical writing, evangelism & storytelling' }
];

const SKILL_LIST = [
  { key: 'Programming', label: 'Programming & Coding', hint: 'Writing clean code in Python, TypeScript, Java, C++, etc.' },
  { key: 'Communication', label: 'Communication & Articulation', hint: 'Explaining complex concepts clearly to diverse audiences' },
  { key: 'Analytical thinking', label: 'Analytical Thinking', hint: 'Dissecting complex datasets and abstract problem spaces' },
  { key: 'Creativity', label: 'Creativity & Lateral Thinking', hint: 'Generating original solutions and distinctive concepts' },
  { key: 'Leadership', label: 'Leadership & Initiative', hint: 'Guiding teams, delegating tasks, and driving project outcomes' },
  { key: 'Mathematics', label: 'Mathematics & Statistics', hint: 'Linear algebra, calculus, probability & quantitative modeling' },
  { key: 'Problem-solving', label: 'Systemic Problem Solving', hint: 'Debugging, root-cause analysis, and architecture design' },
  { key: 'Teamwork', label: 'Cross-Functional Teamwork', hint: 'Collaborating respectfully with peers, design & business' },
  { key: 'Research', label: 'Research & Empirical Inquiry', hint: 'Gathering literature, formulating hypotheses, and testing' },
  { key: 'Design', label: 'Design & Visual Literacy', hint: 'Information hierarchy, aesthetics, usability, and UI design' }
];

const SKILL_LEVEL_LABELS = ['', '1 · Beginner', '2 · Elementary', '3 · Intermediate', '4 · Advanced', '5 · Expert'];

const COMMON_SUBJECTS = [
  'Data Structures & Algorithms',
  'Linear Algebra',
  'Database Management',
  'Object-Oriented Programming',
  'Probability & Statistics',
  'Computer Networks',
  'Operating Systems',
  'Web Development',
  'Software Architecture',
  'Human-Computer Interaction',
  'Calculus',
  'Financial Accounting',
  'Macroeconomics',
  'Cognitive Psychology'
];

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step 1: Personal & Academic Profile
  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [degree, setDegree] = useState('B.S. in Computer Science');
  const [specialization, setSpecialization] = useState('Software Engineering & AI');
  const [currentYear, setCurrentYear] = useState('3rd Year');
  const [academicSubjects, setAcademicSubjects] = useState<string[]>([
    'Data Structures & Algorithms',
    'Linear Algebra',
    'Database Management'
  ]);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [gpaOrScore, setGpaOrScore] = useState('3.8 / 4.0');

  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Programming and technology',
    'Artificial intelligence and data science'
  ]);

  // Step 3: Skills (1-5)
  const [skills, setSkills] = useState<Record<string, number>>({
    'Programming': 4,
    'Communication': 4,
    'Analytical thinking': 5,
    'Creativity': 4,
    'Leadership': 3,
    'Mathematics': 4,
    'Problem-solving': 5,
    'Teamwork': 4,
    'Research': 4,
    'Design': 3
  });

  // Step 4: Work Preferences & Goals
  const [workPreferences, setWorkPreferences] = useState<WorkPreferences>({
    workEnvironment: 'hybrid',
    workStyle: 'balanced',
    taskOrientation: 'practical_hands_on',
    targetIndustries: ['Technology & SaaS', 'Artificial Intelligence', 'FinTech'],
    shortTermGoal: 'Secure a summer software engineering or AI research internship.',
    longTermGoal: 'Lead an engineering team building high-impact production systems.',
    willingnessToCertify: 'high'
  });

  // Step 5: Scoring Weights
  const [weights, setWeights] = useState<ScoringWeights>({
    interestWeight: 0.35,
    skillWeight: 0.35,
    academicWeight: 0.15,
    workStyleWeight: 0.15
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subject toggling
  const toggleSubject = (subj: string) => {
    if (academicSubjects.includes(subj)) {
      setAcademicSubjects(academicSubjects.filter(s => s !== subj));
    } else {
      setAcademicSubjects([...academicSubjects, subj]);
    }
  };

  const addCustomSubject = () => {
    if (customSubjectInput.trim() && !academicSubjects.includes(customSubjectInput.trim())) {
      setAcademicSubjects([...academicSubjects, customSubjectInput.trim()]);
      setCustomSubjectInput('');
    }
  };

  // Interest toggling
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== id));
      }
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Industry toggling
  const toggleIndustry = (ind: string) => {
    if (workPreferences.targetIndustries.includes(ind)) {
      setWorkPreferences({
        ...workPreferences,
        targetIndustries: workPreferences.targetIndustries.filter(i => i !== ind)
      });
    } else {
      setWorkPreferences({
        ...workPreferences,
        targetIndustries: [...workPreferences.targetIndustries, ind]
      });
    }
  };

  // Skills change
  const handleSkillChange = (key: string, val: number) => {
    setSkills(prev => ({ ...prev, [key]: val }));
  };

  // Submission
  const handleGenerateRecommendations = async () => {
    setError(null);
    setLoading(true);

    const answers: AssessmentAnswers = {
      personalInfo: {
        name: name || user?.name || 'Student',
        educationLevel,
        degree,
        specialization,
        currentYear,
        academicSubjects,
        gpaOrScore
      },
      interests: selectedInterests,
      skills,
      workPreferences,
      weights
    };

    try {
      // 1. Submit and save assessment
      const assessmentRes = await api.submitAssessment(answers);

      // 2. Generate AI recommendations
      const recRes = await api.generateRecommendations({
        answers,
        assessmentId: assessmentRes.assessment.id
      });

      // 3. Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore confetti errors
      }

      onComplete(recRes.recommendations);
    } catch (err: any) {
      console.error('Failed to generate recommendations:', err);
      setError(err.message || 'Error communicating with recommendation server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Wizard Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Titles */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {currentStep === 1 && 'Academic & Background Profile'}
              {currentStep === 2 && 'Passions & Core Interests'}
              {currentStep === 3 && 'Skill Proficiency Assessment'}
              {currentStep === 4 && 'Work Environment & Career Goals'}
              {currentStep === 5 && 'Review & Generate AI Recommendations'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentStep === 1 && 'Help us understand your current educational stage, major, and completed coursework.'}
              {currentStep === 2 && 'Select the domain areas you find intrinsically exciting and engaging.'}
              {currentStep === 3 && 'Rate your current self-assessed ability across 10 vital technical and soft skills.'}
              {currentStep === 4 && 'Define how you prefer to work, your target industries, and future ambitions.'}
              {currentStep === 5 && 'Verify your inputs, adjust algorithmic weights, and generate personalized recommendations.'}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Step Contents */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl min-h-[460px]">
        {/* STEP 1: Academic & Personal */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="High School">High School Senior / Graduate</option>
                  <option value="Undergraduate">Undergraduate (College / University)</option>
                  <option value="Postgraduate">Postgraduate (Master's / Ph.D.)</option>
                  <option value="Bootcamp/Self-Taught">Coding Bootcamp / Self-Directed Learner</option>
                  <option value="Career Transitioner">Working Professional (Career Transition)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree / Major Program</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.S. in Computer Science"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Specialization / Minor (Optional)</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Applied Mathematics, Artificial Intelligence"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Academic Year</label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="1st Year">1st Year / Freshman</option>
                  <option value="2nd Year">2nd Year / Sophomore</option>
                  <option value="3rd Year">3rd Year / Junior</option>
                  <option value="Final Year">Final Year / Senior</option>
                  <option value="Recent Graduate">Recent Graduate (Within 12 months)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">GPA or Academic Standing (Optional)</label>
                <input
                  type="text"
                  value={gpaOrScore}
                  onChange={(e) => setGpaOrScore(e.target.value)}
                  placeholder="e.g. 3.8 / 4.0 or First Class Honors"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Academic Subjects Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Coursework & Subjects Completed (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COMMON_SUBJECTS.map((subj) => {
                  const isSelected = academicSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {subj}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Subject */}
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSubject(); } }}
                  placeholder="Add another subject..."
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={addCustomSubject}
                  className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Interests */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Select 2 or more areas you are genuinely passionate about. We use this to establish high-intent matching.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm shadow-indigo-950/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-100 flex items-center justify-between">
                        <span>{item.label}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Skills (1-5 sliders) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Scale: 1 (Beginner) to 5 (Expert / Mastery)</span>
              <span className="text-indigo-400 font-mono">10 Key Skills</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SKILL_LIST.map((item) => {
                const currentRating = skills[item.key] || 3;
                return (
                  <div key={item.key} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                      <span className="text-xs font-mono font-medium text-indigo-400 tabular-nums">
                        {SKILL_LEVEL_LABELS[currentRating]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3 leading-snug">
                      {item.hint}
                    </p>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={currentRating}
                      onChange={(e) => handleSkillChange(item.key, Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Work Preferences & Goals */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Work Environment */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Preferred Work Environment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'remote', label: '100% Remote', desc: 'Work from anywhere' },
                  { id: 'hybrid', label: 'Hybrid', desc: 'Office 2-3 days/wk' },
                  { id: 'onsite', label: 'Onsite / Lab', desc: 'In-person immersion' },
                  { id: 'flexible', label: 'Flexible', desc: 'Adaptable to project' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setWorkPreferences({ ...workPreferences, workEnvironment: opt.id as any })}
                    className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                      workPreferences.workEnvironment === opt.id
                        ? 'bg-indigo-950/50 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Work Style: Individual vs Collaborative */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Collaboration Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'individual', label: 'Individual Focus' },
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'collaborative', label: 'High Teamwork' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWorkPreferences({ ...workPreferences, workStyle: opt.id as any })}
                      className={`p-2.5 rounded-lg text-center border text-xs font-medium transition-all cursor-pointer ${
                        workPreferences.workStyle === opt.id
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Task Orientation
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'practical_hands_on', label: 'Hands-on Building' },
                    { id: 'balanced', label: 'Balanced' },
                    { id: 'theoretical_strategic', label: 'Strategic / Abstract' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWorkPreferences({ ...workPreferences, taskOrientation: opt.id as any })}
                      className={`p-2.5 rounded-lg text-center border text-xs font-medium transition-all cursor-pointer ${
                        workPreferences.taskOrientation === opt.id
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Industries */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Target Industries of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Technology & SaaS',
                  'Artificial Intelligence',
                  'FinTech & Banking',
                  'Cybersecurity',
                  'Healthcare & Biotech',
                  'Aerospace & Hardware',
                  'Consumer Products',
                  'Scientific Research'
                ].map((ind) => {
                  const isChecked = workPreferences.targetIndustries.includes(ind);
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleIndustry(ind)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short-term and Long-term goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Short-Term Goal (Next 6–12 Months)
                </label>
                <textarea
                  rows={2}
                  value={workPreferences.shortTermGoal}
                  onChange={(e) => setWorkPreferences({ ...workPreferences, shortTermGoal: e.target.value })}
                  placeholder="e.g. Secure a summer software engineering or AI research internship..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Long-Term Career Aspiration (3–5+ Years)
                </label>
                <textarea
                  rows={2}
                  value={workPreferences.longTermGoal}
                  onChange={(e) => setWorkPreferences({ ...workPreferences, longTermGoal: e.target.value })}
                  placeholder="e.g. Lead an engineering team building intelligent production systems..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Review & Weights Customizer */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {/* Summary Review Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-200">1. Academic Profile</div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-300">
                  <div className="font-semibold text-white">{name} · {educationLevel}</div>
                  <div>{degree} {specialization ? `(${specialization})` : ''}</div>
                  <div className="text-slate-400 mt-1 font-mono text-[11px]">
                    Subjects: {academicSubjects.slice(0, 3).join(', ')}{academicSubjects.length > 3 ? ` +${academicSubjects.length - 3} more` : ''}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-200">2. Selected Passions</div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-300">
                  {selectedInterests.slice(0, 3).map((item) => (
                    <div key={item} className="flex items-center gap-1.5 py-0.5">
                      <span className="text-emerald-400 text-xs">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  {selectedInterests.length > 3 && (
                    <span className="text-slate-500 text-[11px]">+{selectedInterests.length - 3} more selected</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-200">3. Top Rated Skills</div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  {Object.entries(skills)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between font-mono text-[11px]">
                        <span>{k}</span>
                        <span className="text-indigo-400 font-bold">{v}/5</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-slate-200">4. Work Preferences</div>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-300 space-y-0.5">
                  <div>Environment: <span className="text-white capitalize">{workPreferences.workEnvironment}</span></div>
                  <div>Collaboration: <span className="text-white capitalize">{workPreferences.workStyle}</span></div>
                  <div className="truncate text-slate-400 text-[11px] mt-1">Goal: {workPreferences.shortTermGoal}</div>
                </div>
              </div>
            </div>

            {/* Configurable Scoring Weights */}
            <div className="p-5 rounded-xl bg-slate-950/90 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Scoring Algorithm Weighting</span>
                </div>
                <span className="text-[11px] text-slate-400">Total = 100%</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Adjust how heavily the recommendation engine weighs each factor when computing career compatibility.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Interests</span>
                    <span className="font-mono text-indigo-400">{Math.round(weights.interestWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.60"
                    step="0.05"
                    value={weights.interestWeight}
                    onChange={(e) => setWeights({ ...weights, interestWeight: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Current Skills</span>
                    <span className="font-mono text-indigo-400">{Math.round(weights.skillWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="0.60"
                    step="0.05"
                    value={weights.skillWeight}
                    onChange={(e) => setWeights({ ...weights, skillWeight: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Academics</span>
                    <span className="font-mono text-indigo-400">{Math.round(weights.academicWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.05"
                    value={weights.academicWeight}
                    onChange={(e) => setWeights({ ...weights, academicWeight: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>Work Style</span>
                    <span className="font-mono text-indigo-400">{Math.round(weights.workStyleWeight * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.05"
                    value={weights.workStyleWeight}
                    onChange={(e) => setWeights({ ...weights, workStyleWeight: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Ethical Disclaimer */}
            <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Methodology Notice:</strong> Recommendations are calculated using objective technical matching, transparent weights, and Gemini AI synthesis. This is not a clinical personality test.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleGenerateRecommendations}
            disabled={loading}
            className="px-8 py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 cursor-pointer"
          >
            {loading ? (
              <span>Synthesizing AI Recommendations...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Career Recommendations</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
