import React, { createContext, useContext, ReactNode } from 'react';
import Replicate from 'replicate';
import type { ReplicateModel, ModelVersion } from '../services/api/types';

interface ReplicateContextType {
  getModel: (owner: string, name: string) => Promise<ReplicateModel>;
  getModels: (query?: string) => Promise<ReplicateModel[]>;
  getModelVersions: (owner: string, name: string) => Promise<ModelVersion[]>;
  getModelSchema: (owner: string, name: string, version: string) => Promise<ModelVersion>;
  runPrediction: (model: ReplicateModel, version: ModelVersion, input: Record<string, any>) => Promise<any>;
}

export const ReplicateContext = createContext<ReplicateContextType | null>(null);

export function ReplicateProvider({ children }: { children: ReactNode }) {
  const client = new Replicate({
    auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
  });

  const getModel = async (owner: string, name: string): Promise<ReplicateModel> => {
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/models/${owner}/${name}`,
        {
          headers: {
            'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching model:', error);
      throw error;
    }
  };

  const getModels = async (query?: string): Promise<ReplicateModel[]> => {
    try {
      const params = new URLSearchParams();
      if (query) {
        params.append('q', query);
      }

      const response = await fetch(
        `https://api.replicate.com/v1/models?${params.toString()}`,
        {
          headers: {
            'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  };

  const getModelVersions = async (owner: string, name: string): Promise<ModelVersion[]> => {
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/models/${owner}/${name}/versions`,
        {
          headers: {
            'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch model versions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching model versions:', error);
      throw error;
    }
  };

  const getModelSchema = async (owner: string, name: string, version: string): Promise<ModelVersion> => {
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/models/${owner}/${name}/versions/${version}`,
        {
          headers: {
            'Authorization': `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch model schema: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching model schema:', error);
      throw error;
    }
  };

  const runPrediction = async (
    model: ReplicateModel,
    version: ModelVersion,
    input: Record<string, any>
  ) => {
    try {
      const prediction = await client.run(
        `${model.owner}/${model.name}:${version.id}`,
        { input }
      );
      return prediction;
    } catch (error) {
      console.error('Error running prediction:', error);
      throw error;
    }
  };

  const value: ReplicateContextType = {
    getModel,
    getModels,
    getModelVersions,
    getModelSchema,
    runPrediction,
  };

  return (
    <ReplicateContext.Provider value={value}>
      {children}
    </ReplicateContext.Provider>
  );
}

export function useReplicate() {
  const context = useContext(ReplicateContext);
  if (!context) {
    throw new Error('useReplicate must be used within a ReplicateProvider');
  }
  return context;
}
