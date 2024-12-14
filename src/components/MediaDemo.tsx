import React from 'react';
import { MediaControls } from './ui/MediaControls';
import { Card } from './ui/Card';

export const MediaDemo: React.FC = () => {
  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Media Controls Demo</h2>
      
      {/* Audio Demo */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Audio Player</h3>
        <MediaControls
          type="audio"
          src="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
          className="mb-4"
        />
      </div>

      {/* Video Demo */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Video Player</h3>
        <MediaControls
          type="video"
          src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"
        />
      </div>
    </Card>
  );
};
