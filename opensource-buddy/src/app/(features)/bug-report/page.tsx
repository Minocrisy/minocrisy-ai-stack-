"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Step {
  description: string;
}

interface BugReportForm {
  title: string;
  description: string;
  steps: Step[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: {
    os: string;
    browser: string;
    screenSize: string;
  };
}

const initialForm: BugReportForm = {
  title: '',
  description: '',
  steps: [{ description: '' }],
  expectedBehavior: '',
  actualBehavior: '',
  environment: {
    os: '',
    browser: '',
    screenSize: '',
  },
};

export default function BugReportPage() {
  const [form, setForm] = useState<BugReportForm>(initialForm);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Mock function to detect environment - in production this would be more sophisticated
  const detectEnvironment = () => {
    setForm(prev => ({
      ...prev,
      environment: {
        os: 'Windows 10',
        browser: 'Chrome 120.0.0',
        screenSize: '1920x1080',
      },
    }));
  };

  const addStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [...prev.steps, { description: '' }],
    }));
  };

  const updateStep = (index: number, description: string) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { description } : step
      ),
    }));
  };

  const removeStep = (index: number) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  // Mock function to handle screenshot upload
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In production, we would handle actual file upload
      setScreenshots(prev => [...prev, URL.createObjectURL(files[0])]);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Visual Bug Reporter
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create detailed bug reports with screenshots and step-by-step reproduction instructions.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-between">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step <= currentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span>Basic Info</span>
              <span>Steps & Behavior</span>
              <span>Environment & Screenshots</span>
            </div>
          </div>

          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Basic Information'}
                {currentStep === 2 && 'Steps to Reproduce'}
                {currentStep === 3 && 'Environment & Screenshots'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bug Title
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Brief description of the issue"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Detailed Description
                    </label>
                    <textarea
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={4}
                      placeholder="Provide a detailed description of the bug"
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {form.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <input
                          type="text"
                          className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder={`Step ${index + 1}`}
                          value={step.description}
                          onChange={(e) => updateStep(index, e.target.value)}
                        />
                        {form.steps.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(index)}
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" onClick={addStep}>
                      Add Step
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Expected Behavior
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                        placeholder="What should happen?"
                        value={form.expectedBehavior}
                        onChange={(e) => setForm(prev => ({ ...prev, expectedBehavior: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Actual Behavior
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                        placeholder="What actually happens?"
                        value={form.actualBehavior}
                        onChange={(e) => setForm(prev => ({ ...prev, actualBehavior: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Environment Details
                      </h3>
                      <Button variant="outline" onClick={detectEnvironment}>
                        Auto-detect
                      </Button>
                    </div>
                    <Card>
                      <CardContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Operating System
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                              value={form.environment.os}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                environment: { ...prev.environment, os: e.target.value }
                              }))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Browser
                            </label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                              value={form.environment.browser}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                environment: { ...prev.environment, browser: e.target.value }
                              }))}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Screenshots
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {screenshots.map((screenshot, index) => (
                        <div key={index} className="relative">
                          <img
                            src={screenshot}
                            alt={`Screenshot ${index + 1}`}
                            className="rounded-lg border border-gray-300 dark:border-gray-600"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setScreenshots(prev => prev.filter((_, i) => i !== index))}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <div
                        onClick={() => document.getElementById('screenshot-upload')?.click()}
                        className="cursor-pointer"
                      >
                        <Button variant="outline" className="w-full">
                          Add Screenshot
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (currentStep < 3) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    // Submit form
                    console.log('Submitting bug report:', form);
                  }
                }}
              >
                {currentStep === 3 ? 'Submit Report' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
