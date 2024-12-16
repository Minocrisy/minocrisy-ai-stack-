import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Projects | OpenSource Buddy',
  description: 'Find open source projects that match your skills and interests. Start contributing to documentation, testing, and more.',
  keywords: ['open source', 'projects', 'contribute', 'documentation', 'testing', 'translation'],
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
