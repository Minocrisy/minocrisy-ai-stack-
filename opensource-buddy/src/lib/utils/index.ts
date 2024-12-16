import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ContributionArea, Project, User, ProjectMatch } from '@/types';

// Utility for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calculate match score between user and project
export function calculateProjectMatch(user: User, project: Project): ProjectMatch {
  const matchedSkills = user.skills.filter(skill => 
    project.topics.includes(skill.toLowerCase()) ||
    project.language.toLowerCase() === skill.toLowerCase()
  );

  // Calculate match score based on skills and interests
  const skillScore = (matchedSkills.length / project.topics.length) * 0.6;
  const interestScore = user.interests.some(interest => 
    project.topics.includes(interest.toLowerCase())
  ) ? 0.4 : 0;

  const matchScore = (skillScore + interestScore) * 100;

  // Suggest contribution areas based on user skills
  const suggestedAreas = project.needsHelp.filter(area => {
    if (area.type === 'documentation' && user.skills.includes('writing')) return true;
    if (area.type === 'testing' && user.skills.includes('testing')) return true;
    if (area.type === 'translation' && user.skills.length > 0) return true;
    return false;
  });

  return {
    project,
    matchScore,
    matchedSkills,
    suggestedAreas,
  };
}

// Generate difficulty badge color
export function getDifficultyColor(difficulty: ContributionArea['difficulty']): string {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  }
}

// Format contribution type for display
export function formatContributionType(type: ContributionArea['type']): string {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Extract technical terms from text
export function extractTechnicalTerms(text: string): string[] {
  // Common technical terms and patterns
  const technicalPatterns = [
    /\b[A-Z][A-Za-z]*(?:Error|Exception)\b/, // Error types
    /\b[A-Z][A-Za-z]+\.[A-Za-z]+\b/, // Namespaced terms
    /\b[A-Z][A-Z0-9_]*\b/, // Constants
    /\b(?:API|REST|HTTP|URL|URI|SQL|JSON|XML|HTML|CSS|JS)\b/, // Common acronyms
    /\b(?:function|class|method|interface|type|enum)\b/i, // Programming concepts
  ];

  const terms = new Set<string>();
  
  technicalPatterns.forEach(pattern => {
    const matches = text.match(new RegExp(pattern, 'g'));
    if (matches) {
      matches.forEach(match => terms.add(match));
    }
  });

  return Array.from(terms);
}

// Generate a summary from longer text
export function generateSummary(text: string, maxLength: number = 150): string {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  let summary = '';
  for (const sentence of sentences) {
    if ((summary + sentence).length <= maxLength) {
      summary += sentence;
    } else {
      break;
    }
  }

  return summary.trim();
}

// Format GitHub repository URL
export function formatRepoUrl(url: string): string {
  // Remove trailing .git if present
  return url.replace(/\.git$/, '');
}

// Generate readable ID for HTML elements
export function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Validate markdown content
export function isValidMarkdown(content: string): boolean {
  // Basic markdown validation
  const invalidPatterns = [
    /^#(?![# ])/m, // Incorrect heading format
    /\[([^\]]+)\]\((?!http)[^\)]+\)/, // Invalid link format
    /`[^`]*$/, // Unclosed code block
  ];

  return !invalidPatterns.some(pattern => pattern.test(content));
}

// Format file size
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}
