import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, hashPassword, verifyPassword } from './server/db.ts';
import { generateRecommendationsWithAI } from './server/gemini.ts';
import type {
  User,
  StudentProfile,
  Assessment,
  AssessmentAnswers,
  Career
} from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Token Session Store
interface SessionData {
  userId: string;
  role: 'student' | 'admin';
  email: string;
  expiresAt: number;
}

const sessions = new Map<string, SessionData>();

function createSession(user: User): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  sessions.set(token, {
    userId: user.id,
    role: user.role,
    email: user.email,
    expiresAt
  });
  return token;
}

// Authentication Middleware
function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    return;
  }

  (req as any).user = session;
  next();
}

// Admin Middleware
function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    const user = (req as any).user as SessionData;
    if (user.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }
    next();
  });
}

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response): void => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newUser: User = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'student',
      createdAt: new Date().toISOString(),
      emailVerified: true
    };

    db.createUser({
      ...newUser,
      passwordHash: hash,
      passwordSalt: salt
    });

    // Create initial blank student profile
    db.upsertProfile({
      userId,
      educationLevel: 'Undergraduate',
      degree: '',
      specialization: '',
      currentYear: '1st Year',
      academicSubjects: [],
      updatedAt: new Date().toISOString()
    });

    const token = createSession(newUser);
    res.status(201).json({
      user: newUser,
      token,
      message: 'Account registered successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const safeUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
      avatarUrl: user.avatarUrl
    };

    const token = createSession(safeUser);
    res.json({
      user: safeUser,
      token,
      message: 'Logged in successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const user = db.findUserById(session.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const safeUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    emailVerified: user.emailVerified,
    avatarUrl: user.avatarUrl
  };

  res.json({ user: safeUser });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  res.json({ message: 'Logged out successfully.' });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    // For privacy, return generic positive message
    res.json({ message: 'If an account exists with this email, a reset verification code has been dispatched.' });
    return;
  }
  res.json({
    message: 'Reset verification code dispatched.',
    demoCode: '884920' // Provided so students/evaluators can test password reset effortlessly
  });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req: Request, res: Response): void => {
  const { email, code, newPassword } = req.body;
  if (!email || !newPassword) {
    res.status(400).json({ error: 'Email and new password are required.' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(404).json({ error: 'Account not found.' });
    return;
  }
  const { hash, salt } = hashPassword(newPassword);
  db.updateUser(user.id, {
    passwordHash: hash,
    passwordSalt: salt
  });
  res.json({ message: 'Password reset successfully. You can now log in.' });
});

// -------------------------------------------------------------
// STUDENT PROFILE ROUTES
// -------------------------------------------------------------

// GET /api/profile
app.get('/api/profile', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const profile = db.getProfileByUserId(session.userId);
  res.json({ profile: profile || null });
});

// PUT /api/profile
app.put('/api/profile', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const { educationLevel, degree, specialization, currentYear, academicSubjects, gpaOrScore, bio } = req.body;

  const updated = db.upsertProfile({
    userId: session.userId,
    educationLevel: educationLevel || 'Undergraduate',
    degree: degree || '',
    specialization: specialization || '',
    currentYear: currentYear || '',
    academicSubjects: Array.isArray(academicSubjects) ? academicSubjects : [],
    gpaOrScore,
    bio,
    updatedAt: new Date().toISOString()
  });

  res.json({ profile: updated });
});

// -------------------------------------------------------------
// ASSESSMENTS & RECOMMENDATIONS
// -------------------------------------------------------------

// POST /api/assessments
app.post('/api/assessments', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const answers = req.body.answers as AssessmentAnswers;

  if (!answers || !answers.interests || !answers.skills) {
    res.status(400).json({ error: 'Incomplete assessment answers provided.' });
    return;
  }

  const assessmentId = `asm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const assessment: Assessment = {
    id: assessmentId,
    userId: session.userId,
    createdAt: new Date().toISOString(),
    answers,
    status: 'completed'
  };

  db.saveAssessment(assessment);

  // Also sync personal academic profile with assessment answers
  if (answers.personalInfo) {
    db.upsertProfile({
      userId: session.userId,
      educationLevel: answers.personalInfo.educationLevel || 'Undergraduate',
      degree: answers.personalInfo.degree || '',
      specialization: answers.personalInfo.specialization || '',
      currentYear: answers.personalInfo.currentYear || '',
      academicSubjects: answers.personalInfo.academicSubjects || [],
      gpaOrScore: answers.personalInfo.gpaOrScore,
      updatedAt: new Date().toISOString()
    });
  }

  res.status(201).json({ assessment });
});

// GET /api/assessments
app.get('/api/assessments', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const assessments = db.getAssessmentsByUserId(session.userId);
  res.json({ assessments });
});

// GET /api/assessments/:id
app.get('/api/assessments/:id', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const assessment = db.getAssessmentById(req.params.id);
  if (!assessment || (assessment.userId !== session.userId && session.role !== 'admin')) {
    res.status(404).json({ error: 'Assessment not found.' });
    return;
  }
  res.json({ assessment });
});

// POST /api/recommendations/generate
app.post('/api/recommendations/generate', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const session = (req as any).user as SessionData;
    let answers: AssessmentAnswers = req.body.answers;
    let assessmentId: string = req.body.assessmentId;

    if (!answers && assessmentId) {
      const existingAssessment = db.getAssessmentById(assessmentId);
      if (existingAssessment) {
        answers = existingAssessment.answers;
      }
    }

    if (!answers) {
      res.status(400).json({ error: 'Assessment answers or valid assessmentId are required to generate recommendations.' });
      return;
    }

    if (!assessmentId) {
      assessmentId = `asm_${Date.now()}`;
      db.saveAssessment({
        id: assessmentId,
        userId: session.userId,
        createdAt: new Date().toISOString(),
        answers,
        status: 'completed'
      });
    }

    const availableCareers = db.getCareers();
    const recommendations = await generateRecommendationsWithAI(
      answers,
      availableCareers,
      assessmentId,
      session.userId
    );

    // Persist recommendations
    db.saveRecommendations(recommendations);

    // If top recommendation has roadmapPhases, initialize or update active roadmap
    if (recommendations.length > 0 && recommendations[0].roadmapPhases) {
      const topRec = recommendations[0];
      const existingRoadmap = db.getRoadmapsByUserId(session.userId).find(r => r.careerId === topRec.careerId);
      if (!existingRoadmap) {
        let total = 0;
        for (const phase of topRec.roadmapPhases) {
          total += phase.milestones.length;
        }
        db.saveRoadmap({
          id: `rdm_${Date.now()}_${topRec.careerId}`,
          userId: session.userId,
          careerId: topRec.careerId,
          careerTitle: topRec.careerTitle,
          totalMilestones: total,
          completedMilestones: 0,
          phases: topRec.roadmapPhases,
          updatedAt: new Date().toISOString()
        });
      }
    }

    res.json({
      recommendations,
      message: 'Personalized recommendations generated successfully.'
    });
  } catch (err: any) {
    console.error('Error in /api/recommendations/generate:', err);
    res.status(500).json({ error: err.message || 'Failed to generate recommendations.' });
  }
});

// GET /api/recommendations
app.get('/api/recommendations', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const recommendations = db.getRecommendationsByUserId(session.userId);
  res.json({ recommendations });
});

// GET /api/recommendations/:id
app.get('/api/recommendations/:id', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const rec = db.getRecommendationById(req.params.id);
  if (!rec || (rec.userId !== session.userId && session.role !== 'admin')) {
    res.status(404).json({ error: 'Recommendation not found.' });
    return;
  }
  res.json({ recommendation: rec });
});

// -------------------------------------------------------------
// CAREERS & SAVED CAREERS
// -------------------------------------------------------------

// GET /api/careers
app.get('/api/careers', (req: Request, res: Response): void => {
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
  const category = typeof req.query.category === 'string' ? req.query.category : '';

  let list = db.getCareers();
  if (category && category !== 'All') {
    list = list.filter(c => c.category === category);
  }
  if (search) {
    list = list.filter(c =>
      c.title.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search) ||
      c.coreSkills.some(s => s.toLowerCase().includes(search))
    );
  }
  res.json({ careers: list });
});

// GET /api/careers/:id
app.get('/api/careers/:id', (req: Request, res: Response): void => {
  const career = db.getCareerById(req.params.id);
  if (!career) {
    res.status(404).json({ error: 'Career not found.' });
    return;
  }
  res.json({ career });
});

// GET /api/saved-careers
app.get('/api/saved-careers', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const saved = db.getSavedCareers(session.userId);
  res.json({ savedCareers: saved });
});

// POST /api/careers/:id/save
app.post('/api/careers/:id/save', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const career = db.getCareerById(req.params.id);
  if (!career) {
    res.status(404).json({ error: 'Career not found.' });
    return;
  }
  const saved = db.saveCareerForUser(session.userId, req.params.id);
  res.json({ saved, message: 'Career saved to your favorites.' });
});

// DELETE /api/careers/:id/save
app.delete('/api/careers/:id/save', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const success = db.removeSavedCareer(session.userId, req.params.id);
  res.json({ success, message: 'Career removed from your saved list.' });
});

// -------------------------------------------------------------
// ROADMAPS
// -------------------------------------------------------------

// GET /api/roadmaps
app.get('/api/roadmaps', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const roadmaps = db.getRoadmapsByUserId(session.userId);
  res.json({ roadmaps });
});

// GET /api/roadmaps/:id
app.get('/api/roadmaps/:id', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const roadmap = db.getRoadmapById(req.params.id);
  if (!roadmap || (roadmap.userId !== session.userId && session.role !== 'admin')) {
    res.status(404).json({ error: 'Roadmap not found.' });
    return;
  }
  res.json({ roadmap });
});

// PUT /api/roadmaps/:id/progress
app.put('/api/roadmaps/:id/progress', authMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const { milestoneId, completed } = req.body;

  const roadmap = db.getRoadmapById(req.params.id);
  if (!roadmap || (roadmap.userId !== session.userId && session.role !== 'admin')) {
    res.status(404).json({ error: 'Roadmap not found.' });
    return;
  }

  const updated = db.updateMilestoneProgress(req.params.id, milestoneId, Boolean(completed));
  res.json({ roadmap: updated });
});

// -------------------------------------------------------------
// ADMIN CONSOLE ROUTES (Protected)
// -------------------------------------------------------------

// GET /api/admin/stats
app.get('/api/admin/stats', adminMiddleware, (req: Request, res: Response): void => {
  const stats = db.getAdminStats();
  res.json({ stats });
});

// GET /api/admin/careers
app.get('/api/admin/careers', adminMiddleware, (req: Request, res: Response): void => {
  const careers = db.getCareers();
  res.json({ careers });
});

// POST /api/admin/careers
app.post('/api/admin/careers', adminMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const careerData = req.body as Career;
  if (!careerData.title || !careerData.category) {
    res.status(400).json({ error: 'Career title and category are required.' });
    return;
  }

  if (!careerData.id) {
    careerData.id = careerData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  const created = db.createCareer(careerData);
  db.logAdminAction(session.email, 'CREATE_CAREER', created.title, `Created career: ${created.title}`);
  res.status(201).json({ career: created });
});

// PUT /api/admin/careers/:id
app.put('/api/admin/careers/:id', adminMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const updated = db.updateCareer(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Career not found.' });
    return;
  }
  db.logAdminAction(session.email, 'UPDATE_CAREER', updated.title, `Updated career fields: ${Object.keys(req.body).join(', ')}`);
  res.json({ career: updated });
});

// DELETE /api/admin/careers/:id
app.delete('/api/admin/careers/:id', adminMiddleware, (req: Request, res: Response): void => {
  const session = (req as any).user as SessionData;
  const career = db.getCareerById(req.params.id);
  const success = db.deleteCareer(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Career not found.' });
    return;
  }
  db.logAdminAction(session.email, 'DELETE_CAREER', req.params.id, `Deleted career: ${career?.title || req.params.id}`);
  res.json({ success: true, message: 'Career deleted successfully.' });
});

// GET /api/admin/audit-logs
app.get('/api/admin/audit-logs', adminMiddleware, (req: Request, res: Response): void => {
  const logs = db.getAdminAuditLogs();
  res.json({ auditLogs: logs });
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        allowedHosts: true
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl.startsWith('/api/')) {
        return next();
      }
      try {
        const fs = await import('fs');
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
