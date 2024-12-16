import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | OpenSource Buddy',
  description: 'Manage your skills, interests, and track your open source contributions.',
  keywords: ['profile', 'contributions', 'skills', 'open source', 'portfolio'],
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
