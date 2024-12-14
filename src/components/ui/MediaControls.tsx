import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';

interface MediaControlsProps {
  // Media source
  src?: string;
  type?: 'audio' | 'video';
  // Optional custom controls
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (time: number) => void;
  // Optional custom styling
  className?: string;
  // Optional initial state
  initialVolume?: number;
  autoPlay?: boolean;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  src,
  type = 'audio',
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onSeek,
  className = '',
  initialVolume = 1,
  autoPlay = false,
}) => {
  // State for media controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // References
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Initialize media element
  useEffect(() => {
    if (src && mediaRef.current) {
      mediaRef.current.volume = volume;
      if (autoPlay) {
        mediaRef.current.play().catch(() => {
          // Autoplay may be blocked by browser
          setIsPlaying(false);
        });
      }
    }
  }, [src, volume, autoPlay]);

  // Format time in MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!mediaRef.current) return;

    if (isPlaying) {
      mediaRef.current.pause();
      onPause?.();
    } else {
      mediaRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle stop
  const handleStop = () => {
    if (!mediaRef.current) return;
    
    mediaRef.current.pause();
    mediaRef.current.currentTime = 0;
    setIsPlaying(false);
    onStop?.();
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
      setVolume(newVolume);
      onVolumeChange?.(newVolume);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (!mediaRef.current) return;
    
    mediaRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !mediaRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    mediaRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  // Media event handlers
  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (mediaRef.current) {
      mediaRef.current.currentTime = 0;
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Media Element */}
      {type === 'audio' ? (
        <audio
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={src}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="hidden"
        />
      ) : (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="w-full rounded-lg"
        />
      )}

      {/* Progress Bar */}
      <div
        ref={progressRef}
        onClick={handleSeek}
        className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
      >
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={togglePlay}
          disabled={isLoading}
          variant="outline"
          className="w-12 h-12 rounded-full"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </Button>

        <Button
          onClick={handleStop}
          disabled={isLoading}
          variant="outline"
          className="w-12 h-12 rounded-full"
        >
          ⏹️
        </Button>

        <Button
          onClick={toggleMute}
          variant="outline"
          className="w-12 h-12 rounded-full"
        >
          {isMuted ? '🔇' : '🔊'}
        </Button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};
