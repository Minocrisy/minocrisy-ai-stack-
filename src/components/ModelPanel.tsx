import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ModelSelector } from './ModelSelector';
import type { ReplicateModel, ModelVersion } from '../services/api/types';

interface ModelPanelProps {
  title: string;
  description: string;
  modelType: 'imageGeneration' | 'imageStylization' | 'upscaling';
  selectedModel?: { model: ReplicateModel; version: ModelVersion };
  onModelSelect: (model: ReplicateModel, version: ModelVersion) => void;
  onRunPrediction: (input: Record<string, any>) => Promise<any>;
  loading?: boolean;
  error?: string | null;
}

export function ModelPanel({
  title,
  description,
  modelType,
  selectedModel,
  onModelSelect,
  onRunPrediction,
  loading,
  error,
}: ModelPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState<Record<string, any>>({});

  const handleInputChange = (key: string, value: any) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const handleRun = async () => {
    try {
      await onRunPrediction(input);
    } catch (err) {
      console.error('Error running prediction:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="relative group ml-2">
            <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-sm rounded shadow-lg">
              {description}
            </div>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          {expanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <ModelSelector
              onModelSelect={onModelSelect}
              modelType={modelType}
            />
          </div>

          {selectedModel && (
            <>
              <div className="mb-4">
                <p className="text-sm font-medium">
                  Selected Model: {selectedModel.model.owner}/{selectedModel.model.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Version: {selectedModel.version.id}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Model Inputs:</h3>
                {Object.entries(selectedModel.version.openapi_schema?.components?.schemas?.Input?.properties || {}).map(([key, schema]: [string, any]) => (
                  <Input
                    key={key}
                    label={key}
                    helperText={schema.description}
                    value={input[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ))}
              </div>

              <div className="mt-4">
                <Button
                  onClick={handleRun}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </>
                  ) : (
                    'Run Model'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
