// Export all API types
export * from './types';

// Export service instances
export { groqService } from './groq';
export { elevenLabsService } from './elevenlabs';
export { hedraService } from './hedra';
export { videoService } from './video';
export { speechService } from './speech';
export { contentCreationService } from './content-creation';

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

// Export content creation types
export type {
  PodcastGenerationOptions,
  CharacterGenerationOptions,
  ContentCreationResult,
} from './content-creation';
