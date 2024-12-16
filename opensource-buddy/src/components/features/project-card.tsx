"use client";

import { Project, ContributionArea } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, useCardKeyboardInteraction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getDifficultyColor, formatContributionType } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onContribute?: () => void;
}

export function ProjectCard({ project, onContribute }: ProjectCardProps) {
  const { handleKeyDown } = useCardKeyboardInteraction(onContribute);

  return (
    <Card
      variant="bordered"
      className="hover:shadow-md transition-shadow"
      interactive
      onKeyDown={handleKeyDown}
      aria-labelledby={`project-title-${project.id}`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle id={`project-title-${project.id}`} className="text-xl hover:text-indigo-600 transition-colors">
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.name} repository`}
              >
                {project.name}
              </a>
            </CardTitle>
            <CardDescription className="mt-1">
              Last updated: {formatDate(project.lastUpdated)}
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            size="sm"
            className="flex items-center gap-1"
            aria-label={`${project.stars} stars`}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 .75a.75.75 0 01.673.418l3.058 6.197 6.839.994a.75.75 0 01.415 1.279l-4.948 4.823 1.168 6.811a.75.75 0 01-1.088.791L12 18.347l-6.117 3.216a.75.75 0 01-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 01.416-1.28l6.838-.993L11.328 1.17A.75.75 0 0112 .75z"
                clipRule="evenodd"
              />
            </svg>
            {project.stars}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          {project.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Looking for help with:
          </h4>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Areas needing help">
            {project.needsHelp.map((area: ContributionArea, index: number) => (
              <Badge
                key={`${area.type}-${index}`}
                className={getDifficultyColor(area.difficulty)}
                aria-label={`${formatContributionType(area.type)} - ${area.difficulty} difficulty`}
              >
                {formatContributionType(area.type)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Topics:
          </h4>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Project topics">
            {project.topics.map((topic: string) => (
              <Badge
                key={topic}
                variant="secondary"
                size="sm"
                aria-label={`Topic: ${topic}`}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <Badge
          variant="default"
          size="sm"
          aria-label={`Primary language: ${project.language}`}
        >
          {project.language}
        </Badge>
        <Button
          variant="primary"
          size="sm"
          onClick={onContribute}
          className="hover-float"
          aria-label={`Contribute to ${project.name}`}
        >
          Contribute
        </Button>
      </CardFooter>
    </Card>
  );
}
