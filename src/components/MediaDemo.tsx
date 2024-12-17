import React from 'react';
import { MediaControls } from './ui/MediaControls';
import { Card } from './ui/Card';
import { DragDrop } from './ui/DragDrop';

export const MediaDemo: React.FC = () => {
  const handleMediaError = (error: Error) => {
    console.error('Media error:', error);
  };

  const handleFileDrop = (files: File[]) => {
    console.log('Files dropped:', files);
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">Media Controls Demo</h2>

      {/* Audio Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Audio Player</h3>
        <MediaControls
          type="audio"
          src="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
          className="mb-4"
          onError={handleMediaError}
          initialPlaybackRate={1}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Features: Timeline scrubbing, volume control, playback speed
        </p>
      </div>

      {/* Video Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Video Player</h3>
        <MediaControls
          type="video"
          src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
          onError={handleMediaError}
          initialPlaybackRate={1}
          showFrameControls
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Features: Frame navigation, fullscreen, timeline scrubbing, playback speed
        </p>
      </div>

      {/* Media Upload */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Media Upload</h3>
        <DragDrop
          onDrop={handleFileDrop}
          accept={{
            'video/*': ['.mp4', '.webm', '.mov'],
            'audio/*': ['.mp3', '.wav', '.ogg']
          }}
          maxFiles={1}
          maxSize={50 * 1024 * 1024} // 50MB
          showPreview
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag and drop media files here to preview them
        </p>
      </div>

      {/* Loading State Demo */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Loading States</h3>
        <MediaControls
          type="video"
          previewState={{
            stage: 'processing',
            message: 'Processing video...',
            progress: 65
          }}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Example of loading state with progress indicator
        </p>
      </div>
    </Card>
  );
};
