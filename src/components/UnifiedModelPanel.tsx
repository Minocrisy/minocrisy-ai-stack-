import React, { useEffect } from 'react';
import { useModelManagement } from '../contexts/ModelManagementContext';
import { Button, Card, Select, Input, Badge } from './ui';

export const UnifiedModelPanel: React.FC = () => {
  const {
    selectedProvider,
    selectedModel,
    selectedVersion,
    models,
    versions,
    isLoading,
    error,
    setSelectedProvider,
    searchModels,
    selectModel,
    selectVersion,
    runPrediction
  } = useModelManagement();

  useEffect(() => {
    searchModels();
  }, [selectedProvider, searchModels]);

  const providers = [
    { value: 'replicate', label: 'Replicate' },
    { value: 'openrouter', label: 'OpenRouter' },
    { value: 'groq', label: 'Groq' }
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchModels(e.target.value);
  };

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value);
  };

  const handleModelSelect = (model: any) => {
    selectModel(model);
  };

  const handleVersionSelect = (version: any) => {
    selectVersion(version);
  };

  const handleRunPrediction = async () => {
    try {
      const result = await runPrediction({
        messages: [
          { role: 'user', content: 'Hello! How are you?' }
        ]
      });
      console.log('Prediction result:', result);
    } catch (err) {
      console.error('Prediction error:', err);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Unified Model Management</h2>
          {error && (
            <div className="mb-4">
              <Badge variant="error">{error}</Badge>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Select
            label="Provider"
            value={selectedProvider}
            onChange={handleProviderChange}
            options={providers}
          />

          <Input
            label="Search Models"
            placeholder="Enter search terms..."
            onChange={handleSearch}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Available Models</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {models.map((model) => (
                  <Button
                    key={model.id}
                    variant={selectedModel?.id === model.id ? 'primary' : 'outline'}
                    onClick={() => handleModelSelect(model)}
                    className="w-full justify-start"
                  >
                    <div className="truncate">
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm opacity-70 truncate">
                        {model.description || model.id}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {selectedModel && (
              <div>
                <h3 className="text-lg font-medium mb-2">Model Versions</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {versions.map((version) => (
                    <Button
                      key={version.id}
                      variant={selectedVersion?.id === version.id ? 'primary' : 'outline'}
                      onClick={() => handleVersionSelect(version)}
                      className="w-full justify-start"
                    >
                      <div className="truncate">
                        <div className="font-medium">{version.id}</div>
                        <div className="text-sm opacity-70">
                          Created: {new Date(version.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleRunPrediction}
              isLoading={isLoading}
              disabled={!selectedModel || !selectedVersion}
            >
              Run Test Prediction
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
