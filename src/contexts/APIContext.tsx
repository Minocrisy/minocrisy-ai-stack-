import React, { createContext, useContext, ReactNode } from 'react';
import {
  groqService,
  elevenLabsService,
  hedraService,
  videoService,
  speechService,
  contentCreationService,
} from '../services/api';
import type {
  GroqAPI,
  ElevenLabsAPI,
  HedraAPI,
  VideoAPI,
  SpeechAPI,
} from '../services/api';
import type {
  PodcastGenerationOptions,
  CharacterGenerationOptions,
  ContentCreationResult
} from '../services/api/content-creation';

interface ContentCreationAPI {
  generatePodcast: (options: PodcastGenerationOptions) => Promise<ContentCreationResult>;
  generateVideo: (prompt: string, options?: any) => Promise<ContentCreationResult>;
  generateCharacter: (options: CharacterGenerationOptions) => Promise<ContentCreationResult>;
}

interface APIContextValue {
  groq: GroqAPI;
  elevenLabs: ElevenLabsAPI;
  hedra: HedraAPI;
  video: VideoAPI;
  speech: SpeechAPI;
  contentCreation: ContentCreationAPI;
}

export const APIContext = createContext<APIContextValue | null>(null);

export function APIProvider({ children }: { children: ReactNode }) {
  const value = {
    groq: groqService,
    elevenLabs: elevenLabsService,
    hedra: hedraService,
    video: videoService,
    speech: speechService,
    contentCreation: contentCreationService,
  };

  return (
    <APIContext.Provider value={value}>
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within an APIProvider');
  }
  return context;
}

// Convenience hooks for individual services
export function useGroq() {
  return useAPI().groq;
}

export function useElevenLabs() {
  return useAPI().elevenLabs;
}

export function useHedra() {
  return useAPI().hedra;
}

export function useVideo() {
  return useAPI().video;
}

export function useSpeech() {
  return useAPI().speech;
}

export function useContentCreation() {
  return useAPI().contentCreation;
}
