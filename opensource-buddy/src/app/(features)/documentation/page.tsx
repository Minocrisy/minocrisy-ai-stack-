"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DocumentationPage() {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [technicalTerms, setTechnicalTerms] = useState<{term: string, explanation: string}[]>([]);

  // Mock AI assistance function - in production, this would call our AI service
  const getAIAssistance = async (text: string) => {
    // Simulated AI response
    setSuggestions([
      'Consider adding more examples to clarify this concept',
      'The introduction could be more beginner-friendly',
      'Add a troubleshooting section for common issues'
    ]);

    setTechnicalTerms([
      {
        term: 'API',
        explanation: 'Application Programming Interface - a way for different software applications to communicate with each other'
      },
      {
        term: 'Repository',
        explanation: 'A storage location for your project that contains all of your project\'s files and each file\'s revision history'
      }
    ]);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Documentation Helper
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create clear, helpful documentation with AI assistance. Perfect for beginners and non-technical contributors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Write Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <textarea
                      className="w-full h-96 p-4 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Start writing your documentation here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setContent('')}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => getAIAssistance(content)}
                      >
                        Get AI Assistance
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Assistance Section */}
            <div className="space-y-6">
              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2"
                      >
                        <svg
                          className="h-5 w-5 text-indigo-500 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Technical Terms */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Terms Explained</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {technicalTerms.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <Badge variant="secondary">{item.term}</Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
