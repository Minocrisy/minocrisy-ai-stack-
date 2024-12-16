import React, { useState, useRef } from 'react';
import {
  CloudArrowUpIcon,
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { useAPI } from '../contexts/APIContext';

interface TextToSpeechGeneratorProps {
  onAudioGenerated?: (audioBlob: Blob) => void;
}

export function TextToSpeechGenerator({ onAudioGenerated }: TextToSpeechGeneratorProps) {
  const { elevenLabs } = useAPI();
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Array<{ voice_id: string; name: string }>>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load voices when component mounts
  React.useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const voiceList = await elevenLabs.getVoices();
      setVoices(voiceList);
    } catch (err) {
      setError('Failed to load voices');
      console.error('Error loading voices:', err);
    }
  };

  const handleTextFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedVoice || !text) return;

    setLoading(true);
    setError(null);

    try {
      const audioBuffer = await elevenLabs.synthesize(text, selectedVoice);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      setGeneratedAudio(audioBlob);
      
      if (onAudioGenerated) {
        onAudioGenerated(audioBlob);
      }

      // Create audio URL for preview
      if (audioRef.current) {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
      }
    } catch (err) {
      setError('Failed to generate audio');
      console.error('Error generating audio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSave = () => {
    if (generatedAudio) {
      const url = URL.createObjectURL(generatedAudio);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Text to Speech Generator
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Select
          label="Select Voice"
          value={selectedVoice}
          onChange={setSelectedVoice}
          options={voices.map(voice => ({
            value: voice.voice_id,
            label: voice.name,
          }))}
          disabled={loading}
        />

        <div>
          <input
            accept=".txt"
            className="hidden"
            id="text-file-upload"
            type="file"
            onChange={handleTextFileUpload}
          />
          <label htmlFor="text-file-upload">
            <Button
              variant="secondary"
              className="w-full"
              disabled={loading}
            >
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload Text File
            </Button>
          </label>
        </div>

        <TextArea
          placeholder="Enter text or upload a file..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          rows={6}
        />

        <div className="flex gap-2 items-center">
          <Button
            onClick={handleGenerate}
            disabled={loading || !selectedVoice || !text}
            className="flex-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Audio'
            )}
          </Button>

          {generatedAudio && (
            <>
              <Button
                variant="secondary"
                onClick={handlePlayPause}
                disabled={loading}
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={loading}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
