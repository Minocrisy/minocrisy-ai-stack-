import type { ReplicateModel, ModelVersion, Model, ModelProvider } from './types';

export class ModelManagementService {
  private providers: Map<string, ModelProvider>;

  constructor() {
    this.providers = new Map();
    // Register default providers
    this.registerProvider(new ReplicateProvider());
  }

  registerProvider(provider: ModelProvider): void {
    this.providers.set(provider.name, provider);
  }

  async getModel(provider: string, id: string): Promise<Model> {
    const modelProvider = this.getProvider(provider);
    return modelProvider.getModel(id);
  }

  async getModels(provider: string, query?: string): Promise<Model[]> {
    const modelProvider = this.getProvider(provider);
    return modelProvider.getModels(query);
  }

  async getModelVersions(provider: string, modelId: string): Promise<ModelVersion[]> {
    const modelProvider = this.getProvider(provider);
    return modelProvider.getModelVersions(modelId);
  }

  async runPrediction(
    provider: string,
    modelId: string,
    version: string,
    input: Record<string, any>
  ): Promise<any> {
    const modelProvider = this.getProvider(provider);
    return modelProvider.runPrediction(modelId, version, input);
  }

  protected getProvider(name: string): ModelProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Model provider '${name}' not found`);
    }
    return provider;
  }

  // For testing purposes only
  _getProviderForTesting(name: string): ModelProvider {
    return this.getProvider(name);
  }
}

class ReplicateProvider implements ModelProvider {
  name = 'replicate';
  private token: string;

  constructor() {
    const token = process.env.VITE_REPLICATE_API_TOKEN;
    if (!token) {
      throw new Error('VITE_REPLICATE_API_TOKEN environment variable is required');
    }
    this.token = token;
  }

  private async fetchFromReplicate(path: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`https://api.replicate.com/v1${path}`, {
      ...options,
      headers: {
        'Authorization': `Token ${this.token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getModel(id: string): Promise<Model> {
    const [owner, name] = id.split('/');
    const replicateModel: ReplicateModel = await this.fetchFromReplicate(
      `/models/${owner}/${name}`
    );

    return this.convertReplicateModel(replicateModel);
  }

  async getModels(query?: string): Promise<Model[]> {
    const params = new URLSearchParams();
    if (query) {
      params.append('q', query);
    }

    const data = await this.fetchFromReplicate(`/models?${params.toString()}`);
    return data.results.map(this.convertReplicateModel.bind(this));
  }

  async getModelVersions(modelId: string): Promise<ModelVersion[]> {
    const [owner, name] = modelId.split('/');
    const data = await this.fetchFromReplicate(
      `/models/${owner}/${name}/versions`
    );
    return data.results;
  }

  async runPrediction(
    modelId: string,
    version: string,
    input: Record<string, any>
  ): Promise<any> {
    const prediction = await this.fetchFromReplicate('/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: `${modelId}:${version}`,
        input,
      }),
    });

    return prediction;
  }

  private convertReplicateModel(replicateModel: ReplicateModel): Model {
    return {
      id: `${replicateModel.owner}/${replicateModel.name}`,
      provider: this.name,
      name: replicateModel.name,
      description: replicateModel.description,
      metadata: {
        github_url: replicateModel.github_url,
        paper_url: replicateModel.paper_url,
        license_url: replicateModel.license_url,
        run_count: replicateModel.run_count,
        cover_image_url: replicateModel.cover_image_url,
      },
      latestVersion: replicateModel.latest_version,
    };
  }
}

// Export singleton instance
export const modelManagement = new ModelManagementService();
