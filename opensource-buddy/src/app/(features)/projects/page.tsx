"use client";

import { useState } from 'react';
import { ProjectCard } from '@/components/features/project-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project, ContributionArea } from '@/types';

// Mock data for initial development
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'React Documentation',
    description: 'Official documentation for React. Help us make React documentation more accessible and comprehensive for beginners.',
    repository: 'https://github.com/reactjs/reactjs.org',
    topics: ['react', 'documentation', 'javascript', 'web-development'],
    needsHelp: [
      {
        type: 'documentation',
        description: 'Improve beginner tutorials',
        difficulty: 'beginner',
        status: 'open'
      },
      {
        type: 'translation',
        description: 'Translate docs to other languages',
        difficulty: 'intermediate',
        status: 'open'
      }
    ],
    language: 'JavaScript',
    stars: 15234,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'TensorFlow Examples',
    description: 'Collection of TensorFlow examples and tutorials. Help us create better examples and improve documentation.',
    repository: 'https://github.com/tensorflow/examples',
    topics: ['tensorflow', 'machine-learning', 'python', 'tutorials'],
    needsHelp: [
      {
        type: 'documentation',
        description: 'Create new tutorials',
        difficulty: 'intermediate',
        status: 'open'
      },
      {
        type: 'testing',
        description: 'Test examples with latest TF version',
        difficulty: 'beginner',
        status: 'open'
      }
    ],
    language: 'Python',
    stars: 8765,
    lastUpdated: '2024-01-10'
  }
];

const CONTRIBUTION_TYPES: ContributionArea['type'][] = [
  'documentation',
  'testing',
  'translation',
  'bug-report',
  'feature-suggestion'
];

const DIFFICULTY_LEVELS: ContributionArea['difficulty'][] = [
  'beginner',
  'intermediate',
  'advanced'
];

export default function ProjectsPage() {
  const [selectedTypes, setSelectedTypes] = useState<Set<ContributionArea['type']>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<ContributionArea['difficulty']>>(new Set());
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const toggleType = (type: ContributionArea['type']) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
    filterProjects(newTypes, selectedDifficulties);
  };

  const toggleDifficulty = (difficulty: ContributionArea['difficulty']) => {
    const newDifficulties = new Set(selectedDifficulties);
    if (newDifficulties.has(difficulty)) {
      newDifficulties.delete(difficulty);
    } else {
      newDifficulties.add(difficulty);
    }
    setSelectedDifficulties(newDifficulties);
    filterProjects(selectedTypes, newDifficulties);
  };

  const filterProjects = (
    types: Set<ContributionArea['type']>,
    difficulties: Set<ContributionArea['difficulty']>
  ) => {
    let filtered = MOCK_PROJECTS;

    if (types.size > 0) {
      filtered = filtered.filter(project =>
        project.needsHelp.some(area => types.has(area.type))
      );
    }

    if (difficulties.size > 0) {
      filtered = filtered.filter(project =>
        project.needsHelp.some(area => difficulties.has(area.difficulty))
      );
    }

    setProjects(filtered);
  };

  const handleContribute = (project: Project) => {
    // In production, this would navigate to a contribution flow
    console.log('Contributing to:', project.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Open Source Projects
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Find projects that match your skills and interests. Start contributing today!
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
            
            {/* Contribution Types */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contribution Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {CONTRIBUTION_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={selectedTypes.has(type) ? "primary" : "outline"}
                    size="sm"
                    className="capitalize"
                    onClick={() => toggleType(type)}
                  >
                    {type.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Levels */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Difficulty Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <Button
                    key={level}
                    variant={selectedDifficulties.has(level) ? "primary" : "outline"}
                    size="sm"
                    className="capitalize"
                    onClick={() => toggleDifficulty(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onContribute={() => handleContribute(project)}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
