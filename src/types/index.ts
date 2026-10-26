export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  emailVerified: boolean;
  avatarUrl?: string;
}

export interface StudentProfile {
  userId: string;
  educationLevel: string; // e.g. "High School", "Undergraduate", "Postgraduate", "Bootcamp/Self-Taught"
  degree: string; // e.g. "B.S. in Computer Science"
  specialization: string; // e.g. "Software Engineering", "Data Analytics"
  currentYear: string; // e.g. "3rd Year", "Final Year", "Recent Graduate"
  academicSubjects: string[];
  gpaOrScore?: string;
  bio?: string;
  updatedAt: string;
}

export interface WorkPreferences {
  workEnvironment: 'remote' | 'hybrid' | 'onsite' | 'flexible';
  workStyle: 'individual' | 'collaborative' | 'balanced';
  taskOrientation: 'practical_hands_on' | 'theoretical_strategic' | 'balanced';
  targetIndustries: string[];
  shortTermGoal: string;
  longTermGoal: string;
  willingnessToCertify: 'high' | 'moderate' | 'low';
}

export interface ScoringWeights {
  interestWeight: number; // default 0.35
  skillWeight: number;    // default 0.35
  academicWeight: number; // default 0.15
  workStyleWeight: number;// default 0.15
}

export interface AssessmentAnswers {
  personalInfo: {
    name: string;
    educationLevel: string;
    degree: string;
    specialization: string;
    currentYear: string;
    academicSubjects: string[];
    gpaOrScore?: string;
  };
  interests: string[];
  skills: Record<string, number>; // skill name -> proficiency 1 to 5
  workPreferences: WorkPreferences;
  weights: ScoringWeights;
}

export interface Assessment {
  id: string;
  userId: string;
  createdAt: string;
  answers: AssessmentAnswers;
  status: 'draft' | 'completed';
}

export interface SkillGap {
  skill: string;
  currentLevel: number; // 1-5
  requiredLevel: number; // 1-5
  importance: 'Critical' | 'Important' | 'Nice to have';
}

export interface BeginnerProject {
  title: string;
  description: string;
  techStack: string[];
}

export interface ScoreBreakdown {
  interestScore: number;
  skillScore: number;
  academicScore: number;
  workStyleScore: number;
}

export interface CareerRecommendation {
  id: string;
  assessmentId: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  category: string;
  matchPercentage: number;
  scoreBreakdown: ScoreBreakdown;
  matchRationale: string;
  existingStrengths: string[];
  skillGaps: SkillGap[];
  recommendedCertifications: string[];
  beginnerProjects: BeginnerProject[];
  educationRequirements: string;
  careerProgression: string[];
  alternativeCareers: string[];
  salaryEstimate: {
    entry: string;
    median: string;
    experienced: string;
    source: string;
  };
  roadmapPhases: RoadmapPhase[];
  createdAt: string;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  responsibilities: string[];
  coreSkills: string[];
  secondarySkills: string[];
  educationPaths: string[];
  industryDemand: 'Very High' | 'High' | 'Steady';
  salaryRange: {
    entry: string;
    median: string;
    experienced: string;
    source: string;
  };
  typicalDay: string;
  learningResources: {
    title: string;
    type: 'Course' | 'Book' | 'Interactive' | 'Documentation';
    url: string;
    platform: string;
    isFree: boolean;
  }[];
  careerProgression: string[];
  relatedCareers: string[];
  recommendedCertifications: string[];
  suitableInterests: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  recommendedResources: {
    name: string;
    type: string;
    url?: string;
  }[];
  projects: string[];
  milestones: RoadmapMilestone[];
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  careerId: string;
  careerTitle: string;
  totalMilestones: number;
  completedMilestones: number;
  phases: RoadmapPhase[];
  updatedAt: string;
}

export interface SavedCareer {
  id: string;
  userId: string;
  careerId: string;
  savedAt: string;
  career?: Career;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalAssessments: number;
  totalRecommendationsGenerated: number;
  totalRoadmapsActive: number;
  popularCareers: { title: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
}
