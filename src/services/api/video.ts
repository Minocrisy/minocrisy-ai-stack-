import type { ReplicateModel, ModelVersion } from './types';

export interface VideoGenerationOptions {
  provider: 'replicate' | 'hunyuan';
  model?: {
    replicate?: {
      model: ReplicateModel;
      version: ModelVersion;
    };
    hunyuan?: {
      model: string;
    };
  };
  prompt: string;
  additionalParams?: Record<string, any>;
}

export interface VideoAPI {
  generateVideo: (options: VideoGenerationOptions) => Promise<string>;
  getAvailableProviders: () => Promise<Array<{
    id: string;
    name: string;
    description: string;
    models?: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }>>;
}

class VideoService implements VideoAPI {
  private replicateToken: string;
  private hunyuanToken: string;
  private hunyuanEndpoint: string;

  constructor() {
    this.replicateToken = import.meta.env.VITE_REPLICATE_API_TOKEN;
    this.hunyuanToken = import.meta.env.VITE_HUNYUAN_API_KEY;
    this.hunyuanEndpoint = import.meta.env.VITE_HUNYUAN_API_ENDPOINT;
  }

  async generateVideo(options: VideoGenerationOptions): Promise<string> {
    switch (options.provider) {
      case 'replicate':
        return this.generateWithReplicate(options);
      case 'hunyuan':
        return this.generateWithHunyuan(options);
      default:
        throw new Error(`Unsupported video provider: ${options.provider}`);
    }
  }

  private async generateWithReplicate(options: VideoGenerationOptions): Promise<string> {
    if (!this.replicateToken) {
      throw new Error('VITE_REPLICATE_API_TOKEN is required for Replicate');
    }

    if (!options.model?.replicate) {
      throw new Error('Replicate model configuration is required');
    }

    const { model, version } = options.model.replicate;

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: version.id,
          input: {
            prompt: options.prompt,
            ...options.additionalParams,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.urls.get; // URL to get prediction result
    } catch (error) {
      console.error('Error generating video with Replicate:', error);
      throw error;
    }
  }

  private async generateWithHunyuan(options: VideoGenerationOptions): Promise<string> {
    if (!this.hunyuanToken || !this.hunyuanEndpoint) {
      throw new Error('Hunyuan API credentials are required');
    }

    try {
      const response = await fetch(this.hunyuanEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hunyuanToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: options.prompt,
          model: options.model?.hunyuan?.model || 'hunyuan-video',
          ...options.additionalParams,
        }),
      });

      if (!response.ok) {
        throw new Error(`Hunyuan API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.video_url;
    } catch (error) {
      console.error('Error generating video with Hunyuan:', error);
      throw error;
    }
  }

  async getAvailableProviders() {
    // Return available providers based on configured API keys
    const providers = [];

    if (this.replicateToken) {
      providers.push({
        id: 'replicate',
        name: 'Replicate',
        description: 'Video generation using various Replicate models',
        models: [
          {
            id: 'zeroscope',
            name: 'ZeroScope',
            description: 'Text-to-video generation model',
          },
          // Add other available models
        ],
      });
    }

    if (this.hunyuanToken && this.hunyuanEndpoint) {
      providers.push({
        id: 'hunyuan',
        name: 'Hunyuan',
        description: 'Advanced video generation using Hunyuan API',
        models: [
          {
            id: 'hunyuan-video',
            name: 'Hunyuan Video',
            description: 'Default Hunyuan video generation model',
          },
        ],
      });
    }

    return providers;
  }
}

export const videoService = new VideoService();
