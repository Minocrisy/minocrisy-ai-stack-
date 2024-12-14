import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextToSpeechGenerator } from '../TextToSpeechGenerator';
import { APIContext } from '../../contexts/APIContext';

// Mock ElevenLabs API
const mockSynthesize = jest.fn();
const mockGetVoices = jest.fn();

const mockElevenLabs = {
  synthesize: mockSynthesize,
  getVoices: mockGetVoices,
};

const mockAPIContext = {
  elevenLabs: mockElevenLabs,
};

// Mock voices data
const mockVoices = [
  { voice_id: 'voice1', name: 'Voice 1' },
  { voice_id: 'voice2', name: 'Voice 2' },
];

// Mock audio blob
const mockAudioBlob = new Blob(['test-audio'], { type: 'audio/mpeg' });

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();
window.URL.createObjectURL = mockCreateObjectURL;
window.URL.revokeObjectURL = mockRevokeObjectURL;

// Wrap component with API context
const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <APIContext.Provider value={mockAPIContext as any}>
      {ui}
    </APIContext.Provider>
  );
};

describe('TextToSpeechGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetVoices.mockResolvedValue(mockVoices);
    mockCreateObjectURL.mockReturnValue('mock-audio-url');
  });

  it('renders with initial state', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    expect(screen.getByText('Text to Speech Generator')).toBeInTheDocument();
    expect(screen.getByText('Upload Text File')).toBeInTheDocument();
    expect(screen.getByText('Generate Audio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter text or upload a file/i)).toBeInTheDocument();

    // Wait for voices to load
    await waitFor(() => {
      expect(mockGetVoices).toHaveBeenCalled();
    });
  });

  it('loads and displays voices', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    await waitFor(() => {
      expect(mockGetVoices).toHaveBeenCalled();
    });

    // Check if voices are in the select
    const voiceSelect = screen.getByLabelText(/select voice/i);
    expect(voiceSelect).toBeInTheDocument();

    fireEvent.click(voiceSelect);
    expect(screen.getByText('Voice 1')).toBeInTheDocument();
    expect(screen.getByText('Voice 2')).toBeInTheDocument();
  });

  it('handles text input', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    const textArea = screen.getByPlaceholderText(/enter text or upload a file/i);
    await userEvent.type(textArea, 'Test text for speech generation');

    expect(textArea).toHaveValue('Test text for speech generation');
  });

  it('handles text file upload', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    const file = new File(['Test content from file'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload text file/i);

    await userEvent.upload(input, file);

    const textArea = screen.getByPlaceholderText(/enter text or upload a file/i);
    await waitFor(() => {
      expect(textArea).toHaveValue('Test content from file');
    });
  });

  it('generates audio when form is submitted', async () => {
    const onAudioGenerated = jest.fn();
    renderWithContext(<TextToSpeechGenerator onAudioGenerated={onAudioGenerated} />);

    // Wait for voices to load
    await waitFor(() => {
      expect(mockGetVoices).toHaveBeenCalled();
    });

    // Select voice
    const voiceSelect = screen.getByLabelText(/select voice/i);
    fireEvent.change(voiceSelect, { target: { value: 'voice1' } });

    // Enter text
    const textArea = screen.getByPlaceholderText(/enter text or upload a file/i);
    await userEvent.type(textArea, 'Test text');

    // Mock successful audio generation
    mockSynthesize.mockResolvedValueOnce(mockAudioBlob);

    // Click generate button
    const generateButton = screen.getByText('Generate Audio');
    fireEvent.click(generateButton);

    // Check loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();

    // Wait for generation to complete
    await waitFor(() => {
      expect(mockSynthesize).toHaveBeenCalledWith('Test text', 'voice1');
      expect(onAudioGenerated).toHaveBeenCalledWith(expect.any(Blob));
    });

    // Check if playback controls appear
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('handles audio generation error', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    // Wait for voices to load
    await waitFor(() => {
      expect(mockGetVoices).toHaveBeenCalled();
    });

    // Select voice
    const voiceSelect = screen.getByLabelText(/select voice/i);
    fireEvent.change(voiceSelect, { target: { value: 'voice1' } });

    // Enter text
    const textArea = screen.getByPlaceholderText(/enter text or upload a file/i);
    await userEvent.type(textArea, 'Test text');

    // Mock failed audio generation
    mockSynthesize.mockRejectedValueOnce(new Error('Generation failed'));

    // Click generate button
    const generateButton = screen.getByText('Generate Audio');
    fireEvent.click(generateButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to generate audio')).toBeInTheDocument();
    });
  });

  it('handles audio playback controls', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    // Set up audio generation
    await waitFor(() => {
      expect(mockGetVoices).toHaveBeenCalled();
    });

    const voiceSelect = screen.getByLabelText(/select voice/i);
    fireEvent.change(voiceSelect, { target: { value: 'voice1' } });

    const textArea = screen.getByPlaceholderText(/enter text or upload a file/i);
    await userEvent.type(textArea, 'Test text');

    mockSynthesize.mockResolvedValueOnce(mockAudioBlob);

    // Generate audio
    fireEvent.click(screen.getByText('Generate Audio'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
    });

    // Mock audio element methods
    const mockPlay = jest.fn();
    const mockPause = jest.fn();
    window.HTMLMediaElement.prototype.play = mockPlay;
    window.HTMLMediaElement.prototype.pause = mockPause;

    // Test play/pause
    const playButton = screen.getByRole('button', { name: /play/i });
    fireEvent.click(playButton);
    expect(mockPlay).toHaveBeenCalled();

    // Should now show pause icon
    fireEvent.click(playButton);
    expect(mockPause).toHaveBeenCalled();
  });

  it('handles audio download', async () => {
    renderWithContext(<TextToSpeechGenerator />);

    // Set up audio generation
    await waitFor(() => {
      expect(mockGetVoices).toHaveBeenCalled();
    });

    const voiceSelect = screen.getByLabelText(/select voice/i);
    fireEvent.change(voiceSelect, { target: { value: 'voice1' } });

    const textArea = screen.getByPlaceholderText(/enter text or upload a file/i);
    await userEvent.type(textArea, 'Test text');

    mockSynthesize.mockResolvedValueOnce(mockAudioBlob);

    // Generate audio
    fireEvent.click(screen.getByText('Generate Audio'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    // Mock document.createElement
    const mockAnchorElement = {
      click: jest.fn(),
      setAttribute: jest.fn(),
      style: {},
    };
    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchorElement as any);

    // Test download
    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockAnchorElement.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });
});
