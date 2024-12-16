import type {
  UnifiedVideoService,
  ServiceProvider,
  ServiceConfig,
  VideoProcessingOptions,
  StreamingOptions,
  ServiceResponse,
  ServiceError
} from './unified-types';
import type { VideoGenerationOptions } from './video';
import { videoService } from './video';

class UnifiedVideoServiceImpl implements UnifiedVideoService {
  private config: ServiceConfig | null = null;
  private providers: ServiceProvider[] = [
    {
      id: 'replicate',
      name: 'Replicate',
      description: 'Video generation using various Replicate models',
      models: [
        {
          id: 'zeroscope',
          name: 'ZeroScope',
          description: 'Text-to-video generation model',
        }
      ]
    },
    {
      id: 'hunyuan',
      name: 'Hunyuan',
      description: 'Advanced video generation using Hunyuan API',
      models: [
        {
          id: 'hunyuan-video',
          name: 'Hunyuan Video',
          description: 'Default Hunyuan video generation model',
        }
      ]
    }
  ];

  async getAvailableProviders(): Promise<ServiceProvider[]> {
    return this.providers;
  }

  async configure(config: ServiceConfig): Promise<void> {
    this.config = config;

    // Configure underlying services based on provider
    switch (config.provider) {
      case 'replicate':
        if (!config.credentials?.apiToken) {
          throw new Error('Replicate API token is required');
        }
        process.env.VITE_REPLICATE_API_TOKEN = config.credentials.apiToken;
        break;

      case 'hunyuan':
        if (!config.credentials?.apiKey || !config.credentials?.endpoint) {
          throw new Error('Hunyuan API credentials are required');
        }
        process.env.VITE_HUNYUAN_API_KEY = config.credentials.apiKey;
        process.env.VITE_HUNYUAN_API_ENDPOINT = config.credentials.endpoint;
        break;

      default:
        throw new Error(`Unsupported video provider: ${config.provider}`);
    }
  }

  async generateVideo(options: VideoGenerationOptions): Promise<string> {
    try {
      // Use existing video service for generation
      return await videoService.generateVideo(options);
    } catch (error) {
      console.error('Error generating video:', error);
      throw this.createServiceError('GENERATION_FAILED', error);
    }
  }

  async processVideo(input: string, options: VideoProcessingOptions): Promise<string> {
    if (!this.config) {
      throw new Error('Service must be configured before use');
    }

    try {
      const response = await fetch(input);
      const videoBlob = await response.blob();

      // Create form data for processing
      const formData = new FormData();
      formData.append('video', videoBlob);
      formData.append('operation', options.operation);

      if (options.startTime !== undefined) {
        formData.append('start_time', options.startTime.toString());
      }
      if (options.endTime !== undefined) {
        formData.append('end_time', options.endTime.toString());
      }
      if (options.targetFormat) {
        formData.append('target_format', options.targetFormat);
      }
      if (options.compressionLevel !== undefined) {
        formData.append('compression_level', options.compressionLevel.toString());
      }

      // Process video using configured provider
      const apiEndpoint = this.getProviderEndpoint('process');
      const result = await fetch(apiEndpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
      });

      if (!result.ok) {
        throw new Error(`Video processing failed: ${result.statusText}`);
      }

      const data = await result.json();
      return data.url;
    } catch (error) {
      console.error('Error processing video:', error);
      throw this.createServiceError('PROCESSING_FAILED', error);
    }
  }

  async streamVideo(url: string, options: StreamingOptions): Promise<ReadableStream> {
    if (!this.config) {
      throw new Error('Service must be configured before use');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      // Apply streaming options
      const reader = response.body.getReader();
      const contentLength = Number(response.headers.get('Content-Length')) || 0;

      return new ReadableStream({
        async start(controller) {
          let loadedBytes = 0;

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                break;
              }

              loadedBytes += value.length;
              const progress = (loadedBytes / contentLength) * 100;

              // Check if we've exceeded maxDuration
              if (options.maxDuration && progress > options.maxDuration) {
                controller.close();
                break;
              }

              controller.enqueue(value);
            }
          } catch (error) {
            controller.error(error);
          }
        },

        cancel() {
          reader.cancel();
        }
      });
    } catch (error) {
      console.error('Error streaming video:', error);
      throw this.createServiceError('STREAMING_FAILED', error);
    }
  }

  private getProviderEndpoint(operation: string): string {
    if (!this.config) {
      throw new Error('Service not configured');
    }

    switch (this.config.provider) {
      case 'replicate':
        return `https://api.replicate.com/v1/${operation}`;
      case 'hunyuan':
        return `${this.config.credentials?.endpoint}/${operation}`;
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (!this.config) {
      throw new Error('Service not configured');
    }

    switch (this.config.provider) {
      case 'replicate':
        return {
          'Authorization': `Token ${this.config.credentials?.apiToken}`,
          'Content-Type': 'application/json',
        };
      case 'hunyuan':
        return {
          'Authorization': `Bearer ${this.config.credentials?.apiKey}`,
          'Content-Type': 'application/json',
        };
      default:
        throw new Error(`Unsupported provider: ${this.config.provider}`);
    }
  }

  private createServiceError(code: string, originalError: any): ServiceError {
    const error = new Error(originalError?.message || 'Service operation failed') as ServiceError;
    error.code = code;
    error.provider = this.config?.provider;
    error.details = originalError;
    return error;
  }
}

export const unifiedVideoService = new UnifiedVideoServiceImpl();
