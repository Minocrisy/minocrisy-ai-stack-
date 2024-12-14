import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MediaControls } from '../MediaControls';

// Mock HTMLMediaElement methods
beforeAll(() => {
  window.HTMLMediaElement.prototype.load = jest.fn();
  window.HTMLMediaElement.prototype.play = jest.fn();
  window.HTMLMediaElement.prototype.pause = jest.fn();
  Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
    writable: true,
    value: 100,
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
    writable: true,
    value: 0,
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, 'volume', {
    writable: true,
    value: 1,
  });
});

describe('MediaControls', () => {
  const mockSrc = 'test-media-source.mp4';

  describe('Audio Player', () => {
    it('renders audio player with controls', () => {
      render(<MediaControls type="audio" src={mockSrc} />);
      
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
      expect(screen.getByRole('slider')).toBeInTheDocument(); // Volume control
    });

    it('toggles play/pause state', () => {
      render(<MediaControls type="audio" src={mockSrc} />);
      
      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton);
      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
      
      fireEvent.click(playButton);
      expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    });

    it('handles volume changes', () => {
      render(<MediaControls type="audio" src={mockSrc} />);
      
      const volumeSlider = screen.getByRole('slider');
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });
      
      const audio = document.querySelector('audio');
      expect(audio?.volume).toBe(0.5);
    });

    it('handles mute toggle', () => {
      render(<MediaControls type="audio" src={mockSrc} />);
      
      const muteButton = screen.getByRole('button', { name: /mute/i });
      fireEvent.click(muteButton);
      
      const audio = document.querySelector('audio');
      expect(audio?.muted).toBe(true);
      
      fireEvent.click(muteButton);
      expect(audio?.muted).toBe(false);
    });
  });

  describe('Video Player', () => {
    it('renders video player with controls', () => {
      render(<MediaControls type="video" src={mockSrc} />);
      
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
      expect(screen.getByRole('slider')).toBeInTheDocument();
      expect(screen.getByRole('video')).toBeInTheDocument();
    });

    it('updates progress bar during playback', () => {
      render(<MediaControls type="video" src={mockSrc} />);
      
      const video = document.querySelector('video');
      if (video) {
        Object.defineProperty(video, 'currentTime', { value: 50 });
        fireEvent.timeUpdate(video);
      }
      
      const progressBar = document.querySelector('.bg-blue-500');
      expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('seeks to position when progress bar is clicked', () => {
      render(<MediaControls type="video" src={mockSrc} />);
      
      const progressBar = screen.getByRole('progressbar');
      const rect = progressBar.getBoundingClientRect();
      
      // Click at 50% of the progress bar
      fireEvent.click(progressBar, {
        clientX: rect.left + rect.width * 0.5,
        clientY: rect.top + rect.height / 2,
      });
      
      const video = document.querySelector('video');
      expect(video?.currentTime).toBeCloseTo(50, 1);
    });
  });

  describe('Error Handling', () => {
    it('displays error state when source is invalid', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<MediaControls type="video" src="invalid-source" />);
      
      const video = document.querySelector('video');
      fireEvent.error(video as HTMLVideoElement);
      
      expect(screen.getByText(/error loading media/i)).toBeInTheDocument();
      consoleSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels', () => {
      render(<MediaControls type="audio" src={mockSrc} />);
      
      expect(screen.getByLabelText(/volume/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/progress/i)).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      render(<MediaControls type="audio" src={mockSrc} />);
      
      const playButton = screen.getByRole('button', { name: /play/i });
      playButton.focus();
      fireEvent.keyDown(playButton, { key: 'Enter' });
      
      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });
  });

  describe('Custom Event Handlers', () => {
    it('calls onPlay when play is triggered', () => {
      const onPlay = jest.fn();
      render(<MediaControls type="audio" src={mockSrc} onPlay={onPlay} />);
      
      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton);
      
      expect(onPlay).toHaveBeenCalled();
    });

    it('calls onPause when pause is triggered', () => {
      const onPause = jest.fn();
      render(<MediaControls type="audio" src={mockSrc} onPause={onPause} />);
      
      const playButton = screen.getByRole('button', { name: /play/i });
      fireEvent.click(playButton); // Play first
      fireEvent.click(playButton); // Then pause
      
      expect(onPause).toHaveBeenCalled();
    });

    it('calls onVolumeChange when volume is adjusted', () => {
      const onVolumeChange = jest.fn();
      render(
        <MediaControls
          type="audio"
          src={mockSrc}
          onVolumeChange={onVolumeChange}
        />
      );
      
      const volumeSlider = screen.getByRole('slider');
      fireEvent.change(volumeSlider, { target: { value: '0.5' } });
      
      expect(onVolumeChange).toHaveBeenCalledWith(0.5);
    });
  });
});
