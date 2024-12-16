export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 dark:border-indigo-900"></div>
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        </div>
      </div>
    </div>
  );
}
