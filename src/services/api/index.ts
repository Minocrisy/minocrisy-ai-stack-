// Export all API types
export * from './types';

// Export service instances
export { groqService } from './groq';
export { elevenLabsService } from './elevenlabs';
export { hedraService } from './hedra';
export { videoService } from './video';
export { speechService } from './speech';

// Export base service for extending
export { replicateService } from '../replicate';

// Export video and speech types
export type {
  VideoGenerationOptions,
  VideoAPI,
} from './video';

export type {
  SpeechRecognitionOptions,
  SpeechAPI,
} from './speech';
