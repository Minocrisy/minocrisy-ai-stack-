import { contentCreationService } from '../content-creation';
import { unifiedVideoService } from '../unified-video';
import { unifiedSpeechService } from '../unified-speech';
import { modelManagement } from '../model-management';

// Mock dependencies
jest.mock('../unified-video');
jest.mock('../unified-speech');
jest.mock('../model-management');

describe('ContentCreationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePodcast', () => {
    const mockOptions = {
      script: 'Test podcast script',
      voice: 'test-voice-id',
      format: 'mp3' as const,
      quality: 90,
    };

    const mockAudioBuffer = new ArrayBuffer(8);

    beforeEach(() => {
      (unifiedSpeechService.synthesize as jest.Mock).mockResolvedValue(mockAudioBuffer);
    });

    it('should generate a podcast with basic options', async () => {
      const result = await contentCreationService.generatePodcast(mockOptions);

      expect(unifiedSpeechService.synthesize).toHaveBeenCalledWith(
        mockOptions.script,
        expect.objectContaining({
          voice: mockOptions.voice,
          format: mockOptions.format,
          quality: mockOptions.quality,
        })
      );

      expect(result).toEqual({
        url: expect.any(String),
        metadata: {
          format: mockOptions.format,
          quality: mockOptions.quality,
          timestamp: expect.any(String),
        },
      });
    });

    it('should handle background music and effects', async () => {
      const optionsWithBackground = {
        ...mockOptions,
        background: {
          music: 'background.mp3',
          effects: ['applause.mp3'],
        },
      };

      const result = await contentCreationService.generatePodcast(optionsWithBackground);

      expect(result).toEqual({
        url: expect.any(String),
        metadata: {
          format: mockOptions.format,
          quality: mockOptions.quality,
          timestamp: expect.any(String),
        },
      });
    });
  });

  describe('generateVideo', () => {
    const mockPrompt = 'Test video prompt';
    const mockEnhancedPrompt = 'Enhanced test video prompt';
    const mockVideoUrl = 'https://example.com/video.mp4';

    beforeEach(() => {
      (modelManagement.runPrediction as jest.Mock).mockResolvedValue(mockEnhancedPrompt);
      (unifiedVideoService.generateVideo as jest.Mock).mockResolvedValue(mockVideoUrl);
    });

    it('should generate a video with enhanced prompt', async () => {
      const result = await contentCreationService.generateVideo(mockPrompt);

      expect(modelManagement.runPrediction).toHaveBeenCalledWith(
        'openrouter',
        'anthropic/claude-3-opus',
        'latest',
        expect.any(Object)
      );

      expect(unifiedVideoService.generateVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: 'replicate',
          prompt: mockEnhancedPrompt,
        })
      );

      expect(result).toEqual({
        url: mockVideoUrl,
        metadata: {
          timestamp: expect.any(String),
        },
      });
    });

    it('should handle custom video generation options', async () => {
      const customOptions = {
        provider: 'hunyuan' as const,
        model: {
          hunyuan: {
            model: 'custom-model',
          },
        },
      };

      await contentCreationService.generateVideo(mockPrompt, customOptions);

      expect(unifiedVideoService.generateVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: customOptions.provider,
          model: customOptions.model,
          prompt: mockEnhancedPrompt,
        })
      );
    });

    it('should fallback to original prompt if enhancement fails', async () => {
      (modelManagement.runPrediction as jest.Mock).mockRejectedValue(new Error('Enhancement failed'));

      await contentCreationService.generateVideo(mockPrompt);

      expect(unifiedVideoService.generateVideo).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: mockPrompt,
        })
      );
    });
  });
});
