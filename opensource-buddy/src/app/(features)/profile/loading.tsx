export default function ProfileLoading() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Header Skeleton */}
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>

          {/* Skills Section Skeleton */}
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"
                  ></div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Interests Section Skeleton */}
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"
                  ></div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Contributions Section Skeleton */}
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm p-6">
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                    </div>
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
