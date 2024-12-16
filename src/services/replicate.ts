import Replicate from 'replicate';
import type { ReplicateModel, ModelVersion } from './api/types';

class ReplicateService {
  private client: Replicate;

  constructor() {
    const token = import.meta.env.VITE_REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error('VITE_REPLICATE_API_TOKEN is required');
    }
    this.client = new Replicate({ auth: token });
  }

  async runPrediction(
    model: ReplicateModel,
    version: ModelVersion,
    input: Record<string, any>
  ) {
    try {
      const prediction = await this.client.run(
        `${model.owner}/${model.name}:${version.id}`,
        { input }
      );
      return prediction;
    } catch (error) {
      console.error('Replicate prediction error:', error);
      throw error;
    }
  }
}

export const replicateService = new ReplicateService();
