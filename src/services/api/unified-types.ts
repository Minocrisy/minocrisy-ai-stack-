import type { ReplicateModel, ModelVersion } from './types';
import type { VideoGenerationOptions } from './video';
import type { SpeechRecognitionOptions } from './speech';

// Base provider interface
export interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  models?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

// Base service configuration
export interface ServiceConfig {
  provider: string;
  credentials?: Record<string, string>;
  options?: Record<string, any>;
}

// Base service interface
export interface BaseService {
  getAvailableProviders(): Promise<ServiceProvider[]>;
  configure(config: ServiceConfig): Promise<void>;
}

// Media service types
export interface MediaConfig {
  format?: string;
  quality?: number;
  duration?: number;
}

// Unified video service types (combining YOGI and tellet functionality)
export interface UnifiedVideoService extends BaseService {
  // Generation (from YOGI)
  generateVideo(options: VideoGenerationOptions): Promise<string>;

  // Processing (from tellet)
  processVideo(input: string, options: VideoProcessingOptions): Promise<string>;

  // Streaming (from tellet)
  streamVideo(url: string, options: StreamingOptions): Promise<ReadableStream>;
}

export interface VideoProcessingOptions extends MediaConfig {
  operation: 'trim' | 'merge' | 'convert' | 'compress';
  startTime?: number;
  endTime?: number;
  targetFormat?: string;
  compressionLevel?: number;
}

export interface StreamingOptions extends MediaConfig {
  bufferSize?: number;
  startPosition?: number;
  maxDuration?: number;
}

// Unified speech service types (combining YOGI and tellet functionality)
export interface UnifiedSpeechService extends BaseService {
  // Recognition (from both)
  recognize(options: SpeechRecognitionOptions): Promise<string>;

  // Synthesis (from YOGI)
  synthesize(text: string, options: SpeechSynthesisOptions): Promise<ArrayBuffer>;

  // Streaming (from tellet)
  stream(text: string, options: StreamOptions): Promise<ReadableStream>;
}

// Voice synthesis options
export interface VoiceConfig {
  voice: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface SpeechSynthesisOptions extends VoiceConfig, MediaConfig {}

export interface StreamOptions extends MediaConfig {
  chunkSize?: number;
  realtime?: boolean;
  onProgress?: (progress: number) => void;
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

// Model management types
export interface ModelService extends BaseService {
  getModel(provider: string, id: string): Promise<ReplicateModel>;
  listModels(filter?: ModelFilter): Promise<ReplicateModel[]>;
  getModelVersion(model: ReplicateModel, version: string): Promise<ModelVersion>;
  runPrediction(model: ReplicateModel, input: any): Promise<any>;
}

export interface ModelFilter {
  type?: string;
  tags?: string[];
  owner?: string;
  minRunCount?: number;
}

// Error handling types
export interface ServiceError extends Error {
  code: string;
  provider?: string;
  details?: any;
}

// Response types
export interface ServiceResponse<T> {
  data: T;
  metadata?: {
    provider: string;
    duration: number;
    cost?: number;
  };
  error?: ServiceError;
}
