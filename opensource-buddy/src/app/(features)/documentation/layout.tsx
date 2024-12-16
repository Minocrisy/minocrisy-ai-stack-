import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation Helper | OpenSource Buddy',
  description: 'Create clear, helpful documentation with AI assistance. Perfect for beginners and non-technical contributors.',
  keywords: ['documentation', 'technical writing', 'AI assistance', 'open source', 'contribution'],
};

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
