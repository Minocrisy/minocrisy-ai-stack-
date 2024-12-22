import React, { useState, useCallback } from 'react';
import { ChevronUpIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { ModelSelector } from './ModelSelector';
import { ParameterControl } from './ui/ParameterControl';
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
  const [validationState, setValidationState] = useState<Record<string, boolean>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = useCallback((key: string, value: any) => {
    setInput(prev => ({ ...prev, [key]: value }));

    // If in preview mode, trigger prediction with debounce
    if (previewMode && !loading) {
      const timer = setTimeout(() => {
        handleRun();
      }, 500); // Debounce time
      return () => clearTimeout(timer);
    }
  }, [previewMode, loading]);

  const handleValidation = useCallback((key: string, isValid: boolean) => {
    setValidationState(prev => ({ ...prev, [key]: isValid }));
  }, []);

  const isFormValid = useCallback(() => {
    return Object.values(validationState).every(Boolean);
  }, [validationState]);

  const handleRun = async () => {
    if (!isFormValid()) return;

    try {
      await onRunPrediction(input);
    } catch (err) {
      console.error('Error running prediction:', err);
    }
  };

  const getInputSchema = () => {
    if (!selectedModel?.version.openapi_schema?.components?.schemas?.Input?.properties) {
      return {};
    }
    return selectedModel.version.openapi_schema.components.schemas.Input.properties;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="relative group ml-2">
            <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-sm rounded shadow-lg z-10">
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Selected Model: {selectedModel.model.owner}/{selectedModel.model.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Version: {selectedModel.version.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">
                      Preview Mode
                    </label>
                    <input
                      type="checkbox"
                      checked={previewMode}
                      onChange={(e) => setPreviewMode(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      title="Enable real-time preview as you adjust parameters"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Model Parameters:</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setInput({})}
                    className="text-xs"
                  >
                    Reset to Defaults
                  </Button>
                </div>

                {Object.entries(getInputSchema()).map(([key, schema]: [string, any]) => (
                  <ParameterControl
                    key={key}
                    name={key}
                    schema={schema}
                    value={input[key]}
                    onChange={(value) => handleInputChange(key, value)}
                    onValidate={(isValid) => handleValidation(key, isValid)}
                  />
                ))}
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleRun}
                  disabled={loading || !isFormValid()}
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
