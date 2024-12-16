import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visual Bug Reporter | OpenSource Buddy',
  description: 'Create detailed bug reports with screenshots and step-by-step reproduction instructions. Perfect for non-technical contributors.',
  keywords: ['bug report', 'issue tracking', 'screenshots', 'open source', 'contribution'],
};

export default function BugReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
