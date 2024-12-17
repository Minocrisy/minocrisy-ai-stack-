import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CharacterCreator } from '../CharacterCreator';
import { APIProvider } from '../../contexts/APIContext';
import { contentCreationService } from '../../services/api';
import { elevenLabsService } from '../../services/api';

// Mock services
jest.mock('../../services/api', () => ({
  contentCreationService: {
    generateCharacter: jest.fn(),
  },
  elevenLabsService: {
    getVoices: jest.fn(),
  },
}));

describe('CharacterCreator', () => {
  const mockVoices = [
    { voice_id: 'voice1', name: 'Voice 1' },
    { voice_id: 'voice2', name: 'Voice 2' },
  ];

  const mockModel = {
    id: 'model1',
    name: 'Test Model',
    provider: 'replicate',
    description: 'Test model description',
  };

  const mockVersion = {
    id: 'version1',
    created_at: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (elevenLabsService.getVoices as jest.Mock).mockResolvedValue(mockVoices);
  });

  const renderComponent = () => {
    return render(
      <APIProvider>
        <CharacterCreator />
      </APIProvider>
    );
  };

  it('loads and displays available voices', async () => {
    renderComponent();

    await waitFor(() => {
      expect(elevenLabsService.getVoices).toHaveBeenCalled();
    });

    const voiceSelect = screen.getByLabelText('Voice');
    expect(voiceSelect).toBeInTheDocument();
  });

  it('handles character generation with all fields filled', async () => {
    const mockPreviewUrl = 'https://example.com/preview.mp4';
    (contentCreationService.generateCharacter as jest.Mock).mockResolvedValue({
      url: mockPreviewUrl,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });

    renderComponent();

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText('Enter character name'), {
      target: { value: 'Test Character' },
    });

    // Mock model selection
    // Note: ModelSelector component would need its own tests
    const mockModelSelect = {
      model: mockModel,
      version: mockVersion,
    };

    // Simulate model selection
    const modelSelector = screen.getByLabelText('Character Model');
    fireEvent.change(modelSelector, { target: { value: JSON.stringify(mockModelSelect) } });

    // Select appearance
    const appearanceSelect = screen.getByLabelText('Appearance');
    fireEvent.change(appearanceSelect, { target: { value: 'casual' } });

    // Select animation
    const animationSelect = screen.getByLabelText('Animation');
    fireEvent.change(animationSelect, { target: { value: 'idle' } });

    // Click generate button
    const generateButton = screen.getByText('Generate Preview');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(contentCreationService.generateCharacter).toHaveBeenCalledWith({
        name: 'Test Character',
        voice: expect.any(String),
        model: mockModel,
        modelVersion: mockVersion,
        appearance: 'casual',
        animation: 'idle',
      });
    });

    // Check if preview is displayed
    const preview = await screen.findByRole('video');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute('src', mockPreviewUrl);
  });

  it('displays error message when required fields are missing', async () => {
    renderComponent();

    // Click generate without filling required fields
    const generateButton = screen.getByText('Generate Preview');
    fireEvent.click(generateButton);

    const errorMessage = await screen.findByText('Please fill in all required fields');
    expect(errorMessage).toBeInTheDocument();
  });

  it('handles generation error gracefully', async () => {
    (contentCreationService.generateCharacter as jest.Mock).mockRejectedValue(
      new Error('Generation failed')
    );

    renderComponent();

    // Fill minimum required fields
    fireEvent.change(screen.getByPlaceholderText('Enter character name'), {
      target: { value: 'Test Character' },
    });

    // Mock model selection
    const mockModelSelect = {
      model: mockModel,
      version: mockVersion,
    };
    const modelSelector = screen.getByLabelText('Character Model');
    fireEvent.change(modelSelector, { target: { value: JSON.stringify(mockModelSelect) } });

    // Select animation
    const animationSelect = screen.getByLabelText('Animation');
    fireEvent.change(animationSelect, { target: { value: 'idle' } });

    // Click generate button
    const generateButton = screen.getByText('Generate Preview');
    fireEvent.click(generateButton);

    const errorMessage = await screen.findByText('Generation failed');
    expect(errorMessage).toBeInTheDocument();
  });
});
