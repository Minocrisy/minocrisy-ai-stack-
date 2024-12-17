import React, { useRef, useState, useEffect } from 'react';
import type { PreviewProgress } from '../../types/preview';
import { Button } from './Button';

interface MediaControlsProps {
  type: 'video' | 'audio';
  src?: string;
  className?: string;
  previewState?: PreviewProgress;
  onError?: (error: Error) => void;
  initialPlaybackRate?: number;
  showFrameControls?: boolean;
}

interface TimelineState {
  currentTime: number;
  duration: number;
  buffered: number;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];
const FRAME_STEP = 1/30; // Assuming 30fps

export const MediaControls: React.FC<MediaControlsProps> = ({
  type,
  src,
  className = '',
  previewState,
  onError,
  initialPlaybackRate = 1,
  showFrameControls = false,
}) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeline, setTimeline] = useState<TimelineState>({
    currentTime: 0,
    duration: 0,
    buffered: 0,
  });
  const [playbackRate, setPlaybackRate] = useState(initialPlaybackRate);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isLoading = previewState?.stage !== 'completed' && previewState?.stage !== 'error';
  const showPlaceholder = !src || isLoading;

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = () => {
    if (!mediaRef.current) return;

    const { currentTime, duration, buffered } = mediaRef.current;
    let bufferedEnd = 0;

    if (buffered.length > 0) {
      bufferedEnd = buffered.end(buffered.length - 1);
    }

    setTimeline({
      currentTime,
      duration,
      buffered: bufferedEnd,
    });
  };

  const handleMediaError = (e: React.SyntheticEvent<HTMLMediaElement, Event>) => {
    const error = new Error(`Failed to load ${type}: ${e.currentTarget.error?.message || 'Unknown error'}`);
    console.error(error);
    onError?.(error);
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return;
    const time = parseFloat(e.target.value);
    mediaRef.current.currentTime = time;
    setTimeline(prev => ({ ...prev, currentTime: time }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return;
    const value = parseFloat(e.target.value);
    mediaRef.current.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (!mediaRef.current) return;
    mediaRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFrameStep = (forward: boolean) => {
    if (!mediaRef.current) return;
    const step = forward ? FRAME_STEP : -FRAME_STEP;
    mediaRef.current.currentTime += step;
  };

  const toggleFullscreen = () => {
    if (!mediaRef.current) return;

    if (!document.fullscreenElement) {
      mediaRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const MediaElement = type === 'video' ? 'video' : 'audio';

  return (
    <div className={`relative ${className}`}>
      <MediaElement
        ref={mediaRef as any}
        className={`w-full rounded-lg ${type === 'video' ? 'aspect-video' : ''}`}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onError={handleMediaError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 rounded-b-lg">
        {/* Timeline */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white text-sm">
            {formatTime(timeline.currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={timeline.duration || 100}
            value={timeline.currentTime}
            onChange={handleSeek}
            className="flex-grow h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
          />
          <span className="text-white text-sm">
            {formatTime(timeline.duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlay}
            className="!p-1"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </Button>

          {/* Frame Controls */}
          {showFrameControls && type === 'video' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleFrameStep(false)}
                className="!p-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleFrameStep(true)}
                className="!p-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 6h-2v12h2zm-3.5 6l-8.5 6V6z" />
                </svg>
              </Button>
            </>
          )}

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMute}
              className="!p-1"
            >
              {isMuted ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-400 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Playback Speed */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="bg-transparent text-white text-sm border border-gray-500 rounded px-1"
          >
            {PLAYBACK_RATES.map((rate) => (
              <option key={rate} value={rate} className="text-black">
                {rate}x
              </option>
            ))}
          </select>

          {/* Fullscreen (video only) */}
          {type === 'video' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="!p-1 ml-auto"
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
