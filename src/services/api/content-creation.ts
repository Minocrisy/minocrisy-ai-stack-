import { unifiedVideoService } from './unified-video';
import { unifiedSpeechService } from './unified-speech';
import { modelManagement } from './model-management';
import type { VideoGenerationOptions } from './video';
import type { SpeechSynthesisOptions } from './unified-types';
import type { ReplicateModel, ModelVersion } from './types';
import type { PreviewStage, PreviewProgress, PreviewOptions, PreviewUpdate } from '../../types/preview';

export interface PodcastGenerationOptions {
  script: string;
  voice: string;
  background?: {
    music?: string;
    effects?: string[];
  };
  format?: 'mp3' | 'wav';
  quality?: number; // 0-100 scale
}

export interface CharacterGenerationOptions {
  name: string;
  voice: string;
  model: ReplicateModel;
  modelVersion: ModelVersion;
  appearance: string;
  animation: string;
  preview?: PreviewOptions;
}

export interface ContentCreationResult {
  url: string;
  metadata: {
    duration?: number;
    format?: string;
    quality?: number;
    timestamp: string;
  };
}

class ContentCreationService {
  private previewHandlers = new Map<string, PreviewUpdate[]>();
  private activeGenerations = new Map<string, AbortController>();

  async generatePodcast(options: PodcastGenerationOptions): Promise<ContentCreationResult> {
    try {
      // 1. Generate speech audio
      const audioBuffer = await unifiedSpeechService.synthesize(options.script, {
        voice: options.voice,
        format: options.format,
        quality: options.quality,
      });

      // 2. Process audio (add background music/effects if specified)
      let finalAudio = audioBuffer;
      if (options.background) {
        finalAudio = await this.mixAudio(audioBuffer, options.background);
      }

      // 3. Create metadata
      const metadata = {
        format: options.format || 'mp3',
        quality: options.quality || 90,
        timestamp: new Date().toISOString(),
      };

      // TODO: Upload to storage and return URL
      const url = 'temporary-url';

      return {
        url,
        metadata,
      };
    } catch (error) {
      console.error('Error generating podcast:', error);
      throw error;
    }
  }

  async generateVideo(prompt: string, options: Partial<VideoGenerationOptions> = {}): Promise<ContentCreationResult> {
    try {
      // 1. Use OpenRouter for text generation to enhance the prompt
      const enhancedPrompt = await modelManagement.runPrediction(
        'openrouter',
        'anthropic/claude-3-opus',
        'latest',
        {
          messages: [{
            role: 'user',
            content: `Enhance this video generation prompt with more details about visual elements, style, and mood: ${prompt}`
          }]
        }
      );

      // 2. Generate video using enhanced prompt
      const videoUrl = await unifiedVideoService.generateVideo({
        provider: options.provider || 'replicate',
        prompt: typeof enhancedPrompt === 'string' ? enhancedPrompt : prompt,
        ...options,
      });

      return {
        url: videoUrl,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  async generateCharacter(options: CharacterGenerationOptions): Promise<ContentCreationResult> {
    const generationId = `character-${Date.now()}`;
    const abortController = new AbortController();
    this.activeGenerations.set(generationId, abortController);

    try {
      if (options.preview?.onUpdate) {
        this.previewHandlers.set(generationId, []);
        this.emitPreviewUpdate(generationId, {
          type: 'progress',
          data: {
            stage: 'preparing',
            progress: 0,
            message: 'Preparing character generation...',
          },
        });
      }

      // 1. Generate character video
      if (options.preview?.onUpdate) {
        this.emitPreviewUpdate(generationId, {
          type: 'progress',
          data: {
            stage: 'generating',
            progress: 20,
            message: 'Generating character video...',
          },
        });
      }

      const videoResult = await this.generateVideo(
        `${options.name} ${options.animation} animation, ${options.appearance} style`,
        {
          provider: 'replicate',
          model: {
            replicate: {
              model: options.model,
              version: options.modelVersion
            }
          }
        }
      );

      if (options.preview?.onUpdate) {
        this.emitPreviewUpdate(generationId, {
          type: 'progress',
          data: {
            stage: 'processing',
            progress: 60,
            message: 'Processing video...',
            previewUrl: videoResult.url,
          },
        });
      }

      // 2. Generate character voice sample if voice is provided
      if (options.voice) {
        if (options.preview?.onUpdate) {
          this.emitPreviewUpdate(generationId, {
            type: 'progress',
            data: {
              stage: 'processing',
              progress: 80,
              message: 'Generating voice sample...',
            },
          });
        }

        const sampleText = `Hello, I'm ${options.name}. Nice to meet you!`;
        await unifiedSpeechService.synthesize(sampleText, {
          voice: options.voice,
          format: 'mp3',
          quality: 90,
        });
      }

      if (options.preview?.onUpdate) {
        this.emitPreviewUpdate(generationId, {
          type: 'progress',
          data: {
            stage: 'completed',
            progress: 100,
            message: 'Character generation complete!',
            previewUrl: videoResult.url,
          },
        });
      }

      return videoResult;
    } catch (error) {
      console.error('Error generating character:', error);
      if (options.preview?.onUpdate) {
        this.emitPreviewUpdate(generationId, {
          type: 'error',
          data: {
            stage: 'error',
            error: error instanceof Error ? error.message : 'An error occurred',
          },
        });
      }
      throw error;
    } finally {
      this.activeGenerations.delete(generationId);
      this.previewHandlers.delete(generationId);
    }
  }

  private emitPreviewUpdate(generationId: string, update: PreviewUpdate) {
    const handler = this.previewHandlers.get(generationId);
    if (handler) {
      handler.push(update);
      const options = this.activeGenerations.get(generationId);
      if (options) {
        handler.forEach(update => options.signal.addEventListener('abort', () => {
          // Clean up any resources
        }));
      }
    }
  }

  cancelGeneration(generationId: string) {
    const controller = this.activeGenerations.get(generationId);
    if (controller) {
      controller.abort();
      this.activeGenerations.delete(generationId);
      this.previewHandlers.delete(generationId);
    }
  }

  private async mixAudio(mainAudio: ArrayBuffer, background: PodcastGenerationOptions['background']): Promise<ArrayBuffer> {
    // TODO: Implement audio mixing logic
    // This would handle:
    // 1. Loading background music
    // 2. Loading sound effects
    // 3. Mixing them with the main audio
    // 4. Adjusting levels
    return mainAudio; // Temporary return until implementation
  }
}

export const contentCreationService = new ContentCreationService();
