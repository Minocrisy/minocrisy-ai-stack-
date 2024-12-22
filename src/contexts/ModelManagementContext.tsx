import React, { createContext, useContext, useState, useCallback } from 'react';
import { modelManagement } from '../services/api/model-management';
import type { Model, ModelVersion } from '../services/api/types';

interface ModelManagementContextType {
  selectedProvider: string;
  selectedModel: Model | null;
  selectedVersion: ModelVersion | null;
  models: Model[];
  versions: ModelVersion[];
  isLoading: boolean;
  error: string | null;
  setSelectedProvider: (provider: string) => void;
  searchModels: (query?: string) => Promise<void>;
  selectModel: (model: Model) => Promise<void>;
  selectVersion: (version: ModelVersion) => void;
  runPrediction: (input: Record<string, any>) => Promise<any>;
}

const ModelManagementContext = createContext<ModelManagementContextType | null>(null);

export const useModelManagement = () => {
  const context = useContext(ModelManagementContext);
  if (!context) {
    throw new Error('useModelManagement must be used within a ModelManagementProvider');
  }
  return context;
};

export const ModelManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProvider, setSelectedProvider] = useState('replicate');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<ModelVersion | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchModels = useCallback(async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await modelManagement.getModels(selectedProvider, query);
      setModels(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProvider]);

  const selectModel = useCallback(async (model: Model) => {
    setSelectedModel(model);
    setSelectedVersion(null);
    setIsLoading(true);
    setError(null);
    try {
      const modelVersions = await modelManagement.getModelVersions(
        selectedProvider,
        model.id
      );
      setVersions(modelVersions);
      if (modelVersions.length > 0) {
        setSelectedVersion(modelVersions[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch model versions');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProvider]);

  const runPrediction = useCallback(async (input: Record<string, any>) => {
    if (!selectedModel || !selectedVersion) {
      throw new Error('No model or version selected');
    }
    setIsLoading(true);
    setError(null);
    try {
      return await modelManagement.runPrediction(
        selectedProvider,
        selectedModel.id,
        selectedVersion.id,
        input
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run prediction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProvider, selectedModel, selectedVersion]);

  const value = {
    selectedProvider,
    selectedModel,
    selectedVersion,
    models,
    versions,
    isLoading,
    error,
    setSelectedProvider,
    searchModels,
    selectModel,
    selectVersion: setSelectedVersion,
    runPrediction,
  };

  return (
    <ModelManagementContext.Provider value={value}>
      {children}
    </ModelManagementContext.Provider>
  );
};
