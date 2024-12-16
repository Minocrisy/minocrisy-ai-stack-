"use client";

import { Inter } from 'next/font/google';
import ErrorBoundary from '@/components/ui/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ErrorBoundary error={error} reset={reset} />
      </body>
    </html>
  );
}
