import type {
  UnifiedSpeechService,
  ServiceProvider,
  ServiceConfig,
  SpeechSynthesisOptions,
  StreamOptions,
  ServiceError
} from './unified-types';
import type { SpeechRecognitionOptions } from './speech';
import { speechService } from './speech';
import { elevenLabsService } from './elevenlabs';

class UnifiedSpeechServiceImpl implements UnifiedSpeechService {
  private config: ServiceConfig | null = null;
  private providers: ServiceProvider[] = [
    {
      id: 'browser',
      name: 'Browser Speech',
      description: 'Native browser-based speech recognition',
    },
    {
      id: 'whisper',
      name: 'OpenAI Whisper',
      description: 'High-accuracy speech recognition using Whisper',
      models: [
        {
          id: 'whisper-1',
          name: 'Whisper v1',
          description: 'Latest Whisper model',
        }
      ]
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      description: 'High-quality speech synthesis',
    }
  ];

  async getAvailableProviders(): Promise<ServiceProvider[]> {
    return this.providers;
  }

  async configure(config: ServiceConfig): Promise<void> {
    this.config = config;

    // Configure underlying services based on provider
    switch (config.provider) {
      case 'whisper':
        if (!config.credentials?.apiKey) {
          throw new Error('OpenAI API key is required for Whisper');
        }
        process.env.VITE_OPENAI_API_KEY = config.credentials.apiKey;
        break;

      case 'elevenlabs':
        if (!config.credentials?.apiKey) {
          throw new Error('ElevenLabs API key is required');
        }
        process.env.VITE_ELEVENLABS_API_KEY = config.credentials.apiKey;
        break;

      case 'browser':
        // No configuration needed for browser speech
        break;

      default:
        throw new Error(`Unsupported speech provider: ${config.provider}`);
    }
  }

  async recognize(options: SpeechRecognitionOptions): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        let finalText = '';

        speechService.startRecognition({
          ...options,
          onResult: (text, isFinal) => {
            if (isFinal) {
              finalText = text;
            }
          },
          onEnd: () => {
            resolve(finalText);
          }
        }).catch(reject);
      });
    } catch (error) {
      console.error('Error in speech recognition:', error);
      throw this.createServiceError('RECOGNITION_FAILED', error);
    }
  }

  async synthesize(text: string, options: SpeechSynthesisOptions): Promise<ArrayBuffer> {
    if (!this.config) {
      throw new Error('Service must be configured before use');
    }

    try {
      switch (this.config.provider) {
        case 'elevenlabs':
          return await elevenLabsService.synthesize(text, options.voice);

        default:
          throw new Error(`Speech synthesis not supported for provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      throw this.createServiceError('SYNTHESIS_FAILED', error);
    }
  }

  async stream(text: string, options: StreamOptions & Partial<SpeechSynthesisOptions>): Promise<ReadableStream> {
    if (!this.config) {
      throw new Error('Service must be configured before use');
    }

    if (!options.voice && this.config.provider === 'elevenlabs') {
      throw new Error('Voice ID is required for ElevenLabs streaming');
    }

    try {
      // Create synthesis request with voice option
      const audioBuffer = await this.synthesize(text, {
        voice: options.voice || '',
        language: options.language,
        speed: options.speed,
        pitch: options.pitch,
        format: options.format,
        quality: options.quality,
        duration: options.duration,
      });

      // Convert ArrayBuffer to ReadableStream
      return new ReadableStream({
        start(controller) {
          const chunkSize = options.chunkSize || 16384; // Default 16KB chunks
          const audioData = new Uint8Array(audioBuffer);
          let offset = 0;

          function pushChunk() {
            const chunk = audioData.slice(offset, offset + chunkSize);
            offset += chunkSize;

            if (chunk.length > 0) {
              controller.enqueue(chunk);

              if (offset < audioData.length) {
                // If realtime option is set, add delay between chunks
                if (options.realtime) {
                  setTimeout(pushChunk, 100); // Adjust delay as needed
                } else {
                  pushChunk();
                }
              } else {
                controller.close();
              }
            } else {
              controller.close();
            }

            if (options.onProgress) {
              options.onProgress((offset / audioData.length) * 100);
            }
          }

          pushChunk();
        }
      });
    } catch (error) {
      console.error('Error in speech streaming:', error);
      throw this.createServiceError('STREAMING_FAILED', error);
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

export const unifiedSpeechService = new UnifiedSpeechServiceImpl();
