import type { ReplicateModel, ModelVersion, Model, ModelProvider, OpenRouterModel } from './types';
import { openRouterService } from './openrouter';

// Cache manager for model data
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }>;
  private ttl: number; // Time to live in milliseconds

  constructor(ttlMinutes: number = 5) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Error handling
class ModelManagementError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly provider?: string
  ) {
    super(message);
    this.name = 'ModelManagementError';
  }
}

// Monitoring
class MonitoringService {
  private static instance: MonitoringService;
  private metrics: Map<string, number>;

  private constructor() {
    this.metrics = new Map();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  incrementMetric(name: string): void {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + 1);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

class OpenRouterProvider implements ModelProvider {
  name = 'openrouter';

  async getModel(id: string): Promise<Model> {
    const models = await openRouterService.listModels();
    const model = models.find(m => m.id === id);
    if (!model) {
      throw new ModelManagementError(
        `Model '${id}' not found`,
        'MODEL_NOT_FOUND',
        this.name
      );
    }
    return this.convertOpenRouterModel(model);
  }

  async getModels(query?: string): Promise<Model[]> {
    const models = await openRouterService.listModels();
    if (query) {
      const lowerQuery = query.toLowerCase();
      return models
        .filter(m =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.description?.toLowerCase().includes(lowerQuery)
        )
        .map(this.convertOpenRouterModel.bind(this));
    }
    return models.map(this.convertOpenRouterModel.bind(this));
  }

  async getModelVersions(modelId: string): Promise<ModelVersion[]> {
    // OpenRouter doesn't have explicit versions, return current as only version
    const model = await this.getModel(modelId);
    return [{
      id: modelId,
      created_at: new Date().toISOString(),
    }];
  }

  async runPrediction(
    modelId: string,
    _version: string,
    input: Record<string, any>
  ): Promise<any> {
    if (input.messages) {
      return openRouterService.chat(input.messages, modelId);
    } else if (input.prompt) {
      return openRouterService.complete(input.prompt, modelId);
    }
    throw new ModelManagementError(
      'Input must contain either messages or prompt',
      'INVALID_INPUT',
      this.name
    );
  }

  private convertOpenRouterModel(model: OpenRouterModel): Model {
    return {
      id: model.id,
      provider: this.name,
      name: model.name,
      description: model.description,
      metadata: {
        pricing: {
          prompt: model.pricing.prompt,
          completion: model.pricing.completion,
        },
        context_length: model.context_length,
        architecture: model.architecture,
        provider_info: model.provider,
      },
    };
  }
}

class ReplicateProvider implements ModelProvider {
  name = 'replicate';
  private token: string;

  constructor() {
    const token = import.meta.env.VITE_REPLICATE_API_TOKEN;
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
      throw new ModelManagementError(
        `Replicate API error: ${response.statusText}`,
        'API_ERROR',
        this.name
      );
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

export class ModelManagementService {
  private providers: Map<string, ModelProvider>;
  private cache: CacheManager;
  private monitoring: MonitoringService;

  constructor() {
    this.providers = new Map();
    this.cache = new CacheManager();
    this.monitoring = MonitoringService.getInstance();

    // Register default providers
    this.registerProvider(new ReplicateProvider());
    this.registerProvider(new OpenRouterProvider());
  }

  registerProvider(provider: ModelProvider): void {
    this.providers.set(provider.name, provider);
  }

  async getModel(provider: string, id: string): Promise<Model> {
    const cacheKey = `model:${provider}:${id}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const modelProvider = this.getProvider(provider);
    try {
      const model = await modelProvider.getModel(id);
      this.cache.set(cacheKey, model);
      this.monitoring.incrementMetric(`${provider}_model_fetches`);
      return model;
    } catch (error) {
      this.monitoring.incrementMetric(`${provider}_model_errors`);
      throw error;
    }
  }

  async getModels(provider: string, query?: string): Promise<Model[]> {
    const cacheKey = `models:${provider}:${query || '*'}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const modelProvider = this.getProvider(provider);
    try {
      const models = await modelProvider.getModels(query);
      this.cache.set(cacheKey, models);
      this.monitoring.incrementMetric(`${provider}_models_fetches`);
      return models;
    } catch (error) {
      this.monitoring.incrementMetric(`${provider}_models_errors`);
      throw error;
    }
  }

  async getModelVersions(provider: string, modelId: string): Promise<ModelVersion[]> {
    const cacheKey = `versions:${provider}:${modelId}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const modelProvider = this.getProvider(provider);
    try {
      const versions = await modelProvider.getModelVersions(modelId);
      this.cache.set(cacheKey, versions);
      this.monitoring.incrementMetric(`${provider}_versions_fetches`);
      return versions;
    } catch (error) {
      this.monitoring.incrementMetric(`${provider}_versions_errors`);
      throw error;
    }
  }

  async runPrediction(
    provider: string,
    modelId: string,
    version: string,
    input: Record<string, any>
  ): Promise<any> {
    const modelProvider = this.getProvider(provider);
    try {
      const result = await modelProvider.runPrediction(modelId, version, input);
      this.monitoring.incrementMetric(`${provider}_predictions`);
      return result;
    } catch (error) {
      this.monitoring.incrementMetric(`${provider}_prediction_errors`);
      throw error;
    }
  }

  protected getProvider(name: string): ModelProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new ModelManagementError(
        `Model provider '${name}' not found`,
        'PROVIDER_NOT_FOUND'
      );
    }
    return provider;
  }

  getMetrics(): Record<string, number> {
    return this.monitoring.getMetrics();
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const modelManagement = new ModelManagementService();
