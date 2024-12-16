export default function BugReportLoading() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          {/* Progress Steps Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
                ></div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6">
            <div className="space-y-6">
              {/* Form Header */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex justify-between pt-4">
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
