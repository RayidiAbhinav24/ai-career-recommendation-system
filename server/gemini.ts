import { GoogleGenAI, Type } from '@google/genai';
import type {
  AssessmentAnswers,
  Career,
  CareerRecommendation,
  RoadmapPhase,
  SkillGap,
  BeginnerProject
} from '../src/types/index.ts';

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Rule-Based Transparent Scoring Algorithm
export function calculateRuleBasedRecommendations(
  answers: AssessmentAnswers,
  availableCareers: Career[],
  assessmentId: string,
  userId: string
): CareerRecommendation[] {
  const { interests, skills, workPreferences, personalInfo, weights } = answers;
  const wInterest = weights?.interestWeight ?? 0.35;
  const wSkill = weights?.skillWeight ?? 0.35;
  const wAcademic = weights?.academicWeight ?? 0.15;
  const wWorkStyle = weights?.workStyleWeight ?? 0.15;

  const scoredCareers = availableCareers.map(career => {
    // 1. Interest Alignment Score (0 - 100)
    let interestMatches = 0;
    for (const interest of interests) {
      if (career.suitableInterests.some(si => si.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(si.toLowerCase()))) {
        interestMatches++;
      }
    }
    const interestScore = interests.length > 0
      ? Math.min(100, Math.round((interestMatches / Math.min(3, interests.length)) * 95) + 5)
      : 50;

    // 2. Skill Alignment Score (0 - 100)
    // Check key student skills against career core skills
    let skillScoreSum = 0;
    let skillWeightsCount = 0;

    const skillKeywordMapping: Record<string, string[]> = {
      'Programming': ['python', 'javascript', 'typescript', 'software', 'programming', 'code', 'react', 'git'],
      'Mathematics': ['mathematics', 'statistics', 'calculus', 'linear algebra', 'numerical'],
      'Analytical thinking': ['analytical', 'analysis', 'critical thinking', 'modeling', 'data'],
      'Problem-solving': ['problem-solving', 'architecture', 'debugging', 'algorithms', 'troubleshooting'],
      'Design': ['design', 'figma', 'ui', 'ux', 'typography', 'visual'],
      'Communication': ['communication', 'storytelling', 'stakeholders', 'empathy'],
      'Leadership': ['leadership', 'team', 'management', 'strategy', 'agile'],
      'Teamwork': ['teamwork', 'cross-functional', 'collaboration'],
      'Research': ['research', 'experimentation', 'hypothesis', 'user research']
    };

    for (const [skillName, rating] of Object.entries(skills)) {
      const keywords = skillKeywordMapping[skillName] || [skillName.toLowerCase()];
      const isRelevant = career.coreSkills.some(cs =>
        keywords.some(kw => cs.toLowerCase().includes(kw))
      ) || career.secondarySkills.some(ss =>
        keywords.some(kw => ss.toLowerCase().includes(kw))
      );

      if (isRelevant) {
        skillScoreSum += (rating / 5) * 100 * 1.5;
        skillWeightsCount += 1.5;
      } else {
        skillScoreSum += (rating / 5) * 60;
        skillWeightsCount += 1.0;
      }
    }

    const rawSkillScore = skillWeightsCount > 0 ? Math.round(skillScoreSum / skillWeightsCount) : 60;
    const skillScore = Math.min(99, Math.max(35, rawSkillScore));

    // 3. Academic Relevance Score (0 - 100)
    let academicScore = 60;
    const degreeText = `${personalInfo.degree} ${personalInfo.specialization} ${personalInfo.academicSubjects.join(' ')}`.toLowerCase();
    if (career.id.includes('ai') || career.id.includes('data')) {
      if (degreeText.includes('computer') || degreeText.includes('data') || degreeText.includes('math') || degreeText.includes('statistic')) {
        academicScore = 95;
      } else if (degreeText.includes('engineer') || degreeText.includes('science')) {
        academicScore = 85;
      }
    } else if (career.id.includes('software') || career.id.includes('cloud') || career.id.includes('cyber')) {
      if (degreeText.includes('computer') || degreeText.includes('software') || degreeText.includes('information')) {
        academicScore = 95;
      } else if (degreeText.includes('engineer') || degreeText.includes('tech')) {
        academicScore = 85;
      }
    } else if (career.id.includes('ui-ux')) {
      if (degreeText.includes('design') || degreeText.includes('hci') || degreeText.includes('media') || degreeText.includes('psych')) {
        academicScore = 95;
      } else {
        academicScore = 75;
      }
    } else if (career.id.includes('financ')) {
      if (degreeText.includes('financ') || degreeText.includes('econom') || degreeText.includes('account') || degreeText.includes('business')) {
        academicScore = 95;
      }
    } else if (career.id.includes('product') || career.id.includes('entrepreneur')) {
      academicScore = 85; // highly versatile
    }

    // 4. Work-Preference Alignment Score (0 - 100)
    let workStyleScore = 80;
    if (career.category.includes('Software') || career.category.includes('Cloud')) {
      if (workPreferences.workEnvironment === 'remote' || workPreferences.workEnvironment === 'hybrid') workStyleScore += 10;
    }
    if (career.id === 'entrepreneur' || career.id === 'product-manager') {
      if (workPreferences.workStyle === 'collaborative') workStyleScore += 15;
    } else if (career.id === 'cybersecurity-analyst' || career.id === 'data-analyst') {
      if (workPreferences.workStyle === 'individual' || workPreferences.workStyle === 'balanced') workStyleScore += 10;
    }
    workStyleScore = Math.min(98, Math.max(50, workStyleScore));

    // Weighted Overall Match Percentage
    const matchPercentage = Math.round(
      interestScore * wInterest +
      skillScore * wSkill +
      academicScore * wAcademic +
      workStyleScore * wWorkStyle
    );

    // Identify strengths and skill gaps
    const existingStrengths: string[] = [];
    const skillGaps: SkillGap[] = [];

    for (const [skillName, rating] of Object.entries(skills)) {
      if (rating >= 4) {
        existingStrengths.push(`High proficiency in ${skillName} (${rating}/5) provides a strong foundation`);
      } else if (rating <= 2) {
        skillGaps.push({
          skill: `${skillName} Fundamentals`,
          currentLevel: rating,
          requiredLevel: 4,
          importance: 'Critical'
        });
      } else if (rating === 3) {
        skillGaps.push({
          skill: `Advanced ${skillName}`,
          currentLevel: 3,
          requiredLevel: 4,
          importance: 'Important'
        });
      }
    }

    if (existingStrengths.length === 0) {
      existingStrengths.push(`Foundational grasp of ${Object.keys(skills).slice(0, 2).join(' and ')}`);
    }

    // Curated beginner projects based on career
    const beginnerProjects: BeginnerProject[] = [
      {
        title: `${career.title} Portfolio Milestone 1`,
        description: `Build and document an introductory practical project focused on core ${career.coreSkills[0]} concepts.`,
        techStack: [career.coreSkills[0] || 'Core Tools', career.coreSkills[1] || 'Frameworks']
      },
      {
        title: `Comprehensive Full-Lifecycle Capstone`,
        description: `Develop a production-grade application or analysis addressing a realistic enterprise problem scenario.`,
        techStack: career.coreSkills.slice(0, 3)
      }
    ];

    // Tailored 5-Phase Learning Roadmap
    const roadmapPhases: RoadmapPhase[] = [
      {
        phaseNumber: 1,
        title: 'Core Fundamentals & Essential Tooling',
        duration: 'Month 1',
        description: `Establish a rock-solid foundation in ${career.coreSkills[0]} and foundational methodology.`,
        topics: [career.coreSkills[0], 'Development Environment Setup', 'Basic Paradigms and Syntax'],
        recommendedResources: career.learningResources.slice(0, 1).map(r => ({ name: r.title, type: r.type, url: r.url })),
        projects: ['Build a hello-world end-to-end prototype', 'Review key terminology and best practices'],
        milestones: [
          { id: `m_${career.id}_1`, title: `Complete introductory ${career.coreSkills[0]} module`, completed: false },
          { id: `m_${career.id}_2`, title: 'Publish initial setup to version control', completed: false }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Intermediate Concepts & Applied Techniques',
        duration: 'Month 2',
        description: `Deepen your technical grasp with ${career.coreSkills[1] || 'advanced tooling'} and standard patterns.`,
        topics: [career.coreSkills[1] || 'Applied Frameworks', 'Data Handling', 'Troubleshooting and Debugging'],
        recommendedResources: career.learningResources.slice(1, 2).map(r => ({ name: r.title, type: r.type, url: r.url })),
        projects: ['Develop an interactive multi-feature application or pipeline'],
        milestones: [
          { id: `m_${career.id}_3`, title: 'Implement full CRUD or model training flow', completed: false },
          { id: `m_${career.id}_4`, title: 'Write tests and document system architecture', completed: false }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Specialized Domain Mastery',
        duration: 'Month 3',
        description: `Learn industry-standard frameworks: ${career.secondarySkills.slice(0, 2).join(', ')}.`,
        topics: career.secondarySkills.slice(0, 3),
        recommendedResources: career.learningResources.slice(2, 3).map(r => ({ name: r.title, type: r.type, url: r.url })),
        projects: ['Integrate third-party APIs and cloud or database services'],
        milestones: [
          { id: `m_${career.id}_5`, title: 'Achieve production deployment on cloud environment', completed: false },
          { id: `m_${career.id}_6`, title: 'Optimize performance and measure key latency/accuracy metrics', completed: false }
        ]
      },
      {
        phaseNumber: 4,
        title: 'Portfolio Development & Capstone Building',
        duration: 'Month 4',
        description: 'Design and release a distinctive capstone project solving a tangible real-world challenge.',
        topics: ['System Design', 'Clean Documentation & READMEs', 'Code Quality Standards'],
        recommendedResources: [{ name: `${career.title} Industry Case Studies`, type: 'Documentation' }],
        projects: ['High-impact portfolio showcase project with live demo and source code'],
        milestones: [
          { id: `m_${career.id}_7`, title: 'Complete comprehensive capstone with README & demo video', completed: false },
          { id: `m_${career.id}_8`, title: 'Obtain peer or mentor code review', completed: false }
        ]
      },
      {
        phaseNumber: 5,
        title: 'Certifications, Networking & Career Launch',
        duration: 'Month 5',
        description: `Target high-value credentials (${career.recommendedCertifications[0] || 'Industry Accreditation'}) and interview readiness.`,
        topics: ['Technical Interview Prep', 'Resume & LinkedIn Optimization', 'Networking with Practitioners'],
        recommendedResources: [{ name: career.recommendedCertifications[0] || 'Certification Study Guide', type: 'Course' }],
        projects: ['Technical interview question drills and portfolio presentations'],
        milestones: [
          { id: `m_${career.id}_9`, title: `Prepare for ${career.recommendedCertifications[0] || 'Certification'} exam`, completed: false },
          { id: `m_${career.id}_10`, title: 'Complete 10 mock technical and behavioral interviews', completed: false }
        ]
      }
    ];

    const matchRationale = `Strong ${matchPercentage}% compatibility derived from your ratings in ${Object.keys(skills).slice(0, 2).join(' and ')}, combined with your background in ${personalInfo.educationLevel} study and interest in ${interests[0] || 'modern tech'}.`;

    return {
      id: `rec_${Date.now()}_${career.id}`,
      assessmentId,
      userId,
      careerId: career.id,
      careerTitle: career.title,
      category: career.category,
      matchPercentage,
      scoreBreakdown: {
        interestScore,
        skillScore,
        academicScore,
        workStyleScore
      },
      matchRationale,
      existingStrengths: existingStrengths.slice(0, 3),
      skillGaps: skillGaps.slice(0, 3),
      recommendedCertifications: career.recommendedCertifications,
      beginnerProjects,
      educationRequirements: career.educationPaths.join('; '),
      careerProgression: career.careerProgression,
      alternativeCareers: career.relatedCareers,
      salaryEstimate: career.salaryRange,
      roadmapPhases,
      createdAt: new Date().toISOString()
    };
  });

  // Sort descending by match percentage and return top 4
  return scoredCareers.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 4);
}

// Generate recommendations using Gemini API when available with structured schema, falling back to rule-based engine
export async function generateRecommendationsWithAI(
  answers: AssessmentAnswers,
  availableCareers: Career[],
  assessmentId: string,
  userId: string
): Promise<CareerRecommendation[]> {
  // Always compute the baseline rule-based recommendations first
  const ruleBasedRecs = calculateRuleBasedRecommendations(answers, availableCareers, assessmentId, userId);

  if (!ai || !process.env.GEMINI_API_KEY) {
    console.log('Gemini API key not configured, using transparent rule-based recommendation engine.');
    return ruleBasedRecs;
  }

  try {
    const prompt = `
You are a senior career counselor and AI talent strategist.
Analyze the following student profile and career assessment answers:

STUDENT PROFILE:
- Name: ${answers.personalInfo.name}
- Education Level: ${answers.personalInfo.educationLevel}
- Degree / Major: ${answers.personalInfo.degree}
- Specialization: ${answers.personalInfo.specialization}
- Current Year: ${answers.personalInfo.currentYear}
- Academic Subjects: ${answers.personalInfo.academicSubjects.join(', ')}
- Academic GPA/Score: ${answers.personalInfo.gpaOrScore || 'Not specified'}

STUDENT INTERESTS:
${answers.interests.map(i => `- ${i}`).join('\n')}

SELF-REPORTED SKILLS (Proficiency 1-5):
${Object.entries(answers.skills).map(([k, v]) => `- ${k}: ${v}/5`).join('\n')}

WORK PREFERENCES & GOALS:
- Environment: ${answers.workPreferences.workEnvironment}
- Work Style: ${answers.workPreferences.workStyle}
- Task Orientation: ${answers.workPreferences.taskOrientation}
- Target Industries: ${answers.workPreferences.targetIndustries.join(', ')}
- Short-term Goal: ${answers.workPreferences.shortTermGoal}
- Long-term Goal: ${answers.workPreferences.longTermGoal}
- Willingness to pursue certifications: ${answers.workPreferences.willingnessToCertify}

AVAILABLE CAREER PATHS:
${availableCareers.map(c => `- ID: "${c.id}", Title: "${c.title}", Category: "${c.category}"`).join('\n')}

INSTRUCTIONS:
1. Select the top 3-4 best career matches from the available career list.
2. For each recommendation, provide:
   - careerId (must match one of the IDs provided)
   - matchPercentage (number between 60 and 98)
   - scoreBreakdown: interestScore, skillScore, academicScore, workStyleScore (each 0-100)
   - matchRationale (2-3 sentences explaining why this matches their specific interests, skills, and goals)
   - existingStrengths (3 bullet points citing their specific rated strengths and background)
   - skillGaps (2-3 skills they need to improve, with currentLevel 1-5, requiredLevel 1-5, importance: 'Critical'|'Important'|'Nice to have')
   - beginnerProjects (2 practical projects with title, description, techStack)
   - roadmapPhases (5 sequential phases, each with phaseNumber 1-5, title, duration, description, topics, recommendedResources, projects, milestones with id and title)

Return strictly valid JSON adhering to the specified schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite, empathetic, and pragmatic AI career counselor. Never invent false guarantees or ungrounded claims. Give personalized, actionable advice.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              careerId: { type: Type.STRING },
              matchPercentage: { type: Type.INTEGER },
              scoreBreakdown: {
                type: Type.OBJECT,
                properties: {
                  interestScore: { type: Type.INTEGER },
                  skillScore: { type: Type.INTEGER },
                  academicScore: { type: Type.INTEGER },
                  workStyleScore: { type: Type.INTEGER }
                },
                required: ['interestScore', 'skillScore', 'academicScore', 'workStyleScore']
              },
              matchRationale: { type: Type.STRING },
              existingStrengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              skillGaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    currentLevel: { type: Type.INTEGER },
                    requiredLevel: { type: Type.INTEGER },
                    importance: { type: Type.STRING }
                  },
                  required: ['skill', 'currentLevel', 'requiredLevel', 'importance']
                }
              },
              beginnerProjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    techStack: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ['title', 'description', 'techStack']
                }
              },
              roadmapPhases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    description: { type: Type.STRING },
                    topics: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    recommendedResources: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          type: { type: Type.STRING }
                        },
                        required: ['name', 'type']
                      }
                    },
                    projects: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    milestones: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING }
                        },
                        required: ['id', 'title']
                      }
                    }
                  },
                  required: ['phaseNumber', 'title', 'duration', 'description', 'topics', 'projects', 'milestones']
                }
              }
            },
            required: [
              'careerId',
              'matchPercentage',
              'scoreBreakdown',
              'matchRationale',
              'existingStrengths',
              'skillGaps',
              'beginnerProjects',
              'roadmapPhases'
            ]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      const combined: CareerRecommendation[] = parsed.map((item, idx) => {
        const career = availableCareers.find(c => c.id === item.careerId) || availableCareers[idx % availableCareers.length];
        return {
          id: `rec_ai_${Date.now()}_${career.id}`,
          assessmentId,
          userId,
          careerId: career.id,
          careerTitle: career.title,
          category: career.category,
          matchPercentage: Math.min(99, Math.max(50, item.matchPercentage || 85)),
          scoreBreakdown: item.scoreBreakdown,
          matchRationale: item.matchRationale,
          existingStrengths: item.existingStrengths,
          skillGaps: item.skillGaps as SkillGap[],
          recommendedCertifications: career.recommendedCertifications,
          beginnerProjects: item.beginnerProjects as BeginnerProject[],
          educationRequirements: career.educationPaths.join('; '),
          careerProgression: career.careerProgression,
          alternativeCareers: career.relatedCareers,
          salaryEstimate: career.salaryRange,
          roadmapPhases: (item.roadmapPhases || []).map((p: any) => ({
            ...p,
            recommendedResources: p.recommendedResources || [],
            milestones: (p.milestones || []).map((m: any) => ({
              id: m.id || `m_${Math.random().toString(36).substring(2, 6)}`,
              title: m.title,
              completed: false
            }))
          })),
          createdAt: new Date().toISOString()
        };
      });

      return combined.sort((a, b) => b.matchPercentage - a.matchPercentage);
    }
  } catch (error) {
    console.error('Gemini API call failed or timed out, returning calculated rule-based recommendations:', error);
  }

  return ruleBasedRecs;
}
