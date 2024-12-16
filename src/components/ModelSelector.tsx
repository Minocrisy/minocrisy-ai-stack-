import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useReplicate } from '../contexts/RootProvider';
import type { ReplicateModel, ModelVersion } from '../services/api/types';

interface ModelSelectorProps {
  onModelSelect: (model: ReplicateModel, version: ModelVersion) => void;
  modelType?: string;
  suggestedModels?: Array<{
    owner: string;
    name: string;
    version: string;
  }>;
}

export function ModelSelector({
  onModelSelect,
  modelType,
  suggestedModels = [],
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<ReplicateModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<ReplicateModel | null>(null);
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ModelVersion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const replicate = useReplicate();

  useEffect(() => {
    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedModel) {
      loadVersions();
    }
  }, [selectedModel]);

  useEffect(() => {
    if (suggestedModels.length > 0) {
      loadSuggestedModels();
    }
  }, [suggestedModels]);

  const loadSuggestedModels = async () => {
    try {
      setLoading(true);
      setError(null);

      const modelPromises = suggestedModels.map(async ({ owner, name, version }) => {
        try {
          const model = await replicate.getModel(owner, name);
          const modelVersion = await replicate.getModelSchema(owner, name, version);
          return { model, version: modelVersion };
        } catch (err) {
          console.error(`Error loading model ${owner}/${name}:`, err);
          return null;
        }
      });

      const results = await Promise.all(modelPromises);
      const validResults = results.filter((result): result is { model: ReplicateModel; version: ModelVersion } => 
        result !== null
      );

      if (validResults.length > 0) {
        setModels(validResults.map(r => r.model));
        setSelectedModel(validResults[0].model);
        setSelectedVersion(validResults[0].version);
        onModelSelect(validResults[0].model, validResults[0].version);
      } else {
        setError('No valid models found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load suggested models';
      console.error('Error in loadSuggestedModels:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = searchQuery;
      if (modelType) {
        query = `${query} ${modelType}`.trim();
      }
      const modelList = await replicate.getModels(query);
      setModels(modelList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load models';
      console.error('Error in loadModels:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async () => {
    if (!selectedModel) return;
    
    try {
      setLoading(true);
      setError(null);
      const versionList = await replicate.getModelVersions(
        selectedModel.owner,
        selectedModel.name
      );
      setVersions(versionList);
      if (versionList.length > 0) {
        setSelectedVersion(versionList[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model versions';
      console.error('Error in loadVersions:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadModels();
  };

  const handleModelSelect = (model: ReplicateModel) => {
    setSelectedModel(model);
    setSelectedVersion(null);
  };

  const handleConfirm = () => {
    if (selectedModel && selectedVersion) {
      onModelSelect(selectedModel, selectedVersion);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </div>
        ) : selectedModel ? (
          `${selectedModel.owner}/${selectedModel.name}`
        ) : (
          'Select Model'
        )}
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <Dialog.Title className="text-lg font-medium p-4 border-b dark:border-gray-700">
              Select Model
            </Dialog.Title>

            <div className="p-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mb-4 flex gap-2">
                <Input
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  Search
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center p-8">
                  <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {models.map((model) => (
                    <div
                      key={`${model.owner}/${model.name}`}
                      className={`
                        p-3 rounded-lg cursor-pointer
                        ${selectedModel?.name === model.name ? 
                          'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 
                          'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent'
                        }
                        border
                      `}
                      onClick={() => handleModelSelect(model)}
                    >
                      <h3 className="font-medium">
                        {model.owner}/{model.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {model.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedModel && versions.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Versions:</h3>
                  <div className="flex flex-wrap gap-2">
                    {versions.map((version) => (
                      <button
                        key={version.id}
                        onClick={() => setSelectedVersion(version)}
                        className={`
                          px-3 py-1 rounded-full text-sm
                          ${selectedVersion?.id === version.id ?
                            'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' :
                            'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                          }
                        `}
                      >
                        {version.id.substring(0, 8)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700">
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedModel || !selectedVersion}
              >
                Select
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
