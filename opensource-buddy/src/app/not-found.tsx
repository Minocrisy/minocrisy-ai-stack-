import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Page not found
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/">
            <Button variant="primary" className="w-full">
              Go back home
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" className="w-full">
              Browse projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
