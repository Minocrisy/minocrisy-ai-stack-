import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { MediaControls } from './ui/MediaControls';
import { ModelSelector } from './ModelSelector';
import { useAPI } from '../contexts/APIContext';
import type { ReplicateModel, ModelVersion } from '../services/api/types';
import type { VideoGenerationOptions } from '../services/api/video';

interface Character {
  name: string;
  voice: string;
  model: ReplicateModel | null;
  modelVersion: ModelVersion | null;
  appearance: string;
  animation: string;
}

export const CharacterCreator: React.FC = () => {
  const { video, elevenLabs } = useAPI();
  
  const [character, setCharacter] = useState<Character>({
    name: '',
    voice: '',
    model: null,
    modelVersion: null,
    appearance: '',
    animation: ''
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');
  const [voices, setVoices] = useState<Array<{ voice_id: string; name: string }>>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await elevenLabs.getVoices();
        setVoices(availableVoices);
      } catch (err) {
        console.error('Error loading voices:', err);
      }
    };
    loadVoices();
  }, [elevenLabs]);

  // Available options
  const animationOptions = [
    { value: 'idle', label: 'Idle' },
    { value: 'talking', label: 'Talking' },
    { value: 'walking', label: 'Walking' },
    { value: 'greeting', label: 'Greeting' }
  ];

  const appearanceOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'business', label: 'Business' },
    { value: 'formal', label: 'Formal' },
    { value: 'relaxed', label: 'Relaxed' }
  ];

  // Handle input changes
  const handleChange = (field: keyof Omit<Character, 'model' | 'modelVersion'>, value: string) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear any previous errors
    setError('');
  };

  // Generate preview
  const handleGeneratePreview = async () => {
    try {
      setIsGenerating(true);
      setError('');

      // Validate required fields
      if (!character.name || !character.model || !character.modelVersion || !character.animation) {
        throw new Error('Please fill in all required fields');
      }

      // Generate video preview using selected model and animation
      const options: VideoGenerationOptions = {
        provider: 'replicate',
        model: {
          replicate: {
            model: character.model,
            version: character.modelVersion
          }
        },
        prompt: `${character.name} ${character.animation} animation, ${character.appearance} style`
      };

      const result = await video.generateVideo(options);
      setPreviewUrl(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle model selection
  const handleModelSelect = (model: ReplicateModel, version: ModelVersion) => {
    setCharacter(prev => ({
      ...prev,
      model,
      modelVersion: version
    }));
  };

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Character Creator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Character Configuration */}
        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium mb-1">Character Name</label>
            <Input
              value={character.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter character name"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Character Model</label>
            <ModelSelector
              onModelSelect={handleModelSelect}
              modelType="character"
            />
          </div>

          {/* Appearance */}
          <div>
            <label className="block text-sm font-medium mb-1">Appearance</label>
            <Select
              value={character.appearance}
              onChange={(value) => handleChange('appearance', value)}
              options={appearanceOptions}
              label="Select appearance style"
            />
          </div>

          {/* Animation */}
          <div>
            <label className="block text-sm font-medium mb-1">Animation</label>
            <Select
              value={character.animation}
              onChange={(value) => handleChange('animation', value)}
              options={animationOptions}
              label="Select animation type"
            />
          </div>

          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Voice</label>
            <Select
              value={character.voice}
              onChange={(value) => handleChange('voice', value)}
              options={voices.map(voice => ({
                value: voice.voice_id,
                label: voice.name
              }))}
              label="Select character voice"
            />
          </div>

          {/* Generate Preview Button */}
          <Button
            onClick={handleGeneratePreview}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating Preview...' : 'Generate Preview'}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Preview</h3>
          
          {previewUrl ? (
            <MediaControls
              type="video"
              src={previewUrl}
              className="w-full"
            />
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">
                {isGenerating ? 'Generating preview...' : 'Generate a preview to see your character'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};