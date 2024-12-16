import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterCreator } from '../CharacterCreator';
import { APIContext } from '../../contexts/APIContext';
import type { ReplicateModel, ModelVersion } from '../../services/api/types';

// Mock API context
const mockVideo = {
  generateVideo: jest.fn(),
  getAvailableProviders: jest.fn(),
};

const mockElevenLabs = {
  synthesize: jest.fn(),
  getVoices: jest.fn().mockResolvedValue([
    { voice_id: 'voice1', name: 'Voice 1' },
    { voice_id: 'voice2', name: 'Voice 2' },
  ]),
};

const mockAPIContext = {
  video: mockVideo,
  elevenLabs: mockElevenLabs,
};

// Mock model data
const mockModel: ReplicateModel = {
  owner: 'test-owner',
  name: 'test-model',
  description: 'Test model description',
};

const mockVersion: ModelVersion = {
  id: 'version1',
  created_at: '2023-01-01',
};

// Wrap component with API context
const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <APIContext.Provider value={mockAPIContext as any}>
      {ui}
    </APIContext.Provider>
  );
};

describe('CharacterCreator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', async () => {
    renderWithContext(<CharacterCreator />);

    // Check for all form elements
    expect(screen.getByLabelText(/character name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/character model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/appearance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/animation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/voice/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate preview/i })).toBeInTheDocument();
  });

  it('loads available voices on mount', async () => {
    renderWithContext(<CharacterCreator />);

    await waitFor(() => {
      expect(mockElevenLabs.getVoices).toHaveBeenCalled();
    });

    // Check if voices are populated in the select
    const voiceSelect = screen.getByLabelText(/voice/i);
    expect(voiceSelect).toBeInTheDocument();
    
    // Open the select dropdown
    fireEvent.click(voiceSelect);
    
    // Check for voice options
    expect(screen.getByText('Voice 1')).toBeInTheDocument();
    expect(screen.getByText('Voice 2')).toBeInTheDocument();
  });

  it('handles form input changes', async () => {
    renderWithContext(<CharacterCreator />);

    // Fill in the form
    const nameInput = screen.getByLabelText(/character name/i);
    await userEvent.type(nameInput, 'Test Character');
    expect(nameInput).toHaveValue('Test Character');

    const appearanceSelect = screen.getByLabelText(/appearance/i);
    fireEvent.change(appearanceSelect, { target: { value: 'casual' } });
    expect(appearanceSelect).toHaveValue('casual');

    const animationSelect = screen.getByLabelText(/animation/i);
    fireEvent.change(animationSelect, { target: { value: 'idle' } });
    expect(animationSelect).toHaveValue('idle');
  });

  it('validates required fields before preview generation', async () => {
    renderWithContext(<CharacterCreator />);

    // Try to generate preview without filling required fields
    const generateButton = screen.getByRole('button', { name: /generate preview/i });
    fireEvent.click(generateButton);

    // Check for error message
    expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
  });

  it('generates preview when all required fields are filled', async () => {
    renderWithContext(<CharacterCreator />);
    const previewUrl = 'test-video-url.mp4';
    mockVideo.generateVideo.mockResolvedValueOnce(previewUrl);

    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/character name/i), 'Test Character');
    
    // Simulate model selection
    const mockModelSelect = jest.fn();
    // You might need to mock the ModelSelector component or its selection handler
    
    // Select appearance and animation
    fireEvent.change(screen.getByLabelText(/appearance/i), { target: { value: 'casual' } });
    fireEvent.change(screen.getByLabelText(/animation/i), { target: { value: 'idle' } });

    // Generate preview
    const generateButton = screen.getByRole('button', { name: /generate preview/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockVideo.generateVideo).toHaveBeenCalled();
    });
  });

  it('displays error message when video generation fails', async () => {
    renderWithContext(<CharacterCreator />);
    const errorMessage = 'Failed to generate video';
    mockVideo.generateVideo.mockRejectedValueOnce(new Error(errorMessage));

    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/character name/i), 'Test Character');
    
    // Select appearance and animation
    fireEvent.change(screen.getByLabelText(/appearance/i), { target: { value: 'casual' } });
    fireEvent.change(screen.getByLabelText(/animation/i), { target: { value: 'idle' } });

    // Generate preview
    const generateButton = screen.getByRole('button', { name: /generate preview/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('shows loading state during preview generation', async () => {
    renderWithContext(<CharacterCreator />);
    mockVideo.generateVideo.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/character name/i), 'Test Character');
    
    // Select appearance and animation
    fireEvent.change(screen.getByLabelText(/appearance/i), { target: { value: 'casual' } });
    fireEvent.change(screen.getByLabelText(/animation/i), { target: { value: 'idle' } });

    // Generate preview
    const generateButton = screen.getByRole('button', { name: /generate preview/i });
    fireEvent.click(generateButton);

    // Check for loading state
    expect(screen.getByText(/generating preview/i)).toBeInTheDocument();

    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.queryByText(/generating preview/i)).not.toBeInTheDocument();
    });
  });

  it('displays preview when video is generated successfully', async () => {
    renderWithContext(<CharacterCreator />);
    const previewUrl = 'test-video-url.mp4';
    mockVideo.generateVideo.mockResolvedValueOnce(previewUrl);

    // Fill in required fields
    await userEvent.type(screen.getByLabelText(/character name/i), 'Test Character');
    
    // Select appearance and animation
    fireEvent.change(screen.getByLabelText(/appearance/i), { target: { value: 'casual' } });
    fireEvent.change(screen.getByLabelText(/animation/i), { target: { value: 'idle' } });

    // Generate preview
    const generateButton = screen.getByRole('button', { name: /generate preview/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      const mediaControls = screen.getByRole('video');
      expect(mediaControls).toBeInTheDocument();
      expect(mediaControls).toHaveAttribute('src', previewUrl);
    });
  });
});
