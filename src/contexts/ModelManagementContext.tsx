import React, { createContext, useContext, ReactNode } from 'react';
import { modelManagement } from '../services/api/model-management';
import type { Model, ModelVersion } from '../services/api/types';

interface ModelManagementContextType {
  getModel: (provider: string, id: string) => Promise<Model>;
  getModels: (provider: string, query?: string) => Promise<Model[]>;
  getModelVersions: (provider: string, modelId: string) => Promise<ModelVersion[]>;
  runPrediction: (
    provider: string,
    modelId: string,
    version: string,
    input: Record<string, any>
  ) => Promise<any>;
}

const ModelManagementContext = createContext<ModelManagementContextType | null>(null);

export function ModelManagementProvider({ children }: { children: ReactNode }) {
  const value: ModelManagementContextType = {
    getModel: modelManagement.getModel.bind(modelManagement),
    getModels: modelManagement.getModels.bind(modelManagement),
    getModelVersions: modelManagement.getModelVersions.bind(modelManagement),
    runPrediction: modelManagement.runPrediction.bind(modelManagement),
  };

  return (
    <ModelManagementContext.Provider value={value}>
      {children}
    </ModelManagementContext.Provider>
  );
}

export function useModelManagement() {
  const context = useContext(ModelManagementContext);
  if (!context) {
    throw new Error('useModelManagement must be used within a ModelManagementProvider');
  }
  return context;
}

// For backward compatibility - will be deprecated
export function useReplicate() {
  const context = useModelManagement();

  return {
    getModel: (owner: string, name: string) => context.getModel('replicate', `${owner}/${name}`),
    getModels: (query?: string) => context.getModels('replicate', query),
    getModelVersions: (owner: string, name: string) =>
      context.getModelVersions('replicate', `${owner}/${name}`),
    getModelSchema: async (owner: string, name: string, version: string) => {
      const versions = await context.getModelVersions('replicate', `${owner}/${name}`);
      return versions.find(v => v.id === version) || versions[0];
    },
    runPrediction: async (
      model: { owner: string; name: string },
      version: ModelVersion,
      input: Record<string, any>
    ) => {
      return context.runPrediction(
        'replicate',
        `${model.owner}/${model.name}`,
        version.id,
        input
      );
    },
  };
}
