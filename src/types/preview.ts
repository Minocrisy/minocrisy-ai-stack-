export type PreviewStage =
  | 'idle'
  | 'preparing'
  | 'generating'
  | 'processing'
  | 'finalizing'
  | 'completed'
  | 'error';

export interface PreviewProgress {
  stage: PreviewStage;
  progress: number; // 0-100
  message?: string;
  previewUrl?: string;
  error?: string;
}

export interface PreviewUpdate {
  type: 'progress' | 'preview' | 'error';
  data: {
    stage?: PreviewStage;
    progress?: number;
    message?: string;
    previewUrl?: string;
    error?: string;
  };
}

export type PreviewUpdateHandler = (update: PreviewUpdate) => void;

export interface PreviewOptions {
  onUpdate?: PreviewUpdateHandler;
  enableRealTimeUpdates?: boolean;
  quality?: 'draft' | 'preview' | 'final';
  autoRefresh?: boolean;
}
