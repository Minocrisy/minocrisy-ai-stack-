import React from 'react';
import type { PreviewProgress } from '../../types/preview';

interface MediaControlsProps {
  type: 'video' | 'audio';
  src?: string;
  className?: string;
  previewState?: PreviewProgress;
  onError?: (error: Error) => void;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  type,
  src,
  className = '',
  previewState,
  onError
}) => {
  const isLoading = previewState?.stage !== 'completed' && previewState?.stage !== 'error';
  const showPlaceholder = !src || isLoading;

  const handleMediaError = (e: React.SyntheticEvent<HTMLMediaElement, Event>) => {
    const error = new Error(`Failed to load ${type}: ${e.currentTarget.error?.message || 'Unknown error'}`);
    console.error(error);
    onError?.(error);
  };

  if (showPlaceholder) {
    return (
      <div className={`relative ${className}`}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className="text-sm text-gray-500">
                {previewState?.message || 'Loading...'}
              </p>
              {previewState?.progress !== undefined && (
                <div className="w-48 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${previewState.progress}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No media available</p>
          )}
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <video
        className={`w-full rounded-lg ${className}`}
        src={src}
        controls
        onError={handleMediaError}
      />
    );
  }

  return (
    <audio
      className={`w-full ${className}`}
      src={src}
      controls
      onError={handleMediaError}
    />
  );
};
