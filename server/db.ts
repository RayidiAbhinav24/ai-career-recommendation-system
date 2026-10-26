import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  User,
  StudentProfile,
  Assessment,
  CareerRecommendation,
  Career,
  LearningRoadmap,
  SavedCareer,
  AdminAuditLog,
  AdminStats
} from '../src/types/index.ts';

interface DatabaseSchema {
  users: (User & { passwordHash: string; passwordSalt: string })[];
  profiles: StudentProfile[];
  assessments: Assessment[];
  recommendations: CareerRecommendation[];
  careers: Career[];
  roadmaps: LearningRoadmap[];
  savedCareers: SavedCareer[];
  auditLogs: AdminAuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'careerai.json');

// Password security helpers using crypto scrypt
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch {
    return false;
  }
}

// Initial Seed Careers Catalog
const SEED_CAREERS: Career[] = [
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    category: 'Artificial Intelligence & Data',
    tagline: 'Design and deploy state-of-the-art machine learning models and intelligent autonomous systems.',
    description: 'AI/ML Engineers research, build, and deploy machine learning models, neural networks, and generative AI systems into production. They bridge the gap between mathematical data science and scalable software engineering.',
    responsibilities: [
      'Architect, train, fine-tune, and evaluate deep learning and LLM architectures',
      'Build end-to-end scalable ML data pipelines and feature stores',
      'Optimize model latency, quantization, and GPU/TPU inference serving',
      'Collaborate with product and data engineering teams to integrate AI capabilities into live web applications'
    ],
    coreSkills: ['Python', 'PyTorch / TensorFlow', 'Machine Learning Algorithms', 'Mathematics & Linear Algebra', 'Data Structures & Algorithms'],
    secondarySkills: ['Docker & Kubernetes', 'MLOps (MLflow, Kubeflow)', 'Cloud Platforms (GCP/AWS)', 'Vector Databases'],
    educationPaths: ['B.S. or M.S. in Computer Science, Data Science, Artificial Intelligence, or Mathematics', 'Specialized AI Engineering Certifications and Research Portfolios'],
    industryDemand: 'Very High',
    salaryRange: {
      entry: '$110,000 / yr',
      median: '$158,000 / yr',
      experienced: '$210,000+ / yr',
      source: 'Tech Compensation Benchmark & US Bureau of Labor Statistics (Computer & Information Research Scientists, 2025/2026)'
    },
    typicalDay: 'Morning begins evaluating yesterday\'s distributed model training loss curves, followed by a sprint review on prompt engineering and inference latency. The afternoon is dedicated to writing PyTorch pipelines, running ablation experiments, and fine-tuning an open-source model.',
    learningResources: [
      { title: 'Deep Learning Specialization by Andrew Ng', type: 'Course', platform: 'Coursera / DeepLearning.AI', url: 'https://www.deeplearning.ai', isFree: false },
      { title: 'Fast.ai Practical Deep Learning for Coders', type: 'Interactive', platform: 'Fast.ai', url: 'https://course.fast.ai', isFree: true },
      { title: 'Hugging Face Transformers Course', type: 'Documentation', platform: 'Hugging Face', url: 'https://huggingface.co/learn', isFree: true },
      { title: 'Mathematics for Machine Learning', type: 'Book', platform: 'Cambridge University Press', url: 'https://mml-book.github.io', isFree: true }
    ],
    careerProgression: [
      'Junior ML Engineer / ML Intern',
      'Machine Learning Engineer',
      'Senior AI/ML Engineer',
      'Staff AI Architect / Lead Scientist',
      'Head of AI / VP of Machine Learning'
    ],
    relatedCareers: ['Data Scientist', 'Research Scientist', 'Cloud AI Architect', 'Data Engineer'],
    recommendedCertifications: ['Google Cloud Professional Machine Learning Engineer', 'AWS Certified Machine Learning Specialty', 'TensorFlow Developer Certificate'],
    suitableInterests: ['Artificial intelligence and data science', 'Programming and technology', 'Research and education', 'Engineering']
  },
  {
    id: 'software-developer',
    title: 'Full Stack Software Developer',
    category: 'Software Engineering',
    tagline: 'Engineer resilient modern web applications, scalable APIs, and intuitive digital experiences.',
    description: 'Full Stack Developers create client-facing user interfaces and reliable server-side systems. They transform product requirements into robust, high-performance web applications using modern programming frameworks and database architectures.',
    responsibilities: [
      'Build responsive, accessible user interfaces using TypeScript, React, and Tailwind CSS',
      'Design clean RESTful and GraphQL APIs with server-side authentication and business logic',
      'Manage database schemas, indexing, migrations, and query performance',
      'Write comprehensive unit, integration, and end-to-end automated tests'
    ],
    coreSkills: ['TypeScript / JavaScript', 'React & Web Frameworks', 'Node.js / Express', 'Database Design (SQL/NoSQL)', 'Git & Version Control'],
    secondarySkills: ['Docker', 'CI/CD Pipelines', 'REST APIs', 'System Design'],
    educationPaths: ['B.S. in Computer Science or Software Engineering', 'Coding Bootcamps with Production Capstone Projects', 'Self-Taught with Verified GitHub Portfolio'],
    industryDemand: 'Very High',
    salaryRange: {
      entry: '$85,000 / yr',
      median: '$128,000 / yr',
      experienced: '$180,000+ / yr',
      source: 'US Bureau of Labor Statistics (Software Developers, Quality Assurance Analysts, and Testers, 2025/2026)'
    },
    typicalDay: 'Collaborating in a standup to discuss user authentication flows, developing a high-priority dashboard feature in React, conducting code reviews on GitHub pull requests, and optimizing SQL query latency for database endpoints.',
    learningResources: [
      { title: 'The Odin Project Full Stack JavaScript', type: 'Interactive', platform: 'The Odin Project', url: 'https://www.theodinproject.com', isFree: true },
      { title: 'Full Stack Open', type: 'Course', platform: 'University of Helsinki', url: 'https://fullstackopen.com', isFree: true },
      { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', type: 'Book', platform: 'Prentice Hall', url: 'https://www.oreilly.com', isFree: false }
    ],
    careerProgression: [
      'Associate / Junior Software Engineer',
      'Mid-Level Software Developer',
      'Senior Software Engineer',
      'Lead Engineer / Engineering Manager',
      'Principal Engineer / Chief Technology Officer'
    ],
    relatedCareers: ['Frontend Engineer', 'Backend Engineer', 'Cloud Solutions Architect', 'DevOps Engineer'],
    recommendedCertifications: ['AWS Certified Developer Associate', 'Meta Front-End & Back-End Developer Professional Certificates'],
    suitableInterests: ['Programming and technology', 'Design and creativity', 'Engineering', 'Problem-solving']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Information Security & Infrastructure',
    tagline: 'Safeguard vital organization networks, cloud infrastructure, and sensitive data against cyber threats.',
    description: 'Cybersecurity Analysts protect computer networks, servers, and sensitive information from security breaches and malicious cyber attacks. They monitor systems for vulnerabilities, conduct penetration testing, and implement defense-in-depth protocols.',
    responsibilities: [
      'Monitor enterprise network traffic and SIEM alerts for anomalies and unauthorized intrusion attempts',
      'Conduct regular vulnerability assessments and ethical penetration tests',
      'Implement security policies, identity access management (IAM), and encryption standards',
      'Lead incident response protocols during active cyber threats or potential breaches'
    ],
    coreSkills: ['Network Security & Protocols', 'Vulnerability Assessment', 'Threat Detection & SIEM', 'Linux Administration', 'Analytical Thinking'],
    secondarySkills: ['Python Scripting', 'Cloud Security (AWS/Azure)', 'Cryptography', 'Compliance & Risk Frameworks (NIST, ISO 27001)'],
    educationPaths: ['B.S. in Cybersecurity, Computer Science, or Information Technology', 'Industry Accredited Security Certifications (CompTIA Security+, CISSP, CEH)'],
    industryDemand: 'Very High',
    salaryRange: {
      entry: '$82,000 / yr',
      median: '$120,000 / yr',
      experienced: '$170,000+ / yr',
      source: 'US Bureau of Labor Statistics (Information Security Analysts, 32% Projected Growth 2024-2034)'
    },
    typicalDay: 'Reviewing overnight SIEM intrusion telemetry, analyzing a flagged phishing payload in a sandbox, configuring firewall access rules, and presenting risk mitigation findings to the executive team.',
    learningResources: [
      { title: 'TryHackMe Pre-Security & SOC Level 1', type: 'Interactive', platform: 'TryHackMe', url: 'https://tryhackme.com', isFree: true },
      { title: 'Google Cybersecurity Professional Certificate', type: 'Course', platform: 'Coursera', url: 'https://www.coursera.org', isFree: false },
      { title: 'The Web Application Hacker\'s Handbook', type: 'Book', platform: 'Wiley', url: 'https://portswigger.net', isFree: false }
    ],
    careerProgression: [
      'SOC Analyst Tier 1',
      'Cybersecurity Analyst Tier 2 / Penetration Tester',
      'Senior Security Engineer',
      'Security Operations Manager / Lead Architect',
      'Chief Information Security Officer (CISO)'
    ],
    relatedCareers: ['Cloud Security Engineer', 'Penetration Tester', 'DevSecOps Specialist', 'Incident Response Lead'],
    recommendedCertifications: ['CompTIA Security+', 'Certified Information Systems Security Professional (CISSP)', 'Certified Ethical Hacker (CEH)'],
    suitableInterests: ['Programming and technology', 'Government and public service', 'Engineering', 'Analytical thinking']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Artificial Intelligence & Data',
    tagline: 'Uncover actionable predictive insights from complex datasets using statistics, algorithms, and AI.',
    description: 'Data Scientists blend statistical modeling, programming, and domain expertise to extract meaning from large datasets. They formulate hypotheses, engineer machine learning pipelines, and guide strategic organizational decisions.',
    responsibilities: [
      'Extract, clean, and analyze petabyte-scale structured and unstructured data',
      'Develop predictive machine learning models for forecasting, segmentation, and anomaly detection',
      'Design A/B test experiments to validate product and operational hypotheses',
      'Present intuitive visualizations and recommendations to stakeholders and executives'
    ],
    coreSkills: ['Python & R', 'Statistical Analysis & Hypothesis Testing', 'Machine Learning', 'SQL & Relational Databases', 'Data Visualization'],
    secondarySkills: ['Pandas / NumPy / Scikit-Learn', 'Big Data (Spark, Snowflake)', 'Tableau / PowerBI', 'Experimentation & A/B Testing'],
    educationPaths: ['B.S., M.S., or Ph.D. in Data Science, Statistics, Mathematics, Economics, or Computer Science'],
    industryDemand: 'High',
    salaryRange: {
      entry: '$95,000 / yr',
      median: '$140,000 / yr',
      experienced: '$195,000+ / yr',
      source: 'US Bureau of Labor Statistics (Data Scientists, 2025/2026)'
    },
    typicalDay: 'Querying user behavioral event streams in Snowflake, writing Python exploratory analysis to identify churn triggers, training a gradient boosting model, and creating visualization dashboards for leadership.',
    learningResources: [
      { title: 'IBM Data Science Professional Certificate', type: 'Course', platform: 'Coursera', url: 'https://www.coursera.org', isFree: false },
      { title: 'Kaggle Learn Micro-Courses', type: 'Interactive', platform: 'Kaggle', url: 'https://www.kaggle.com/learn', isFree: true },
      { title: 'Python for Data Analysis by Wes McKinney', type: 'Book', platform: "O'Reilly", url: 'https://wesmckinney.com/book', isFree: true }
    ],
    careerProgression: [
      'Junior Data Scientist',
      'Data Scientist',
      'Senior Data Scientist',
      'Lead Data Science Manager',
      'VP of Data Science & Analytics'
    ],
    relatedCareers: ['AI/ML Engineer', 'Data Analyst', 'Quantitative Researcher', 'Business Intelligence Lead'],
    recommendedCertifications: ['Microsoft Certified: Azure Data Scientist Associate', 'SAS Certified Advanced Analytics Professional'],
    suitableInterests: ['Artificial intelligence and data science', 'Mathematics', 'Research and education', 'Finance and accounting']
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'Design & Human-Computer Interaction',
    tagline: 'Create intuitive, accessible, and delightful digital user journeys for global products.',
    description: 'UI/UX Designers conduct user research, synthesize usability feedback, and craft elegant design systems, wireframes, and high-fidelity interactive prototypes that balance aesthetic elegance with functional utility.',
    responsibilities: [
      'Conduct qualitative user interviews, usability audits, and competitive benchmarking',
      'Develop information architectures, user flow maps, and interactive wireframes in Figma',
      'Maintain comprehensive design systems with accessible contrast ratios and component tokens',
      'Partner closely with front-end engineers to ensure pixel-perfect implementation'
    ],
    coreSkills: ['User Research & Usability Testing', 'Figma & Design Systems', 'Visual Design & Typography', 'Wireframing & Prototyping', 'Empathy & Communication'],
    secondarySkills: ['Design Tokens', 'HTML/CSS Awareness', 'Micro-interactions', 'Accessibility (WCAG AA)'],
    educationPaths: ['Degree in Human-Computer Interaction (HCI), Graphic Design, Psychology, or Digital Media', 'Design Portfolios demonstrating real product problem solving'],
    industryDemand: 'High',
    salaryRange: {
      entry: '$78,000 / yr',
      median: '$115,000 / yr',
      experienced: '$165,000+ / yr',
      source: 'AIGA Design Salary Report & US Bureau of Labor Statistics (Web and Digital Interface Designers)'
    },
    typicalDay: 'Reviewing video recordings of student onboarding sessions in FullStory, refining Figma mockups for a streamlined checkout flow, updating design system tokens for dark mode, and reviewing engineering staging builds.',
    learningResources: [
      { title: 'Google UX Design Professional Certificate', type: 'Course', platform: 'Coursera', url: 'https://www.coursera.org', isFree: false },
      { title: 'Refactoring UI by Adam Wathan & Steve Schoger', type: 'Book', platform: 'Refactoring UI', url: 'https://www.refactoringui.com', isFree: false },
      { title: 'Nielsen Norman Group UX Research Articles', type: 'Documentation', platform: 'NN/g', url: 'https://www.nngroup.com', isFree: true }
    ],
    careerProgression: [
      'Junior UX Designer',
      'Product Designer',
      'Senior Product Designer',
      'Design Lead / Design Manager',
      'VP of Product Design / Chief Design Officer'
    ],
    relatedCareers: ['Product Manager', 'Frontend Developer', 'UX Researcher', 'Brand Identity Designer'],
    recommendedCertifications: ['Nielsen Norman Group UX Master Certified', 'Google UX Design Certificate'],
    suitableInterests: ['Design and creativity', 'Communication and media', 'Programming and technology', 'Teamwork']
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Solutions Architect',
    category: 'Cloud & Infrastructure',
    tagline: 'Architect highly resilient, secure, and auto-scaling multi-cloud enterprise infrastructure.',
    description: 'Cloud Solutions Architects design and orchestrate cloud infrastructure across platforms such as GCP, AWS, and Azure. They ensure systems are highly available, cost-effective, disaster-resilient, and fortified against security vulnerabilities.',
    responsibilities: [
      'Design cloud topology, VPC networking, load balancers, and container clusters',
      'Author Infrastructure-as-Code (IaC) using Terraform, Pulumi, and CloudFormation',
      'Optimize cloud compute expenditures, autoscaling parameters, and resource quotas',
      'Enforce zero-trust architecture, backup replication, and zero-downtime deployment pipelines'
    ],
    coreSkills: ['Cloud Platforms (GCP / AWS / Azure)', 'Infrastructure as Code (Terraform)', 'Kubernetes & Docker', 'Networking & Security', 'Systems Architecture'],
    secondarySkills: ['Linux Internals', 'CI/CD Automation', 'Serverless Architecture', 'Cost FinOps'],
    educationPaths: ['B.S. in Computer Science, Systems Engineering, or Information Systems', 'Official Cloud Professional Certifications'],
    industryDemand: 'Very High',
    salaryRange: {
      entry: '$100,000 / yr',
      median: '$148,000 / yr',
      experienced: '$200,000+ / yr',
      source: 'Global Knowledge IT Skills and Salary Report & BLS Computer Network Architects'
    },
    typicalDay: 'Reviewing cloud cost dashboards to eliminate unattached persistent disks, writing Terraform scripts for a multi-region Kubernetes deployment, and troubleshooting a VPC peering gateway latency issue.',
    learningResources: [
      { title: 'Google Cloud Certified Professional Cloud Architect Path', type: 'Course', platform: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google', isFree: false },
      { title: 'Learn Terraform by HashiCorp', type: 'Interactive', platform: 'HashiCorp Developer', url: 'https://developer.hashicorp.com/terraform', isFree: true },
      { title: 'Designing Data-Intensive Applications by Martin Kleppmann', type: 'Book', platform: "O'Reilly", url: 'https://dataintensive.net', isFree: false }
    ],
    careerProgression: [
      'Cloud Support Engineer',
      'Cloud Engineer / DevOps Engineer',
      'Senior Cloud Solutions Architect',
      'Principal Enterprise Architect',
      'VP of Infrastructure & Platform Engineering'
    ],
    relatedCareers: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Cybersecurity Architect', 'Systems Engineer'],
    recommendedCertifications: ['Google Cloud Professional Cloud Architect', 'AWS Solutions Architect Professional', 'HashiCorp Certified Terraform Associate'],
    suitableInterests: ['Programming and technology', 'Engineering', 'Leadership', 'Problem-solving']
  },
  {
    id: 'product-manager',
    title: 'Product Manager (Tech & AI)',
    category: 'Product & Business Strategy',
    tagline: 'Define product vision, rally engineering and design teams, and deliver transformative solutions.',
    description: 'Product Managers guide the success of a product from conception through launch and continuous optimization. They align customer needs, business strategy, and technological feasibility to build products customers love.',
    responsibilities: [
      'Formulate product strategy, market positioning, and roadmap prioritization',
      'Synthesize customer feedback, telemetry analytics, and stakeholder requirements into clear PRDs',
      'Lead cross-functional agile development sprints alongside engineers and designers',
      'Define and monitor North Star KPIs, user retention, and business growth metrics'
    ],
    coreSkills: ['Product Strategy & Roadmapping', 'User Empathy & Research', 'Cross-Functional Leadership', 'Data Analysis & Metrics', 'Communication & Storytelling'],
    secondarySkills: ['Agile / Scrum Methodologies', 'SQL & Analytics Tools', 'Market Analysis', 'Tech Stack Understanding'],
    educationPaths: ['B.S. or M.B.A. in Computer Science, Engineering, Business Administration, or Cognitive Science'],
    industryDemand: 'High',
    salaryRange: {
      entry: '$90,000 / yr',
      median: '$135,000 / yr',
      experienced: '$190,000+ / yr',
      source: 'Product School Product Management Report & Glassdoor Industry Insights 2025'
    },
    typicalDay: 'Analyzing conversion funnels from the recent product release, running an agile backlog grooming session with engineers, interviewing prospective users, and presenting Q3 OKR achievements to leadership.',
    learningResources: [
      { title: 'Product Management Fundamentals', type: 'Course', platform: 'Product School', url: 'https://productschool.com', isFree: true },
      { title: 'Inspired: How to Create Tech Products Customers Love by Marty Cagan', type: 'Book', platform: 'Wiley', url: 'https://svpg.com', isFree: false },
      { title: 'Lenny\'s Product Newsletter & Community', type: 'Documentation', platform: 'Substack', url: 'https://www.lennysnewsletter.com', isFree: true }
    ],
    careerProgression: [
      'Associate Product Manager (APM)',
      'Product Manager',
      'Senior Product Manager',
      'Director of Product / Head of Product',
      'Chief Product Officer (CPO)'
    ],
    relatedCareers: ['Technical Program Manager', 'Business Analyst', 'UI/UX Designer', 'Tech Entrepreneur'],
    recommendedCertifications: ['Product School Certified Product Manager (CPM)', 'Pragmatic Institute Certified Product Manager'],
    suitableInterests: ['Business and entrepreneurship', 'Leadership', 'Communication and media', 'Programming and technology']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst & BI Specialist',
    category: 'Artificial Intelligence & Data',
    tagline: 'Transform raw enterprise records into high-impact interactive dashboards and business insights.',
    description: 'Data Analysts inspect, clean, transform, and model data to discover useful information, suggest conclusions, and support business decision-making through intuitive reporting tools and dashboards.',
    responsibilities: [
      'Write complex SQL queries to extract data from data warehouses and transaction databases',
      'Design interactive executive dashboards in Tableau, PowerBI, and Looker',
      'Identify operational bottlenecks and growth opportunities through trend analysis',
      'Collaborate with department heads to formulate measurable business KPIs'
    ],
    coreSkills: ['SQL & Data Modeling', 'Excel Advanced Modeling', 'Tableau / PowerBI / Looker', 'Critical Thinking', 'Business Communication'],
    secondarySkills: ['Python (Pandas)', 'Data Warehousing (BigQuery, Redshift)', 'Statistical Sampling', 'Storytelling with Data'],
    educationPaths: ['B.S. in Business Analytics, Statistics, Economics, Information Systems, or Mathematics'],
    industryDemand: 'High',
    salaryRange: {
      entry: '$68,000 / yr',
      median: '$96,000 / yr',
      experienced: '$135,000+ / yr',
      source: 'US Bureau of Labor Statistics (Operations Research and Data Analysts, 2025/2026)'
    },
    typicalDay: 'Building a real-time revenue forecast model in SQL and BigQuery, updating the weekly executive sales KPI dashboard in Tableau, and running cohort retention calculations for marketing.',
    learningResources: [
      { title: 'Google Data Analytics Professional Certificate', type: 'Course', platform: 'Coursera', url: 'https://www.coursera.org', isFree: false },
      { title: 'Storytelling with Data by Cole Nussbaumer Knaflic', type: 'Book', platform: 'Wiley', url: 'https://www.storytellingwithdata.com', isFree: false },
      { title: 'Mode Analytics SQL Tutorial for Data Analysis', type: 'Interactive', platform: 'Mode', url: 'https://mode.com/sql-tutorial', isFree: true }
    ],
    careerProgression: [
      'Junior Data Analyst',
      'Data Analyst',
      'Senior Business Intelligence Analyst',
      'Analytics Manager',
      'Director of Enterprise Analytics'
    ],
    relatedCareers: ['Data Scientist', 'Financial Analyst', 'Business Analyst', 'Database Administrator'],
    recommendedCertifications: ['Google Data Analytics Certificate', 'Microsoft Certified: Power BI Data Analyst Associate'],
    suitableInterests: ['Artificial intelligence and data science', 'Finance and accounting', 'Analytical thinking', 'Problem-solving']
  },
  {
    id: 'financial-analyst',
    title: 'Financial & FinTech Analyst',
    category: 'Finance & Analytics',
    tagline: 'Model macroeconomic trends, corporate valuations, and modern algorithmic fintech systems.',
    description: 'Financial Analysts assess the performance of stocks, bonds, investments, and algorithmic financial products to guide businesses and individuals in making lucrative capital deployment decisions.',
    responsibilities: [
      'Construct discounted cash flow (DCF) and three-statement financial models',
      'Analyze industry market share, competitor financials, and macro risk factors',
      'Prepare quarterly earnings reports and investment recommendation memos',
      'Utilize financial APIs and Python scripts for portfolio backtesting and risk sensitivity'
    ],
    coreSkills: ['Financial Modeling & Valuation', 'Corporate Accounting', 'Excel & Financial Software', 'Analytical Rigor', 'Macroeconomic Analysis'],
    secondarySkills: ['Python for Finance', 'Bloomberg Terminal / FactSet', 'SQL for FinTech', 'Quantitative Methods'],
    educationPaths: ['B.S. in Finance, Accounting, Economics, or Mathematics; CFA charter track'],
    industryDemand: 'Steady',
    salaryRange: {
      entry: '$75,000 / yr',
      median: '$108,000 / yr',
      experienced: '$160,000+ / yr',
      source: 'US Bureau of Labor Statistics (Financial and Investment Analysts, 2025/2026)'
    },
    typicalDay: 'Updating a company valuation model following an earnings call, scripting a sensitivity matrix on interest rate shifts in Excel/Python, and preparing an investment deck for the capital committee.',
    learningResources: [
      { title: 'Corporate Finance Institute (CFI) FMVA Program', type: 'Course', platform: 'CFI', url: 'https://corporatefinanceinstitute.com', isFree: false },
      { title: 'Aswath Damodaran Corporate Finance & Valuation Course', type: 'Course', platform: 'NYU Stern / YouTube', url: 'https://pages.stern.nyu.edu/~adamodar', isFree: true },
      { title: 'Python for Finance by Yves Hilpisch', type: 'Book', platform: "O'Reilly", url: 'https://www.oreilly.com', isFree: false }
    ],
    careerProgression: [
      'Financial Analyst / Investment Banking Analyst',
      'Senior Financial Analyst / Associate',
      'Finance Manager / Portfolio Manager',
      'Director of Corporate Finance',
      'Chief Financial Officer (CFO)'
    ],
    relatedCareers: ['Business Analyst', 'Quantitative Trader', 'FinTech Product Specialist', 'Data Analyst'],
    recommendedCertifications: ['Chartered Financial Analyst (CFA Level 1)', 'CFI Financial Modeling & Valuation Analyst (FMVA)'],
    suitableInterests: ['Finance and accounting', 'Mathematics', 'Business and entrepreneurship', 'Analytical thinking']
  },
  {
    id: 'entrepreneur',
    title: 'Tech Founder & Entrepreneur',
    category: 'Business & Innovation',
    tagline: 'Transform breakthrough ideas into high-growth ventures, hire talent, and scale products.',
    description: 'Tech Founders identify unmet market opportunities, build minimum viable products (MVPs), assemble mission-driven teams, raise venture capital, and guide organizations through rapid scale.',
    responsibilities: [
      'Identify severe market pain points and discover product-market fit',
      'Prototype early product iterations and acquire first paying enterprise or consumer customers',
      'Recruit, inspire, and manage high-performing engineering and go-to-market teams',
      'Pitch venture capital firms, manage financial runway, and execute growth strategy'
    ],
    coreSkills: ['Vision & Strategic Execution', 'Leadership & Team Building', 'Sales & Pitching', 'Resilience & Grit', 'Product Vision'],
    secondarySkills: ['Financial Runway Management', 'Marketing & Distribution', 'Rapid Prototyping', 'Negotiation'],
    educationPaths: ['Diverse backgrounds in Engineering, Business, Design, or Self-Directed Mastery with proven bias for building'],
    industryDemand: 'High',
    salaryRange: {
      entry: 'Early Stage: Equity & Subsistence',
      median: 'Funded Series A: $120,000 - $160,000 / yr',
      experienced: 'Growth Stage / Exit: Substantial Equity Returns',
      source: 'Kauffman Foundation & Y Combinator Founder Compensation Survey (2025)'
    },
    typicalDay: 'Interviewing 5 prospective users on pain points, reviewing marketing funnel CAC/LTV numbers, conducting a final interview for a founding software engineer, and pitching an angel syndicate.',
    learningResources: [
      { title: 'Y Combinator Startup School', type: 'Course', platform: 'Y Combinator', url: 'https://www.startupschool.org', isFree: true },
      { title: 'The Lean Startup by Eric Ries', type: 'Book', platform: 'Crown Publishing', url: 'https://theleanstartup.com', isFree: false },
      { title: 'Zero to One by Peter Thiel', type: 'Book', platform: 'Crown', url: 'https://www.penguinrandomhouse.com', isFree: false }
    ],
    careerProgression: [
      'Solo Builder / Hackathon Creator',
      'Pre-Seed / Seed Founder',
      'Series A/B Growth CEO',
      'Serial Founder / Board Member',
      'Venture Partner / Angel Investor'
    ],
    relatedCareers: ['Product Manager', 'Growth Strategist', 'Chief Technology Officer', 'Business Strategist'],
    recommendedCertifications: ['Stanford / Y Combinator Innovation Modules', 'Kauffman FastTrac Entrepreneurship Certificate'],
    suitableInterests: ['Business and entrepreneurship', 'Leadership', 'Programming and technology', 'Communication and media']
  }
];

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.db = this.loadDatabase();
    this.seedDefaultData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, initializing fresh store:', err);
      }
    }
    return {
      users: [],
      profiles: [],
      assessments: [],
      recommendations: [],
      careers: SEED_CAREERS,
      roadmaps: [],
      savedCareers: [],
      auditLogs: []
    };
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  private seedDefaultData() {
    let changed = false;

    // Seed careers catalog if empty or missing new ones
    if (!this.db.careers || this.db.careers.length === 0) {
      this.db.careers = SEED_CAREERS;
      changed = true;
    } else {
      // Ensure all seed careers exist
      for (const sc of SEED_CAREERS) {
        if (!this.db.careers.find(c => c.id === sc.id)) {
          this.db.careers.push(sc);
          changed = true;
        }
      }
    }

    // Seed Demo Student Account if not present
    const demoStudentEmail = 'student@careerai.dev';
    let demoStudent = this.db.users.find(u => u.email === demoStudentEmail);
    if (!demoStudent) {
      const studentAuth = hashPassword('Student123!');
      const studentId = 'usr_student_demo_1';
      demoStudent = {
        id: studentId,
        name: 'Sarah Chen',
        email: demoStudentEmail,
        role: 'student',
        createdAt: new Date().toISOString(),
        emailVerified: true,
        avatarUrl: '/src/assets/images/avatar_student_sarah_1793021904967.jpg',
        passwordHash: studentAuth.hash,
        passwordSalt: studentAuth.salt
      };
      this.db.users.push(demoStudent);

      // Seed Student Profile
      this.db.profiles.push({
        userId: studentId,
        educationLevel: 'Undergraduate',
        degree: 'B.S. in Computer Science & Applied Mathematics',
        specialization: 'Artificial Intelligence & Software Engineering',
        currentYear: '3rd Year',
        academicSubjects: ['Algorithms & Data Structures', 'Linear Algebra', 'Database Management', 'Object-Oriented Programming', 'Probability & Statistics'],
        gpaOrScore: '3.88 / 4.0',
        bio: 'Aspiring AI engineer interested in generative models, scalable backend systems, and automated reasoning tools.',
        updatedAt: new Date().toISOString()
      });

      // Seed Demo Assessment
      const assessmentId = 'asm_demo_1';
      const sampleAnswers = {
        personalInfo: {
          name: 'Sarah Chen',
          educationLevel: 'Undergraduate',
          degree: 'B.S. in Computer Science & Applied Mathematics',
          specialization: 'Artificial Intelligence & Software Engineering',
          currentYear: '3rd Year',
          academicSubjects: ['Algorithms', 'Linear Algebra', 'Databases', 'Python'],
          gpaOrScore: '3.88'
        },
        interests: ['Artificial intelligence and data science', 'Programming and technology', 'Research and education'],
        skills: {
          'Programming': 4,
          'Mathematics': 4,
          'Analytical thinking': 5,
          'Problem-solving': 5,
          'Communication': 4,
          'Leadership': 3,
          'Creativity': 4,
          'Teamwork': 4,
          'Research': 4,
          'Design': 3
        },
        workPreferences: {
          workEnvironment: 'hybrid' as const,
          workStyle: 'balanced' as const,
          taskOrientation: 'practical_hands_on' as const,
          targetIndustries: ['Technology & SaaS', 'Artificial Intelligence', 'Scientific Research'],
          shortTermGoal: 'Secure a machine learning or full-stack software engineering internship at a top innovation lab.',
          longTermGoal: 'Lead an applied AI research and engineering team building foundation models for real-world automation.',
          willingnessToCertify: 'high' as const
        },
        weights: {
          interestWeight: 0.35,
          skillWeight: 0.35,
          academicWeight: 0.15,
          workStyleWeight: 0.15
        }
      };

      this.db.assessments.push({
        id: assessmentId,
        userId: studentId,
        createdAt: new Date().toISOString(),
        answers: sampleAnswers,
        status: 'completed'
      });

      // Seed Demo Recommendation
      const recId = 'rec_demo_1';
      this.db.recommendations.push({
        id: recId,
        assessmentId,
        userId: studentId,
        careerId: 'ai-ml-engineer',
        careerTitle: 'AI / Machine Learning Engineer',
        category: 'Artificial Intelligence & Data',
        matchPercentage: 94,
        scoreBreakdown: {
          interestScore: 98,
          skillScore: 92,
          academicScore: 95,
          workStyleScore: 90
        },
        matchRationale: 'Exceptional alignment across computational mathematics, top-tier problem solving (5/5), and strong programming foundation (4/5) with explicit goals toward generative AI systems.',
        existingStrengths: [
          'High proficiency in analytical thinking (5/5) and problem solving (5/5)',
          'Solid mathematical foundation in linear algebra and probability (4/5)',
          'Rigorous computer science curriculum with strong GPA'
        ],
        skillGaps: [
          { skill: 'Distributed Deep Learning Systems', currentLevel: 2, requiredLevel: 4, importance: 'Critical' },
          { skill: 'Production MLOps & Model Serving', currentLevel: 2, requiredLevel: 4, importance: 'Important' },
          { skill: 'Cloud GPU Pipeline Tuning', currentLevel: 3, requiredLevel: 4, importance: 'Nice to have' }
        ],
        recommendedCertifications: [
          'Google Cloud Professional Machine Learning Engineer',
          'DeepLearning.AI Deep Learning Specialization'
        ],
        beginnerProjects: [
          {
            title: 'Multimodal Document Q&A with Vector Embeddings',
            description: 'Build an end-to-end RAG system using PyTorch, vector databases, and Gemini API to query scientific papers.',
            techStack: ['Python', 'FastAPI', 'PyTorch', 'ChromaDB', 'Gemini API']
          },
          {
            title: 'Real-Time Inference Serving with Docker & ONNX Runtime',
            description: 'Quantize an open-source language model to INT8 and deploy as a sub-50ms REST API.',
            techStack: ['Python', 'Docker', 'ONNX Runtime', 'GCP Cloud Run']
          }
        ],
        educationRequirements: 'B.S. or M.S. in Computer Science, Data Science, or Mathematics with coursework in Linear Algebra, Machine Learning, and Algorithms.',
        careerProgression: [
          'Junior AI/ML Engineer',
          'Machine Learning Engineer',
          'Senior AI Systems Engineer',
          'Staff AI Architect'
        ],
        alternativeCareers: ['Data Scientist', 'Full Stack Software Developer', 'Cloud Solutions Architect'],
        salaryEstimate: {
          entry: '$110,000 / yr',
          median: '$158,000 / yr',
          experienced: '$210,000+ / yr',
          source: 'US Bureau of Labor Statistics & Tech Compensation Benchmark 2025/2026'
        },
        roadmapPhases: [
          {
            phaseNumber: 1,
            title: 'Foundational Mathematics & Python Mastery',
            duration: 'Weeks 1–4',
            description: 'Solidify multivariate calculus, matrix decompositions, and advanced Python OOP and vectorized operations.',
            topics: ['Linear Algebra & SVD', 'Vectorized NumPy & Pandas', 'Algorithmic Complexity (Big O)'],
            recommendedResources: [{ name: '3Blue1Brown Essence of Linear Algebra', type: 'Video Series' }],
            projects: ['Implement backpropagation from scratch in pure NumPy'],
            milestones: [
              { id: 'm1', title: 'Complete matrix calculus review', completed: true },
              { id: 'm2', title: 'Code custom neural network layer in Python', completed: true }
            ]
          },
          {
            phaseNumber: 2,
            title: 'Modern Deep Learning & PyTorch Frameworks',
            duration: 'Weeks 5–10',
            description: 'Master convolutional networks, transformers, attention mechanisms, and transfer learning in PyTorch.',
            topics: ['PyTorch Tensors & Autograd', 'Transformer Architecture & Self-Attention', 'Fine-Tuning Hugging Face Models'],
            recommendedResources: [{ name: 'Fast.ai Practical Deep Learning', type: 'Interactive Course' }],
            projects: ['Train an image classifier and fine-tune a transformer model'],
            milestones: [
              { id: 'm3', title: 'Train model on CIFAR-100 with >85% accuracy', completed: true },
              { id: 'm4', title: 'Build attention visualization notebook', completed: false }
            ]
          },
          {
            phaseNumber: 3,
            title: 'LLMs, Vector Search & Retrieval-Augmented Generation (RAG)',
            duration: 'Weeks 11–16',
            description: 'Develop production-ready LLM pipelines with embedding models, semantic chunking, and evaluation metrics.',
            topics: ['Vector Databases & Embeddings', 'RAG Architecture & Re-ranking', 'Prompt Optimization & Tool Calling'],
            recommendedResources: [{ name: 'DeepLearning.AI LangChain & LlamaIndex Courses', type: 'Course' }],
            projects: ['Full-stack RAG assistant with real-time citations and benchmark testing'],
            milestones: [
              { id: 'm5', title: 'Index 1,000 research PDFs in vector database', completed: false },
              { id: 'm6', title: 'Implement automated RAG evaluation pipeline', completed: false }
            ]
          },
          {
            phaseNumber: 4,
            title: 'Production MLOps, Containerization & Inference Serving',
            duration: 'Weeks 17–22',
            description: 'Package models into Docker containers, optimize weights with ONNX/TensorRT, and serve with auto-scaling.',
            topics: ['Model Quantization (FP16/INT8)', 'FastAPI & Triton Inference Server', 'Docker & Kubernetes Pods'],
            recommendedResources: [{ name: 'Full Stack Deep Learning Course', type: 'Curriculum' }],
            projects: ['Deploy low-latency inference endpoint to cloud with monitoring telemetry'],
            milestones: [
              { id: 'm7', title: 'Containerize model with Docker and verify health endpoints', completed: false },
              { id: 'm8', title: 'Benchmark throughput under concurrent simulated traffic', completed: false }
            ]
          },
          {
            phaseNumber: 5,
            title: 'Portfolio Capstone, Open Source & Interview Preparation',
            duration: 'Weeks 23–26',
            description: 'Refine technical GitHub repositories, publish detailed technical blog posts, and practice coding/system design.',
            topics: ['ML System Design Interviews', 'Coding Data Structures in Python', 'Technical Presentation Skills'],
            recommendedResources: [{ name: 'Chip Huyen Machine Learning System Design', type: 'Book' }],
            projects: ['Public production demo application with live documentation and benchmarks'],
            milestones: [
              { id: 'm9', title: 'Publish open-source GitHub repository with clean README', completed: false },
              { id: 'm10', title: 'Complete 20 ML System Design mock interview scenarios', completed: false }
            ]
          }
        ],
        createdAt: new Date().toISOString()
      });

      // Seed Roadmap
      this.db.roadmaps.push({
        id: 'rdm_demo_1',
        userId: studentId,
        careerId: 'ai-ml-engineer',
        careerTitle: 'AI / Machine Learning Engineer',
        totalMilestones: 10,
        completedMilestones: 3,
        phases: this.db.recommendations[0].roadmapPhases,
        updatedAt: new Date().toISOString()
      });

      // Seed Saved Career
      this.db.savedCareers.push({
        id: 'svd_1',
        userId: studentId,
        careerId: 'ai-ml-engineer',
        savedAt: new Date().toISOString(),
        career: SEED_CAREERS[0]
      });

      changed = true;
    }

    // Seed Demo Admin Account if not present
    const demoAdminEmail = 'admin@careerai.dev';
    let demoAdmin = this.db.users.find(u => u.email === demoAdminEmail);
    if (!demoAdmin) {
      const adminAuth = hashPassword('Admin123!');
      demoAdmin = {
        id: 'usr_admin_demo_1',
        name: 'Alex Rivera (Admin)',
        email: demoAdminEmail,
        role: 'admin',
        createdAt: new Date().toISOString(),
        emailVerified: true,
        passwordHash: adminAuth.hash,
        passwordSalt: adminAuth.salt
      };
      this.db.users.push(demoAdmin);

      this.db.auditLogs.push({
        id: 'log_seed_1',
        adminEmail: demoAdminEmail,
        action: 'SYSTEM_BOOTSTRAP',
        target: 'CAREER_CATALOG',
        timestamp: new Date().toISOString(),
        details: 'Initial seed of 10 comprehensive career paths and scoring matrices.'
      });

      changed = true;
    }

    if (changed) {
      this.save();
    }
  }

  // User queries
  public findUserByEmail(email: string) {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    return this.db.users.find(u => u.id === id);
  }

  public createUser(user: User & { passwordHash: string; passwordSalt: string }) {
    this.db.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User & { passwordHash: string; passwordSalt: string }>) {
    const idx = this.db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.db.users[idx] = { ...this.db.users[idx], ...updates };
      this.save();
      return this.db.users[idx];
    }
    return null;
  }

  public deleteUser(id: string) {
    this.db.users = this.db.users.filter(u => u.id !== id);
    this.db.profiles = this.db.profiles.filter(p => p.userId !== id);
    this.db.assessments = this.db.assessments.filter(a => a.userId !== id);
    this.db.recommendations = this.db.recommendations.filter(r => r.userId !== id);
    this.db.roadmaps = this.db.roadmaps.filter(r => r.userId !== id);
    this.db.savedCareers = this.db.savedCareers.filter(s => s.userId !== id);
    this.save();
    return true;
  }

  // Profile
  public getProfileByUserId(userId: string) {
    return this.db.profiles.find(p => p.userId === userId) || null;
  }

  public upsertProfile(profile: StudentProfile) {
    const idx = this.db.profiles.findIndex(p => p.userId === profile.userId);
    if (idx !== -1) {
      this.db.profiles[idx] = { ...this.db.profiles[idx], ...profile, updatedAt: new Date().toISOString() };
    } else {
      this.db.profiles.push({ ...profile, updatedAt: new Date().toISOString() });
    }
    this.save();
    return this.getProfileByUserId(profile.userId);
  }

  // Assessments
  public getAssessmentsByUserId(userId: string) {
    return this.db.assessments.filter(a => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAssessmentById(id: string) {
    return this.db.assessments.find(a => a.id === id) || null;
  }

  public saveAssessment(assessment: Assessment) {
    const idx = this.db.assessments.findIndex(a => a.id === assessment.id);
    if (idx !== -1) {
      this.db.assessments[idx] = assessment;
    } else {
      this.db.assessments.push(assessment);
    }
    this.save();
    return assessment;
  }

  // Recommendations
  public getRecommendationsByUserId(userId: string) {
    return this.db.recommendations.filter(r => r.userId === userId).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  public getRecommendationById(id: string) {
    return this.db.recommendations.find(r => r.id === id) || null;
  }

  public saveRecommendations(recs: CareerRecommendation[]) {
    // Replace old recommendations for this assessment or append
    for (const rec of recs) {
      const idx = this.db.recommendations.findIndex(r => r.id === rec.id);
      if (idx !== -1) {
        this.db.recommendations[idx] = rec;
      } else {
        this.db.recommendations.push(rec);
      }
    }
    this.save();
  }

  // Careers
  public getCareers(): Career[] {
    return this.db.careers;
  }

  public getCareerById(id: string): Career | null {
    return this.db.careers.find(c => c.id === id) || null;
  }

  public createCareer(career: Career): Career {
    this.db.careers.push(career);
    this.save();
    return career;
  }

  public updateCareer(id: string, updates: Partial<Career>): Career | null {
    const idx = this.db.careers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.db.careers[idx] = { ...this.db.careers[idx], ...updates };
      this.save();
      return this.db.careers[idx];
    }
    return null;
  }

  public deleteCareer(id: string): boolean {
    const initialLen = this.db.careers.length;
    this.db.careers = this.db.careers.filter(c => c.id !== id);
    if (this.db.careers.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Saved Careers
  public getSavedCareers(userId: string): SavedCareer[] {
    const list = this.db.savedCareers.filter(s => s.userId === userId);
    return list.map(item => ({
      ...item,
      career: this.getCareerById(item.careerId) || undefined
    }));
  }

  public saveCareerForUser(userId: string, careerId: string): SavedCareer {
    const existing = this.db.savedCareers.find(s => s.userId === userId && s.careerId === careerId);
    if (existing) {
      return { ...existing, career: this.getCareerById(careerId) || undefined };
    }
    const record: SavedCareer = {
      id: `svd_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      careerId,
      savedAt: new Date().toISOString()
    };
    this.db.savedCareers.push(record);
    this.save();
    return { ...record, career: this.getCareerById(careerId) || undefined };
  }

  public removeSavedCareer(userId: string, careerId: string): boolean {
    const initLen = this.db.savedCareers.length;
    this.db.savedCareers = this.db.savedCareers.filter(s => !(s.userId === userId && s.careerId === careerId));
    if (this.db.savedCareers.length !== initLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Roadmaps
  public getRoadmapsByUserId(userId: string): LearningRoadmap[] {
    return this.db.roadmaps.filter(r => r.userId === userId);
  }

  public getRoadmapById(id: string): LearningRoadmap | null {
    return this.db.roadmaps.find(r => r.id === id) || null;
  }

  public saveRoadmap(roadmap: LearningRoadmap): LearningRoadmap {
    const idx = this.db.roadmaps.findIndex(r => r.id === roadmap.id);
    if (idx !== -1) {
      this.db.roadmaps[idx] = roadmap;
    } else {
      this.db.roadmaps.push(roadmap);
    }
    this.save();
    return roadmap;
  }

  public updateMilestoneProgress(roadmapId: string, milestoneId: string, completed: boolean): LearningRoadmap | null {
    const roadmap = this.db.roadmaps.find(r => r.id === roadmapId);
    if (!roadmap) return null;

    let total = 0;
    let finished = 0;

    for (const phase of roadmap.phases) {
      for (const m of phase.milestones) {
        if (m.id === milestoneId) {
          m.completed = completed;
        }
        total++;
        if (m.completed) finished++;
      }
    }

    roadmap.totalMilestones = total;
    roadmap.completedMilestones = finished;
    roadmap.updatedAt = new Date().toISOString();
    this.save();
    return roadmap;
  }

  // Admin Logs & Stats
  public logAdminAction(adminEmail: string, action: string, target: string, details: string) {
    const entry: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminEmail,
      action,
      target,
      timestamp: new Date().toISOString(),
      details
    };
    this.db.auditLogs.unshift(entry);
    // keep last 100 logs
    if (this.db.auditLogs.length > 100) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 100);
    }
    this.save();
    return entry;
  }

  public getAdminAuditLogs(): AdminAuditLog[] {
    return this.db.auditLogs;
  }

  public getAdminStats(): AdminStats {
    const totalUsers = this.db.users.length;
    const totalStudents = this.db.users.filter(u => u.role === 'student').length;
    const totalAssessments = this.db.assessments.length;
    const totalRecommendationsGenerated = this.db.recommendations.length;
    const totalRoadmapsActive = this.db.roadmaps.length;

    // Popular careers
    const careerCountMap: Record<string, number> = {};
    for (const r of this.db.recommendations) {
      careerCountMap[r.careerTitle] = (careerCountMap[r.careerTitle] || 0) + 1;
    }
    const popularCareers = Object.entries(careerCountMap)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Categories distribution
    const categoryMap: Record<string, number> = {};
    for (const c of this.db.careers) {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    }
    const categoryDistribution = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count
    }));

    return {
      totalUsers,
      totalStudents,
      totalAssessments,
      totalRecommendationsGenerated,
      totalRoadmapsActive,
      popularCareers,
      categoryDistribution
    };
  }
}

export const db = new DatabaseManager();
