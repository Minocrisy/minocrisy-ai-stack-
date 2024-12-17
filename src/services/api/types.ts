// Common types for API services

export interface APIResponse<T> {
  data: T;
  error?: string;
}

// Groq API types
export interface GroqAPI {
  complete(prompt: string): Promise<string>;
  chat(messages: Array<{ role: string; content: string }>): Promise<string>;
}

// OpenRouter API types
export interface OpenRouterAPI {
  listModels(): Promise<OpenRouterModel[]>;
  chat(messages: Array<{ role: string; content: string }>, model: string): Promise<string>;
  complete(prompt: string, model: string): Promise<string>;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture?: {
    model_type: string;
    parameters?: number;
  };
  provider?: {
    name: string;
    status?: string;
  };
}

// ElevenLabs API types
export interface ElevenLabsAPI {
  synthesize(text: string, voiceId: string): Promise<ArrayBuffer>;
  getVoices(): Promise<Array<{
    voice_id: string;
    name: string;
    preview_url: string;
  }>>;
}

// Hedra API types
export interface HedraAPI {
  process(input: {
    text: string;
    type: 'analyze' | 'enhance' | 'summarize';
  }): Promise<{
    result: string;
    metadata?: Record<string, any>;
  }>;
}

// Model Management types
export interface Model {
  id: string;
  provider: string;
  name: string;
  description?: string;
  metadata?: {
    github_url?: string;
    paper_url?: string;
    license_url?: string;
    run_count?: number;
    cover_image_url?: string;
    pricing?: {
      prompt?: string;
      completion?: string;
    };
    context_length?: number;
    architecture?: {
      model_type?: string;
      parameters?: number;
    };
    provider_info?: {
      name?: string;
      status?: string;
    };
  };
  latestVersion?: ModelVersion;
}

// Replicate types
export interface ReplicateModel {
  owner: string;
  name: string;
  description: string;
  github_url?: string;
  paper_url?: string;
  license_url?: string;
  run_count?: number;
  cover_image_url?: string;
  latest_version?: ModelVersion;
}

export interface ModelVersion {
  id: string;
  created_at: string;
  cog_version?: string;
  openapi_schema?: {
    components?: {
      schemas?: {
        Input?: {
          properties: Record<string, {
            type: string;
            description?: string;
          }>;
        };
      };
    };
  };
}

export interface ModelProvider {
  name: string;
  getModel: (id: string) => Promise<Model>;
  getModels: (query?: string) => Promise<Model[]>;
  getModelVersions: (modelId: string) => Promise<ModelVersion[]>;
  runPrediction: (modelId: string, version: string, input: Record<string, any>) => Promise<any>;
}
