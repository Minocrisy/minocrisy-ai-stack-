import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Make Your First</span>
              <span className="block text-indigo-600 dark:text-indigo-400">Open Source Contribution</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join the open source community without writing code. Our AI-powered platform helps you contribute through documentation, testing, and user feedback.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/projects">
                  <Button variant="primary" size="lg" className="w-full">
                    Browse Projects
                  </Button>
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How OpenSource Buddy Helps
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              We make open source contribution accessible to everyone, regardless of technical background.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* AI Translation */}
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="absolute h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Translation</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                      Our AI translates technical jargon into plain English, making complex concepts easy to understand.
                    </p>
                  </div>
                </div>
              </div>

              {/* Smart Documentation */}
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="absolute h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Smart Documentation</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                      Create high-quality documentation with AI assistance and automatic formatting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Bug Reporter */}
              <div className="relative p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="absolute h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Visual Bug Reporter</h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                      Report bugs effectively with screenshots, annotations, and automated environment details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Start Contributing in Minutes
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Our guided process makes it easy to make your first contribution.
            </p>
          </div>

          <div className="mt-20">
            <div className="relative">
              {/* Steps */}
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-between">
                {[
                  { step: 1, title: "Choose Project", description: "Browse projects that match your interests" },
                  { step: 2, title: "Select Task", description: "Pick from various contribution types" },
                  { step: 3, title: "Get Help", description: "Use AI assistance to complete your task" },
                  { step: 4, title: "Submit", description: "Submit your contribution with confidence" },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="relative flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-indigo-500">
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{item.step}</span>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to contribute?</span>
            <span className="block text-indigo-200">Join the open source community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/projects">
                <Button variant="primary" size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
