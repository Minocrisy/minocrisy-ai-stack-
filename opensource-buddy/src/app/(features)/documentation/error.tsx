"use client";

import ErrorBoundary from '@/components/ui/error-boundary';

export default function DocumentationError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorBoundary error={error} reset={reset} />;
}
