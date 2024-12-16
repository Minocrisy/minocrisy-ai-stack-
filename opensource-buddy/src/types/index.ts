export interface Project {
  id: string;
  name: string;
  description: string;
  repository: string;
  topics: string[];
  needsHelp: ContributionArea[];
  language: string;
  stars: number;
  lastUpdated: string;
}

export interface ContributionArea {
  type: 'documentation' | 'testing' | 'translation' | 'bug-report' | 'feature-suggestion';
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'open' | 'in-progress' | 'completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  contributions: Contribution[];
}

export interface Contribution {
  id: string;
  projectId: string;
  type: ContributionArea['type'];
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'accepted' | 'needs-revision';
  createdAt: string;
  updatedAt: string;
}

export interface BugReport extends Contribution {
  steps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshots?: string[];
  environment: {
    os: string;
    browser?: string;
    version?: string;
  };
}

export interface Documentation extends Contribution {
  content: string;
  section: string;
  aiSuggestions?: string[];
  format: 'markdown' | 'plain-text';
}

export interface AITranslation {
  originalText: string;
  simplifiedText: string;
  technicalTerms: {
    term: string;
    explanation: string;
  }[];
}

export interface ProjectMatch {
  project: Project;
  matchScore: number;
  matchedSkills: string[];
  suggestedAreas: ContributionArea[];
}
