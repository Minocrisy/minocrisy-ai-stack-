import React, { useState } from 'react';
import { useReplicate } from '../contexts/ReplicateContext';
import { Button, TextArea, Card } from './ui';

interface ImageGeneratorProps {
  onImageGenerated?: (imageUrl: string) => void;
}

interface AdvancedParams {
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  num_outputs: number;
}

const DEFAULT_PARAMS: AdvancedParams = {
  width: 768,
  height: 768,
  num_inference_steps: 50,
  guidance_scale: 7.5,
  num_outputs: 1,
};

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated }) => {
  const { loading, error, selectedModels, runPrediction } = useReplicate();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [params, setParams] = useState<AdvancedParams>(DEFAULT_PARAMS);

  const handleGenerate = async () => {
    if (!selectedModels.imageGeneration || !prompt) return;

    try {
      const result = await runPrediction('imageGeneration', {
        prompt,
        negative_prompt: negativePrompt,
        ...params,
      });

      if (Array.isArray(result) && result.length > 0 && onImageGenerated) {
        onImageGenerated(result[0]);
      }
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Image Generator</h2>

        {error && (
          <div className="p-4 text-red-500 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <TextArea
            label="Prompt"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />

          <TextArea
            label="Negative Prompt"
            placeholder="Describe what you don't want in the image..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            rows={2}
          />

          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
          </Button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="width" className="block text-sm font-medium mb-1">
                  Width: {params.width}px
                </label>
                <input
                  id="width"
                  type="range"
                  min="256"
                  max="1024"
                  step="64"
                  value={params.width}
                  onChange={(e) => setParams(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="w-full"
                  aria-label="Width"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium mb-1">
                  Height: {params.height}px
                </label>
                <input
                  id="height"
                  type="range"
                  min="256"
                  max="1024"
                  step="64"
                  value={params.height}
                  onChange={(e) => setParams(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="w-full"
                  aria-label="Height"
                />
              </div>
              <div>
                <label htmlFor="steps" className="block text-sm font-medium mb-1">
                  Steps: {params.num_inference_steps}
                </label>
                <input
                  id="steps"
                  type="range"
                  min="20"
                  max="100"
                  value={params.num_inference_steps}
                  onChange={(e) => setParams(prev => ({ ...prev, num_inference_steps: Number(e.target.value) }))}
                  className="w-full"
                  aria-label="Steps"
                />
              </div>
              <div>
                <label htmlFor="guidance" className="block text-sm font-medium mb-1">
                  Guidance Scale: {params.guidance_scale}
                </label>
                <input
                  id="guidance"
                  type="range"
                  min="1"
                  max="20"
                  step="0.1"
                  value={params.guidance_scale}
                  onChange={(e) => setParams(prev => ({ ...prev, guidance_scale: Number(e.target.value) }))}
                  className="w-full"
                  aria-label="Guidance Scale"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="outputs" className="block text-sm font-medium mb-1">
                  Number of Images
                </label>
                <select
                  id="outputs"
                  value={params.num_outputs}
                  onChange={(e) => setParams(prev => ({ ...prev, num_outputs: Number(e.target.value) }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  aria-label="Number of Images"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                </select>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            className="w-full"
            onClick={handleGenerate}
            disabled={loading || !prompt || !selectedModels.imageGeneration}
            isLoading={loading}
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImageGenerator;
